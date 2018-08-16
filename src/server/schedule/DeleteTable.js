const utility = require('utility');

const moment = require('moment');
const dateMath=require("date-arithmetic")
const config=require("../config")
const mongoDbStat = require('../utils/MongoDbStat');


/**
删除数据库：tcAdStat，表名为：名称_日期，固定天数之前的表(只保留最近天数的表)
*/
exports.exeuteTask = async function() {  
  var today = moment()
  mongoDbStat.db.listCollections(function(names){  	 
  	 for(let name of names) {
  	 	let name_date=name.name.split("_")  	 	
  	 	if(name_date.length>1) {  	 		
  	 		let date=moment(name_date[1],'YYYYMMDD')  	 		  	 	
  	 		if(today.diff(date,'days')>config.dbKeepDays) {  	 			  	 		
  	 			mongoDbStat.db.dropCollection(name.name,{},function(err,ret){
  	 				console.log("--deleteCollection:"+name.name,ret,err)
  	 			})
  	 			
  	 		}

  	 	}
  	 }

  })
}
