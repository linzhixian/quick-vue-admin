const rc4encry = require('../utils/Rc4Encrypt.js');



function decrypt(ctx) {
    var encrypt = ctx.header['encrypt'];
    console.log("encrypt:" + encrypt);
    console.log("beore decode:", ctx.request.rawBody, ctx.request.body, ctx.body);
    if (encrypt == "true") {

        if (ctx.request.rawBody) {
            var ss = rc4encry.rc4Decode(ctx.request.rawBody);
            console.log("decode:" + ss);
            ctx.request.body = JSON.parse(ss);
        }
    }
}



function encrypt(ctx) {
    let encrypt = ctx.header['encrypt'];
    if (encrypt == "true") {
        ctx.set("content-type", "html/text");
        if (ctx.body) {
            ctx.body = rc4encry.rc4Encrypt(ctx.body.replace(/\r\n/g, ""));
        }
    }
}
var url_filter = (pattern) => {

    return async(ctx, next) => {

        var reg = new RegExp(pattern);
        let isFit = reg.test(ctx.originalUrl)
        if (isFit) {
            decrypt(ctx);
        }
        await next();
        if (isFit) {
            encrypt(ctx);
        }
    }
}

// module.exports = response_formatter;
module.exports = url_filter;