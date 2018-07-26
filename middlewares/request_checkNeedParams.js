


var ApiError = require('../app/error/ApiError');
var ApiErrorNames = require('../app/error/ApiErrorNames');

var CHECK_MAP = {
};

var checkNeedParams = (ctx, pattern) => {
    var path = ctx.originalUrl.replace(pattern, "");
    var needParams = [];

    for (let key of Object.keys(CHECK_MAP)) {
       if(path.endsWith(key)) {
             needParams = CHECK_MAP[key];
             break;
       }
    }

    var data = ctx.request.body;
    if(ctx.request.body.fields) {
        data=ctx.request.body.fields;
    }
    if (data) {
        for (let i = 0; i < needParams.length; i++) {
            let paramNames = needParams[i];
            let names = paramNames.split(".");
            let current={};
            for (let x = 0; x < names.length; x++) {
                if(x==0) {
                     if (!data[names[x]]) {
                         throw new ApiError(ApiErrorNames.ILLEGAL_PARAM,"no param:" + toStrs(names,x));
                         
                     } else {
                         current=data[names[x]];
                     }
                } else {
                     if (!current[names[x]]) {
                        throw new ApiError(ApiErrorNames.ILLEGAL_PARAM,"no param:" + toStrs(names,x));                         
                     } else {
                         current=current[names[x]];
                     }
                }
            }

        }
    }

}
function toStrs(names,x) {
    var str="";
    for(let i=0;i<names.length;i++) {
      if(i<=x) {
          str=str+names[i];
      }
      if(i<x) {
          str=str+".";
      }
    }
    return str;
}
var check = (pattern) => {

    return async (ctx, next) => {

        var reg = new RegExp("^" + pattern);
        //通过正则的url进行参数检查
        if (reg.test(ctx.originalUrl)) {
            checkNeedParams(ctx, pattern);
            await next();
        } else {
            await next();
        }


    }
}

var register = (pattern, fun) => {
    CHECK_MAP[pattern] = fun;
}
// module.exports = response_formatter;

exports.check = check;
exports.register = register;

