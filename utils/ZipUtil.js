const fs=require("fs")
const os=require("os")
const unzip = require("unzip");
const path = require("path");
const cpFile = require('cp-file');
const archiver = require('archiver');


exports.addFileToZip=async function(filePath,zipFilePath,copyToPath,outPutPath) {
	if(!outPutPath) {
		outPutPath=zipFilePath
	}
	if(fs.existsSync(zipFilePath)) {
	  let folder=fs.mkdtempSync(os.tmpdir());
	  await exports.unzip(zipFilePath,folder)
	  await cpFile(filePath, path.join(folder,copyToPath,path.basename(filePath)));	 

	  return await exports.zipDirectory(folder,outPutPath)	  	 
    } else {    	
    	return null
    }
}
exports.unzip=function(zipFilePath,directory) {
    return new Promise((resolve) => {
    	fs.createReadStream(zipFilePath).pipe(unzip.Extract({ path: directory })).on('close',function(){
	 	  resolve(directory)
	   });
        	
    });
}
exports.zipDirectory=function(directory,outputPath) {
    return new Promise((resolve) => {
    	  var output = fs.createWriteStream(outputPath);
    	  var archive = archiver('zip');
    	  archive.on('error', function(err){
				    throw err;
				});
    	  output.on('close', function() {
    	  	resolve(outputPath)
		});
    	  archive.pipe(output);
    	  archive.directory(directory+'/', false);
    	  archive.finalize();
    });
}