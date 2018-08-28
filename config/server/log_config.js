/**
 * log4js 配置文件
 * 
 * 日志等级由低到高
 * ALL TRACE DEBUG INFO WARN ERROR FATAL OFF. 
 * 
 * 关于log4js的appenders的配置说明
 * https://github.com/nomiddlename/log4js-node/wiki/Appenders
 */

var path = require('path');
//日志根目录
var baseLogPath = path.resolve(__dirname, '../../logs')

//错误日志目录
var androidTouchsdk_errorPath = "/api/";
var androidTouchadmin_errorPath = "/admin/";
//错误日志文件名
var errorFileName = "error";
//错误日志输出完整路径
var androidTouchsdk_errorLogPath = baseLogPath + androidTouchsdk_errorPath + "/" + errorFileName;
var androidTouchadmin_errorLogPath = baseLogPath + androidTouchadmin_errorPath + "/" + errorFileName;

// var errorLogPath = path.resolve(__dirname, "../logs/error/error");


//响应日志目录
var androidTouchsdk_responsePath = "/api/";
var androidTouchadmin_responsePath = "/admin/";
//响应日志文件名
var responseFileName = "response";
//响应日志输出完整路径
var androidTouchsdk_responseLogPath = baseLogPath + androidTouchsdk_responsePath + "/" + responseFileName;
var androidTouchadmin_responseLogPath = baseLogPath + androidTouchadmin_responsePath + "/" + responseFileName;
// var responseLogPath = path.resolve(__dirname, "../logs/response/response");

module.exports = {
    "appenders": [
        { type: 'console' },
        //错误日志
        {
            "category": "androidTouchsdk.errorLogger", //logger名称
            "type": "dateFile", //日志类型
            "filename": androidTouchsdk_errorLogPath, //日志输出位置
            "alwaysIncludePattern": true, //是否总是有后缀名
            "pattern": "-yyyy-MM-dd.log", //后缀，每天创建一个新的日志文件
            "path": androidTouchsdk_errorPath //自定义属性，错误日志的根目录
        },
        //响应日志
        {
            "category": "androidTouchsdk.resLogger",
            "type": "dateFile",
            "filename": androidTouchsdk_responseLogPath,
            "alwaysIncludePattern": true,
            "pattern": "-yyyy-MM-dd.log",
            "path": androidTouchsdk_responsePath
        },
        //错误日志
        {
            "category": "androidTouchadmin.errorLogger", //logger名称
            "type": "dateFile", //日志类型
            "filename": androidTouchadmin_errorLogPath, //日志输出位置
            "alwaysIncludePattern": true, //是否总是有后缀名
            "pattern": "-yyyy-MM-dd.log", //后缀，每天创建一个新的日志文件
            "path": androidTouchadmin_errorPath //自定义属性，错误日志的根目录
        },
        //响应日志
        {
            "category": "androidTouchadmin.resLogger",
            "type": "dateFile",
            "filename": androidTouchadmin_responseLogPath,
            "alwaysIncludePattern": true,
            "pattern": "-yyyy-MM-dd.log",
            "path": androidTouchadmin_responsePath
        }
    ],
    "levels": //设置logger名称对应的的日志等级
    {
        "sdk.errorLogger": "ERROR",
        "sdk.resLogger": "ALL",
        "admin.resLogger": "ERROR",
        "admin.resLogger": "ALL"
    },
    "baseLogPath": baseLogPath //logs根目录
}