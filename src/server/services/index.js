
const dateFormat = require('dateformat');
const path = require('path');
const os = require('os');


const metaIndex=require("../../shared/meta")

let { utility, ApiError, ApiErrorNames, config, CommonUtils,baseDao} = require('../include');



const tmpDir = os.tmpdir();



exports.getGloblConfigValue=async function(db,key) {
    let oneConfig =await baseDao.queryOneByCondition(db,"globalConfig",{key:key})
    if(oneConfig) {
     return oneConfig.value
    } else {
      return null
    }
}
exports.ensureMongoDbIndex=function(db) {   
   for(let v of Object.values(metaIndex)) {      
      if(!v.columnsDef) continue      
      for(let oneDef of v.columnsDef) {
          if(oneDef.index) {              
              let index=oneDef.index 
              let fields={}
              fields[oneDef.prop]=1
              if(index.sortOrder) {
                 fields[oneDef.prop]=index.sortOrder
              }
              console.log("---------encureIndex",v.entityName,fields,index.options)
              db.getCollection(v.entityName).ensureIndex(fields,index.options,function(err){
                if(err) {
                  console.log(CommonUtils.errorMsg(err))
                  throw err
                }
              })
          }
      }
   }
}

exports.initAdminAccount=function(db) {
        db.getCollection("user").findOne({ username:'admin' }, null, function(reply) {
            if (reply.documents.length== 0) {
                 db.getCollection("user").save({username:'admin',password:'admin',type:'root'})
            } 
        });
}
