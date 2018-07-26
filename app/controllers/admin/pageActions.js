let { utility, ApiError, ApiErrorNames, config, services, baseDao } = require('../include');
const send = require('koa-send')

var fs = require('fs')
const pathUtil = require('path');
const md5File = require('md5-file')
const makeDir = require('make-dir');


function toCollName(entityName) {
    return entityName;
}

function toFilterCondition(filter, serverHook, metaData, ctx) {
    let conditions = {};
    if (filter) {
        if (serverHook && serverHook.beforeFilter) {
            filter = serverHook.beforeFilter(filter, ctx);
        }
        for (let key of Object.keys(filter)) {
            if (filter[key] && filter[key] != "") {
                if (!metaData.columnsMap[key]) { //如果字段没有在columnDef中定义就默认equal 
                    conditions[key] = filter[key];
                } else {
                    let colDef = metaData.columnsMap[key];
                    if (colDef.filter) {
                        if ((colDef.filter == true && (typeof filter[key]) == 'string') || (colDef.filter.method && colDef.filter.method == 'like')) {
                            conditions[key] = { $regex: filter[key] };
                        } else if (colDef.filter.method) {
                            if (colDef.filter.method == 'equal') {
                                conditions[key] = filter[key];
                            } else if (colDef.filter.method == 'between') {
                                conditions[key] = {};
                                if (filter[key].from) {
                                    conditions[key].$gte = filter[key].from;
                                }
                                if (filter[key].to) {
                                    conditions[key].$lte = filter[key].to;
                                }
                            } else {
                                conditions[key] = filter[key];
                            }
                        } else {
                            conditions[key] = filter[key];
                        }

                    } else {
                        if (typeof filter[key] == 'string') {
                            conditions[key] = { $regex: filter[key] };
                        } else {
                            conditions[key] = filter[key];
                        }
                    }
                }
            }
        }
    }
    return conditions;
}

function writeSyncFile(reader, writer) {
    return new Promise((resolve) => {
        reader.pipe(writer);
        reader.on('close', () => {
            resolve(true);
        });
    });
}

function findColumnDefInput(prop, metaData) {
    if (!metaData.columnsDef) return null
    for (let one of metaData.columnsDef) {
        if (one.prop == prop) {
            return one.input
        }
    }
    return null
}


async function saveUploadFile(body, serverHook, metaData) {
    let doc = body.fields;    
    for (let one of Object.keys(body.files)) {
        let input = findColumnDefInput(one, metaData)
        if (!input || input.type != 'file') {
            return
        }

        let file = body.files[one];
        
        if(input.savePath) {
            const reader = fs.createReadStream(file.path);
            let newFileName = input.fileName(file.name);
            // 本地上传放置于public目录下
            makeDir.sync(pathUtil.join(process.cwd(),config.dataDir,input.savePath));
            // 原目录名
            let originalPath = pathUtil.join(input.savePath, newFileName);
            // 本地目录名
            let fileSavePath =  pathUtil.join(process.cwd(),config.dataDir, originalPath);
            console.log("--saveFileTo:" + fileSavePath);
            const writer = fs.createWriteStream(fileSavePath);
            let ok = await writeSyncFile(reader, writer);
            let md5 = md5File.sync(fileSavePath);
            let states = fs.statSync(fileSavePath);
            let size = String(states.size);
            doc[one] = { path: originalPath, md5, size, name: newFileName, srcName: file.name };
        } else {
            throw new Error("when save uploadfile,but no input.savePath")
        }
        
    }
    return doc;
}
let actionMap = {

    updateTree: function(ctx, entityName, serverHook, metaData) {
        return new Promise(async(resolve, reject) => {
            let doc = ctx.request.body;
            try {
                if (serverHook && serverHook.beforeEdit) {
                    doc = serverHook.beforeEdit(doc);
                }
                let { top, path, children } = doc.$path;
                delete doc._id;
                delete doc.$path;
                let _id = top;
                let $set = {};
                if (top && !path) {
                    $set = doc;
                } else {
                    for (let item of Object.keys(doc)) {
                        $set[path + "." + item] = doc[item];
                    }
                }
                
                ctx.db.getCollection(toCollName(entityName)).update({ _id }, { $set }, { upsert: true }, function(ok) {
                    resolve(ok);
                });
            } catch (e) {
                reject(e);
            }

        });
    },
    addTree: function(ctx, entityName, serverHook) {
        return new Promise(async(resolve, reject) => {

            let doc = ctx.request.body;
            console.log(doc);
            try {
                if (serverHook && serverHook.beforeAdd) {
                    doc = await serverHook.beforeAdd(doc, ctx);
                }
                let { top, path, children } = doc.$path;
                let _id = top ? top : doc._id;
                let $set = {};
                if (!top && !path) {
                    $set = doc;
                } else if (!path) {
                    $set[children + "." + doc._id] = doc;
                } else {
                    $set[path + "." + children + "." + doc._id] = doc;
                }
                delete doc._id;
                delete doc.$path;
                console.log("key:" + _id);
                console.log($set);
                ctx.db.getCollection(toCollName(entityName)).update({ _id }, { $set }, { upsert: true }, function(ok) {
                    resolve(ok);
                });
            } catch (e) {
                reject(e);
            }

        });
    },
    removeTree(ctx, entityName, serverHook) {
        return new Promise(async(resolve, reject) => {
            let doc = ctx.request.body;
            try {
                if (serverHook && serverHook.beforeRemove) {
                    doc = serverHook.beforeRemove(doc);
                }
                console.log(doc);
                let { top, path, children } = doc.$path;
                console.log("top:" + top);
                console.log("path:" + path);
                if (top && !path) {
                    console.log("path:" + (top && !path));
                    ctx.db.getCollection(toCollName(entityName)).deleteMany({ _id: top }, function(deleteCount) {
                        if (deleteCount == 1) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    })
                    return;
                } else {
                    let _id = top ? top : doc._id;
                    let $unset = {};
                    $unset[path] = doc;
                    console.log("key:" + _id);
                    console.log($unset);
                    ctx.db.getCollection(toCollName(entityName)).update({ _id }, { $unset }, { upsert: true }, function(ok) {
                        resolve(ok);
                    });
                }
            } catch (e) {
                reject(e);
            }

        });
    },
    add: async function(ctx, entityName, serverHook, metaData) {
        console.log("-------add:");

        let doc = null;
        if (ctx.request.body.files) {
            doc = await saveUploadFile(ctx.request.body, serverHook, metaData);
        } else {
            doc = ctx.request.body;
        }
        if (serverHook && serverHook.beforeAdd) {
            doc = await serverHook.beforeAdd(doc, ctx,metaData);
        }
        console.log("-------add:" + JSON.stringify(doc));
        let ok = await baseDao.save(ctx.db, toCollName(entityName), doc)
        if (!ok) {
            throw new ApiError(ApiErrorNames.DUPLICATE_KEY);
        }
        return true


    },
    edit: async function(ctx, entityName, serverHook, metaData) {
        let doc = null;
        if (ctx.request.body.files) {
            doc = await saveUploadFile(ctx.request.body, serverHook, metaData);
            //FormData.append("accountnum", 123456) 会把num转为str,所以要转回来，未来_id应该都改为用str
        } else {
            doc = ctx.request.body;
        }
        console.log("--edit:" + JSON.stringify(doc));
        if (serverHook && serverHook.beforeUpdate) {
            doc = serverHook.beforeUpdate(doc);
        }
        let ok = await baseDao.update(ctx.db, toCollName(entityName), doc)
        if (!ok) {
            throw new ApiError(ApiErrorNames.DUPLICATE_KEY);
        }
        return true

    },
    remove: async function(ctx, entityName, serverHook,metaData) {
            let doc = ctx.request.body;            
                //conditions, callback, projects, sort, limit,skip
            if (serverHook && serverHook.beforeRemove) {
                    await serverHook.beforeRemove(doc,ctx,metaData);
            }
            let deleteCount=await baseDao.remove(ctx.db,toCollName(entityName),{_id: doc.id})
            return deleteCount

    },
    batchremove: async function(ctx, entityName, serverHook,metaData) {        
            let doc = ctx.request.body;

            if (serverHook && serverHook.beforeBatchRemove) {
                    await serverHook.beforeBatchRemove(doc,ctx,metaData);
            }
            let ops = {
                    _id: {
                        $in: doc.ids
                    }
            };
            let deleteCount=await baseDao.remove(ctx.db,toCollName(entityName),ops)
            return deleteCount

    },
    list: async function(ctx, entityName, serverHook, metaData) {
        return new Promise((resolve, reject) => {
            console.log("list:" + entityName);
            //conditions, callback, projects, sort, limit,skip  
            let { filter, projects } = ctx.request.body;
            let conditions = toFilterCondition(filter, serverHook, metaData, ctx);;
            try {
                console.log("list conditions:" + JSON.stringify(conditions));

                if (serverHook && serverHook.beforeList) {
                    conditions = serverHook.beforeList(conditions);
                }
                ctx.db.getCollection(toCollName(entityName)).find(conditions, function(reply) {
                    if (reply.documents.length > 0) {
                        let docs = reply.documents;
                        if (serverHook && serverHook.afterList) {
                            docs = serverHook.afterList(docs);
                        }
                        ctx.body = docs;
                        resolve(true);
                    } else {
                        ctx.body = [];
                        resolve(true);
                    }
                }, projects, null, null, null);

            } catch (e) {
                reject(e);
            }
        });
    },
    listpage: async function(ctx, entityName, serverHook, metaData) {
        function countTotal(db, entityName, filter) {
            return new Promise((resolve, reject) => {
                let { filter } = ctx.request.body;
                let conditions = toFilterCondition(filter, serverHook, metaData, ctx);
                console.log("conditions =================== " + JSON.stringify(conditions));
                db.getCollection(toCollName(entityName)).count(conditions, function(total) {
                    resolve(total);
                })
            });
        }

        function findRecords(db, entityName, pageSize, page, filter, sort, ctx) {
            return new Promise((resolve, reject) => {
                //conditions, callback, projects, sort, limit,skip
                let { filter } = ctx.request.body;
                let conditions = toFilterCondition(filter, serverHook, metaData, ctx);
                let limit = pageSize;
                let skip = (page - 1) * pageSize;
                console.log("serverHook:" + serverHook);
                console.log("conditions:" + JSON.stringify(conditions));
                db.getCollection(toCollName(entityName)).find(conditions, function(reply) {
                    if (reply.documents.length > 0) {
                        resolve(reply.documents);
                    } else {
                        resolve([]);
                    }
                }, null, sort, limit, skip)
            });
        }


        console.log("--listpage:1");
        let {
            pageSize,
            page,
            filter
        } = ctx.request.body;
        // try {
        if (serverHook && serverHook.beforeListPage) {
            serverHook.beforeListPage(ctx.request.body, ctx);
        }
        let sort = metaData.sorted ? metaData.sorted : null;
        let records = await findRecords(ctx.db, entityName, pageSize, page, filter, sort, ctx);
        if (serverHook && serverHook.afterListPage) {
            records = serverHook.afterListPage(records, ctx.request.body);
        }
        let total = await countTotal(ctx.db, entityName, filter);
        ctx.body = {
            records: records,
            total
        };
        /*        } catch (e) {
                    reject(e);
                }*/
        return true;
    },
    download: async function(ctx, entityName, serverHook, metaData) {

        let { _id, prop } = ctx.query
        let error = { error: 'no' }
        if (_id && prop) {
            let record = await baseDao.queryOne(ctx.db, toCollName(entityName), _id);
            if (record) {
                let fileInfo = record[prop]
                if (fileInfo && fileInfo.path && fileInfo.srcName) {
                    console.log("----------attachment", fileInfo.srcName)
                    ctx.attachment(fileInfo.srcName)
                    //let absPath = pathUtil.join(process.cwd(), config.dataDir)
                    //console.log("downloadFile:",absPath+fileInfo.path)
                    await send(ctx, fileInfo.path, { root: config.dataDir })
                    return true
                } else {
                    error.error = fileInfo
                }
            } else {
                error.error = entityName + ":" + _id
            }
        }
        error.query = ctx.query
        ctx.body = error
        return true
    }

};


export default actionMap;