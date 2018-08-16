

let path = "/logout";
let needParams = [];

async function doRequest(ctx, next) {
    ctx.session=null;   
    console.log("unSetSession：");
}


export {
    path,
    needParams,
    doRequest
};