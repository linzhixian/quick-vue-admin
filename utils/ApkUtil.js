//let apkinfo = require('node-apk-parser-promise')
const config=require("../config")

import axios from 'axios';
import dateFormat from 'dateformat';
const pathUtil=require("path")

async function callApkToolWeb(action,reqInfo) {
	let req={}
	req[action]=reqInfo
	console.log("callApkToolWeb",req)
 	let res=await axios.post(config.apkToolUrl, req)
 	if(res && res.status==200 && res.data.code==1 && res.data[action+'Response']) {
 		return res.data[action+'Response']
 	} else {

 		if(!res) {
           throw new Error("callApkToolWeb error:no return")
 		} else if(res.status!=200) {
          throw new Error("callApkToolWeb error:status="+res.status)
 		} else  {
          throw new Error("callApkToolWeb error:code="+res.data.code+",error="+res.data.error)
 		}
 		
 	}
}
//临时解开apk包以获取apk相关信息
exports.getApkInfoByApkFile = async function(apkPath) {
	return await callApkToolWeb('getApkInfo',{apkPath:apkPath})

}

exports.injectSdkToApk = async function(reqInfo) {	
	return await callApkToolWeb('injectSdkToApk',reqInfo)
}

exports.packChannelApk=async function(reqInfo) {
	return await callApkToolWeb('packChannels',reqInfo)
}
exports.exportConfigFiles =async function(reqInfo) {
	return await callApkToolWeb('exportConfigFiles',reqInfo)
}
exports.fileName=function(oldName) {
        return dateFormat(new Date(), "yyyymmddHHMMssl") + pathUtil.extname(oldName);
    }


//exports.getApkInfoByApkFile("./wh.apk").then((result) => { console.log("result", result) })20180523185541517.apk