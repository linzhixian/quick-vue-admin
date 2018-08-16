var log4js = require('log4js');

var log_config = require('../../../config/server/log_config');

//加载配置文件
log4js.configure(log_config);

var logUtil = {};

var sdk_errorLogger = log4js.getLogger('androidTouchsdk.errorLogger');
var sdk_resLogger = log4js.getLogger('androidTouchsdk.resLogger');

var admin_errorLogger = log4js.getLogger('androidTouchadmin.errorLogger');
var admin_resLogger = log4js.getLogger('androidTouchadmin.resLogger');

var loggerMap = {};
loggerMap.androidTouchsdk = { error: sdk_errorLogger, res: sdk_resLogger };
loggerMap.androidTouchadmin = { error: admin_errorLogger, res: admin_resLogger };
loggerMap.default = { error: admin_errorLogger, res: admin_resLogger };

function getLogger(module, type) {
    return loggerMap[module][type];
}
function getErrorLogger(ctx) {
    let moduleName = getModuleName(ctx.path);
    return loggerMap[moduleName].error;
}
function getResLogger(ctx) {
    let moduleName = getModuleName(ctx.path);
    return loggerMap[moduleName].res;
}
function getModuleName(path) {
    if (path.startsWith("/api/androidTouchsdk")) {
        return "androidTouchsdk";
    }
    if (path.startsWith("/api/androidTouchadmin")) {
        return "androidTouchadmin";
    }
    return "default";
}
//封装错误日志
logUtil.logError = function (ctx, error, resTime) {
    if (ctx && error) {
        getErrorLogger(ctx).error(formatError(ctx, error, resTime));
    }
};

//封装响应日志
logUtil.logResponse = function (ctx, resTime) {
    if (ctx) {
        getResLogger(ctx).info(formatRes(ctx, resTime));
    }
};

//格式化响应日志
var formatRes = function (ctx, resTime) {
    var logText = new String();

    //响应日志开始
    logText += "\n" + "*************** response log start ***************" + "\n";

    //添加请求日志
    logText += formatReqLog(ctx.request, resTime);

    //响应状态码
    logText += "response status: " + ctx.status + "\n";

    //响应内容
    logText += "response body: " + "\n" + JSON.stringify(ctx.body) + "\n";

    //响应日志结束
    logText += "*************** response log end ***************" + "\n";

    return logText;

}

//格式化错误日志
var formatError = function (ctx, err, resTime) {
    var logText = new String();

    //错误信息开始
    logText += "\n" + "*************** error log start ***************" + "\n";

    //添加请求日志
    logText += formatReqLog(ctx.request, resTime);

    //错误名称
    logText += "err name: " + err.name + "\n";
    //错误信息
    logText += "err message: " + err.message + "\n";
    if (err.other) {
        //额外错误信息
        logText += "err other message: " + err.other + "\n";
    }
    //错误详情
    logText += "err stack: " + err.stack + "\n";

    //错误信息结束
    logText += "*************** error log end ***************" + "\n";

    return logText;
};

//格式化请求日志
var formatReqLog = function (req, resTime) {

    var logText = new String();

    var method = req.method;
    //访问方法
    logText += "request method: " + method + "\n";
    logText += "request conentType: " + req.header['content-type'] + "\n";
    //请求原始地址
    logText += "request originalUrl:  " + req.originalUrl + "\n";

    //客户端ip
    logText += "request client ip:  " + req.ip + "\n";

    //开始时间
    var startTime;
    //请求参数
    if (method === 'GET') {
        logText += "request query:  " + JSON.stringify(req.query) + "\n";
        // startTime = req.query.requestStartTime;
    } else {
        logText += "request body: " + "\n" + JSON.stringify(req.body) + "\n";
        // startTime = req.body.requestStartTime;
    }
    //服务器响应时间
    logText += "response time: " + resTime + "\n";

    return logText;
}

module.exports = logUtil;
