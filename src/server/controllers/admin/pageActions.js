const R = require('ramda')
let { utility, ApiError, ApiErrorNames, config, services,metaIndex,CommonUtils } = require('../../include');
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
async function dbref(db,findocs,metaData,project) {      
    let refColumns=[]
    let deRefOne=async function(column){          
          let metaData=metaIndex[column.input.ajax.path]
          let filter={}
          let values=[]
          for(let one of findocs) {

            let otype=typeof one[column.prop]             
            if(otype=='string' || otype=='number') {
              values.push(one[column.prop])
            } else if(Array.isArray(one[column.prop])){
                values=values.concat(one[column.prop])                
            }
          }
          filter[column.input.ajax.value]={$in:values}
          let project={}
          project[column.input.ajax.label]=1
          project[column.input.ajax.value]=1          
          let find=db(metaData.entityName).find(filter).project(project)                      
          let docs=await find.toArray()          
          let findObj=function(docs,prop,value,take){
            let vt=typeof value            
            if(vt=='string' || vt=='number') {
             let item=CommonUtils.findObjInArray(docs,prop,value)
             if(item && item[take]) return item[take]

            } else if(Array.isArray(value)) {
                let ret=[]
                for(let one of value) {
                     let item=CommonUtils.findObjInArray(docs,prop,one)
                     if(item && item[take]){
                        ret.push(item[take])
                     } else {
                         ret.push(one)
                     }
                }
                if(ret.length>0) return ret
            }
            return null
          }
          for(let item of findocs) {
            item['@'+column.prop]=item[column.prop]
            let find=findObj(docs,column.input.ajax.value,item[column.prop],column.input.ajax.label)
            if(find) {
             item['@'+column.prop]=find
            }
          }
         

    }
    for(let one of metaData.columnsDef) {
        if(one && !one.hidden &&  one.input && one.input.ajax)  {
            if(typeof(one.autoRef) == "undefined" || one.autoRef) {
                if(!project || (project && project[one.prop])) {
                 await deRefOne(one)
               }
            }
        }
    }
    return findocs
}
function writeSyncFile(reader, writer) {
    return new Promise((resolve) => {
        reader.pipe(writer);
        writer.on('close', () => {
            resolve(true);
        });
    });
}

function findColumnDefInput(prop, metaData) {
    if (!metaData.columnsDef) return null

    let find= R.compose(R.prop('input'),R.find(R.propEq('prop', prop)))
    return find(metaData.columnsDef)
}


async function saveUploadFile(body, serverHook, metaData) {
    let doc = {}   
     if(body.fields["_data"]) {
        doc=JSON.parse(body.fields["_data"])
     }
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
            let size = states.size;
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
                if (serverHook && serverHook.beforeUpdate) {
                    doc = serverHook.beforeUpdate(doc,ctx);
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
                
                ctx.db(entityName).update({ _id }, { $set }, { upsert: true }, function(err,ok) {
                 if(err) {
                    console.log(err)
                    resolve(false)
                }  else {
                        resolve(true)
                    }

                });
            } catch (e) {
                reject(e);
            }

        });
    },
    addTree: function(ctx, entityName, serverHook,metaData) {
        return new Promise(async(resolve, reject) => {

            let doc = ctx.request.body;
            console.log(doc);
            try {
                if (serverHook && serverHook.beforeAdd) {
                    doc = await serverHook.beforeAdd(doc, ctx,metaData);
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
                ctx.db(entityName).updateOne({ _id }, { $set }, { upsert: true }, function(err,ok) {
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
                    doc = serverHook.beforeRemove(doc,ctx);
                }
                console.log(doc);
                let { top, path, children } = doc.$path;
                console.log("top:" + top);
                console.log("path:" + path);
                if (top && !path) {
                    console.log("path:" + (top && !path));
                    ctx.db(entityName).deleteOne({ _id: top }, function(err,result) {
                        if (result.deletedCount == 1) {
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
                    ctx.db(entityName).updateOne({ _id }, { $unset }, { upsert: true }, function(err,result) {
                        resolve(result);
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
        try {    
         await ctx.db(entityName).insert(doc)
         return true
        } catch(err) {
            console.log("err",err.toString())
            if(err.code==11000) {
             throw new ApiError(ApiErrorNames.DUPLICATE_KEY);
           } else {
             throw new ApiError(ApiErrorNames.UNKNOW_ERROR,err.errmsg);
           }
        }        


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
            doc = serverHook.beforeUpdate(doc,ctx);
        }        
        try {
         await ctx.db(entityName).findOneAndUpdate({_id:doc._id},{$set: doc} )
         return true
        } catch(err) {
            console.log("err",err.toString())
            if(err.code==11000) {
             throw new ApiError(ApiErrorNames.DUPLICATE_KEY);
           } else {
             throw new ApiError(ApiErrorNames.UNKNOW_ERROR,err.errmsg);
           }
        } 

    },
    remove: async function(ctx, entityName, serverHook,metaData) {
            let doc = ctx.request.body;            
                //conditions, callback, projects, sort, limit,skip
            if (serverHook && serverHook.beforeRemove) {
                    await serverHook.beforeRemove(doc,ctx,metaData);
            }
            
            let result=await ctx.db(entityName).deleteOne({_id: doc.id})
            return result.deletedCount

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
            let result=await ctx.db(entityName).deleteMany(ops)
            console.log("deleteMany",result)
            return result.deletedCount

    },
    list: async function(ctx, entityName, serverHook, metaData) {        
            console.log("list:" + entityName);
            //conditions, callback, projects, sort, limit,skip  
            let { filter, projects } = ctx.request.body;
            let conditions = toFilterCondition(filter, serverHook, metaData, ctx);;            
                console.log("list conditions:" + JSON.stringify(conditions));

                if (serverHook && serverHook.beforeList) {
                    serverHook.beforeList(conditions,ctx);
                }
                let findDocs=ctx.db(entityName).find(conditions)
                if (projects) {
                    findDocs = findDocs.project(projects);
                }
                let docs=await findDocs.toArray()
                docs=await dbref(ctx.db,docs,metaData,projects)
               if (serverHook && serverHook.afterList) {
                            docs = serverHook.afterList(docs,conditions,ctx);
                }

                ctx.body=docs
                return true
       
    },
    listpage: async function(ctx, entityName, serverHook, metaData) {
        function countTotal(db, entityName, filter) {
            return new Promise((resolve, reject) => {
                let { filter } = ctx.request.body;
                let conditions = toFilterCondition(filter, serverHook, metaData, ctx);
                console.log("conditions =================== " + JSON.stringify(conditions));
                db(entityName).count(conditions, function(err,total) {
                    resolve(total);
                })
            });
        }

        async function findRecords(db, entityName, pageSize, page, filter0, sort, ctx) {
                //conditions, callback, projects, sort, limit,skip
                let conditions = toFilterCondition(filter, serverHook, metaData, ctx);
                let limit = pageSize;
                let skip = (page - 1) * pageSize;
                console.log("serverHook:" + serverHook);
                console.log("conditions:" + JSON.stringify(conditions));
                let findDocs=db(entityName).find(conditions)
                if (sort) {
                    findDocs = findDocs.sort(sort);
                }                
                if (skip) {
                    findDocs = findDocs.skip(skip);
                }
                if (limit) findDocs = findDocs.limit(limit);

                return dbref(db,await findDocs.toArray(),metaData,null);

            
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
            records = serverHook.afterListPage(records, ctx.request.body,ctx);
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
            let record=await ctx.db(entityName).findOne({_id})
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