var MongoClient = require('mongodb').MongoClient;

async function e() {

	try {
	  let x=await open('mongodb://192.168.1.20:27017/authSource=quickVueAdmin',{},'quickVueAdmin')
	   let client=await MongoClient.connect('mongodb://192.168.1.20:27017/authSource=quickVueAdmin',{})
	    let db=client.db('quickVueAdmin')
		console.log("success"+db)
    } catch(err) {
    	  error(err)
    }


}

function open(uri,options,dbname) {
	 console.log("---connect db",uri,options,dbname)
	return new Promise(function(resolve,reject){
		 console.log("---connect db open")
		 options.reconnectTries=Number.MAX_VALUE
		 MongoClient.connect(uri, options,function(err,client){
		 	 console.log("---connect 2",err)
		 	 if(err){
		 	  error(err)
		 	  reject(err)
		 	  return
		 	}
		 	 let db=client.db(dbname)
		 	 resolve(db)
		 })
	})
}
function error(error) {
    var errorMsg = error.stack || error.message || error || 'unknow error';
    console.log(errorMsg);
}

e()