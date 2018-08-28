var dir = require('node-dir');
const path=require("path")

let map = {};

dir.subdirs(__dirname, function(err, subdirs) {
    if (err) throw err;
    for(let oneDir of subdirs) {
        let dirName=path.basename(oneDir)        
        loadDir(dirName,path.join(__dirname,dirName))        
    }
});

function loadDir(moduleName,dirPath) {
    dir.files(dirPath, function(err, files) {
     if (err) throw err;
     for(let oneFile of files) {        
        let key=path.basename(oneFile,".js")        
          console.log("server loaded:" + "/" + moduleName + "/" + key);
           map["/" + moduleName + "/" + key] = require(oneFile)
        
    }
});
}

module.exports = map;