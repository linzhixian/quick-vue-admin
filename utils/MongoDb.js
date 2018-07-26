var config = require('../config');

var baseDb=require('./BaseDb3')

var mongo={};


mongo.connect=function(cb) {
	 return baseDb.init(config.mongodb,config.serverId,cb);	
}
module.exports = mongo;