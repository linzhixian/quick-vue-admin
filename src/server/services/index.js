
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
exports.ensureMongoDbIndex=async function(db) {   
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
              db(v.entityName).createIndex(fields,index.options,function(err,reply){
                if(err) {
                  console.log(err)
                  throw err
                } else {
                  console.log(reply)
                }             
              })

          }
      }
   }
}

exports.initAdminAccount=async function(db) {       
        let find=await db("user").findOne({ username:'admin' })        
        if(!find) {           
           db("user").insert({username:'admin',password:'admin',type:'root',enable:true},{},function(x){console.log("insert admin",x)})
        }
}
