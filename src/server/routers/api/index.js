var router = require('koa-router')();


import { router as adminRouter } from './admin';


router.use('/admin', adminRouter.routes(), adminRouter.allowedMethods());





export { router };