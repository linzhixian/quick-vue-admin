const f = require('util').format;
var MongoClient = require('mongodb').MongoClient;

exports.connect=async function(dbConfig) {	        
		let {user,pass,host,port,dbname,poolSize}=dbConfig     
		let uri=null       
        if(user && pass) {
            uri = f('mongodb://%s:%s@%s:%s/?authMechanism=%s&authSource=%s',user, pass,host, port, 'SCRAM-SHA-1',dbname);        
        } else {
            uri = f('mongodb://%s:%s/authSource=%s',host, port, dbname); 
        }          
       try {
         let client=await  MongoClient.connect(uri, {poolSize,reconnectTries:Number.MAX_VALUE})     
         let db=client.db(dbname)
         let test=await testDb(db)
         console.log("--connect mongodb success:"+uri)
		 return db
	   } catch(err) {
	   	 error(err)
	   }
}
let testDb=async function(db) {
	let result=await db.collection("user").findOne({})
	console.log("findOne",result)
}
function error(error) {
    var errorMsg = error.stack || error.message || error || 'unknow error';
    console.log(errorMsg);
}