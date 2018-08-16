var router = require('koa-router')();

var request_checkNeedParams = require('../../../middlewares/request_checkNeedParams');


import * as login from '../../../controllers/admin/login';
register(login);
import * as logout from '../../../controllers/admin/logout';
register(logout);


import * as pageAdmin from '../../../controllers/admin/pageAdmin';
register(pageAdmin);


function register(action) {
	console.log("register:"+action.path);
  router.post(action.path, action.doRequest);
  router.get(action.path, action.doRequest);
  request_checkNeedParams.register(action.path,action.needParams);
}


export   {router};


