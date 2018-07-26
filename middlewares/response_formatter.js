var ApiError = require('../app/error/ApiError');

/**
 * 在app.use(router)之前调用
 */
var response_formatter = (ctx) => {
    //如果有返回数据，将返回数据添加到data中
    let res = {
        status: {
            code: "0",
            msg: 'success'
        }
    }
    if (ctx.body) {
        res.data = ctx.body;
    }
    ctx.body = res;
}

var url_filter = (pattern) => {

    return async(ctx, next) => {

        var reg = new RegExp(pattern);
        let fit=reg.test(ctx.originalUrl)
        if(fit) {
        try {
            //先去执行路由
            await next();
        } catch (error) {
            //如果异常类型是API异常并且通过正则验证的url，将错误信息添加到响应体中返回。
            console.log("---catch error in response_formatter");
            console.log(error);
            if (reg.test(ctx.originalUrl)) {
                let code = '';
                let msg = '';
                let other=null
                if (error instanceof ApiError) {
                    code = error.code.toString();
                    msg = error.message;
                    if(error.other) other=error.other
                } else {
                    code = 'unknow';
                    msg = error.name + ":" + error.message;
                }
                ctx.status = 200;
                ctx.body = { status: { code, msg,other } };
            }


            //继续抛，让外层中间件处理日志
            throw error;
        }
        //通过正则的url进行格式化处理       

            response_formatter(ctx);
        } else {
             await next();
        }
    }
}

// module.exports = response_formatter;
module.exports = url_filter;