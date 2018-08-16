const send = require('koa-send')
const pathUtil=require("path")
const fs=require("fs")

let { utility, ApiError, ApiErrorNames, config, services, baseDao } = require('../include');


let path = "/downloadTemp/:path*";


async function doRequest(ctx, next) {
    console.log("------------downloadTemp",ctx.params)
    let { path } = ctx.params;
    let absPath = pathUtil.join(process.cwd(), config.dataDir)
    let filePath=pathUtil.join(absPath,path)
    console.log(filePath)
    if(fs.existsSync(filePath)) {
        await send(ctx, path, { root: absPath })   
        return
    }  
    ctx.status = 404

}

export { path, doRequest };