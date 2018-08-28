const Koa = require('koa');
const app = new Koa();

const co = require('co');
const convert = require('koa-convert');
const router = require('koa-router')();
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')({
    enableTypes: ['json', 'text'],
    extendTypes: {
        text: ['html/text']
    }
});
const logger = require('koa-logger');


const session = require('koa-session');
const koaBody = require('koa-body');


import { router as apiRouter } from "./routers/api";
import { router as downloadRouter } from "./routers/download";

const config = require("./../../config/server")
const mongoDb = require('./db/MongoDb');
const services = require('./services');



const response_formatter = require('./middlewares/response_formatter');
const request_checkNeedParams = require('./middlewares/request_checkNeedParams');
const apiRequestLog = require('./middlewares/ApiRequestLog');
const encrypt = require('./middlewares/encrypt');

app.keys = ['DLIJOxxx9fdf0IDosddf'];



const CONFIG = {
    key: 'mars:sess',
    /** (string) cookie key (default is koa:sess) */
    maxAge: 86400000,
    /** (number) maxAge in ms (default is 1 days) */
    overwrite: true,
    /** (boolean) can overwrite or not (default true) */
    httpOnly: true,
    /** (boolean) httpOnly or not (default true) */
    signed: true,
    /** (boolean) signed or not (default true) */
};





exports.init = async function() {
        console.log("---------init")
        if (process.env.NODE_ENV == 'development') {
            var koaWebpack = require('koa-webpack');
            const config = require('../../build/webpack.config.js');
            koaWebpack({ config })
                .then((middleware) => {
                    app.use(middleware);
                });
        }

        app.use(session(CONFIG, app));

        app.use(koaBody({ multipart: true }));

        // middlewares
        //app.use(convert(bodyparser));




        //美化输出的json格式
        app.use(convert(json()));        
        let db=await mongoDb.connect(config.mongodb)        
        await services.ensureMongoDbIndex(db.collection)         
        await services.initAdminAccount(db.collection)        
        app.use(async(ctx, next) => {
            ctx.db = db.collection
            await next();
        });
         
        app.use(convert(logger()));

        app.use(require('koa-static')(__dirname + '/../../www'));


        // logger
        app.use(apiRequestLog('^/api/|^/file/'));         
        //添加格式化处理响应结果的中间件，在添加路由之前调用
        //仅对/api开头的url进行格式化处理
        app.use(response_formatter('^/api/admin'));

        //检查提交的数据是否包含必选参数
        app.use(request_checkNeedParams.check('/api'));

        router.use('/api', apiRouter.routes(), apiRouter.allowedMethods());
        router.use('/file', downloadRouter.routes(), downloadRouter.allowedMethods());


        app.use(router.routes(), router.allowedMethods());
         
        // response
        app.on('error', function(err, ctx) {
            console.log(err)
            console.error('server error', err, ctx);
        });        
        return app.callback()

}