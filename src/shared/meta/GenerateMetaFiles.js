
const fs=require("fs")
const dir = require('node-dir');

async function subdir() {
	return new Promise(function(resolve,reject){
		dir.subdirs(__dirname, function(err, subdirs) {
	     if (err) throw err;
	     	resolve(subdirs)
	    })
	})
}
module.exports=async function() {	
		let subdirs=await subdir()	    
	    let paths=[]
	    for(let oneDir of subdirs) {
			let files=dir.files(oneDir,{sync:true})
			for(let f of files) {
				let p=f.replace(__dirname,"").replace(/\\/g, "/")
				paths.push(p.substring(0,p.length-3))
			}
	    }
	    console.log(paths)	    
	    let content="module.exports={"
	    for(let one of paths) {
	    	content=content+"\n'"+one+"':"+"require('."+one+"'),"
	    }
	    content=content+"\n}"
        fs.writeFileSync(__dirname+"/metaFiles.js",content)        
	   return
}