var router = require('koa-router')();



import * as download from './../../controllers/download';
import * as downloadTemp from './../../controllers/downloadTemp';




router.get(download.path, download.doRequest);


router.get(downloadTemp.path, downloadTemp.doRequest);

export { router };