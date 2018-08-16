let utility = require('utility');
let ApiError = require('./error/ApiError');
let ApiErrorNames = require('./error/ApiErrorNames');

let config = require('../../config/server');
let services = require('./services');

let baseDao = require('./db/baseDao');

let CommonUtils = require('../shared/utils/CommonUtils');

var { nav_menu } = require('../../config/shared/nav_menu');

var metaIndex = require('../shared/meta');
var metaIndexServer = require('../shared/meta/indexServer');



module.exports = { utility, ApiError, ApiErrorNames, config, services, baseDao, CommonUtils,nav_menu,metaIndex ,metaIndexServer};