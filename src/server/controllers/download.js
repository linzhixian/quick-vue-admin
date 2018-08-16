const send = require('koa-send')
const pathUtil=require("path")
const fs=require("fs")


let {metaIndex,metaIndexServer} = require('../include');



let path = "/download/:path*";


async function doRequest(ctx, next) {
    let { path } = ctx.params;
    let metaData = metaIndex["/" + path];
    let metaDataServer = metaIndexServer["/" + path+"_server"];    
    let entityName = metaIndex.entityName;
    let { _id, prop } = ctx.query    
    if (_id && prop) {
        let record = await baseDao.queryOne(ctx.db, entityName, _id);
        if (record) {
            let fileInfo = record[prop]
            if (fileInfo && fileInfo.path && fileInfo.srcName) {
                console.log("----------attachment", fileInfo.srcName)
                ctx.attachment(fileInfo.srcName)
                let absPath = pathUtil.join(process.cwd(), config.dataDir)
                console.log("downloadFile:",absPath)
                let filePath=pathUtil.join(absPath,fileInfo.path)
                if(fs.existsSync(filePath)) {
                  await send(ctx, fileInfo.path, { root: absPath })   
                  return
                }else {
                    console.log("file not found:",filePath)
                }     
            }
        }
    }
    ctx.status = 404
}

export { path, doRequest };