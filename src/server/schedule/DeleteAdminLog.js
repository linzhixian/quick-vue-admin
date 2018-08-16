const moment = require('moment');
const config=require("../config")

const fs = require('fs')
const path = require('path')
/**
删除日志：/logs/admin/response_2018-08-07.log (只保留最近天数的日志文件)
*/
exports.exeuteTask = async function() {  
  var today = moment()
     let dir=path.join(process.cwd(),"/logs/admin")

     deleteLogFile(dir)

     let dir2=path.join(process.cwd(),"/logs/api")

     deleteLogFile(dir2)
}


function deleteLogFile(dir) {
	 let dirList = fs.readdirSync(dir);     
     for(let fileName of dirList) {
            console.log("--",fileName)              
           let names=path.basename(fileName,'.log').split("_")
           console.log(names,names.length)
           if(names.length>1) {                   	 
           	  let date=moment(names[1],'YYYY-MM-DD')           	  
           	  if(today.diff(date,'days')>config.logKeepDays) { 
                 var curPath = path.join(dir,fileName);                 
                  fs.unlinkSync(curPath);
                  console.log("--delete log file",curPath)
           	  } 	 	
           }
     }
}


