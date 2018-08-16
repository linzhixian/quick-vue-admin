//log工具
const logUtil = require('../utils/log_util');

var ApiError = require('../error/ApiError');


var url_filter = (pattern) => {

    return async(ctx, next) => {
        //响应开始时间
        const start = new Date();
        //响应间隔时间
        var ms;

        var reg = new RegExp(pattern);

        try {
            //先去执行路由
            await next();
        } catch (error) {
            ctx.status = 200;
            //如果异常类型是API异常并且通过正则验证的url，将错误信息添加到响应体中返回。
            if (error instanceof ApiError && reg.test(ctx.originalUrl)) {
                ms = new Date() - start;
                //记录异常日志
                logUtil.logError(ctx, error, ms);

                ctx.body = {
                    status: {
                        code: error.code.toString(),
                        msg: error.message,
                        other:error.other
                    }
                }
            } else {
                let code = 'unknow';
                let msg = error.name + ":" + error.message;
                ctx.body = { status: { code, msg } };
            }
            //继续抛，让外层中间件处理日志
            //throw error;
        }

        //通过正则的url进行格式化处理
        if (reg.test(ctx.originalUrl)) {
            ms = new Date() - start;
            //记录响应日志
            logUtil.logResponse(ctx, ms);
        }
    }
}


// module.exports = response_formatter;
module.exports = url_filter;