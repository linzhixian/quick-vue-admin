var utility = require('utility');
var config = require('../../../config');

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