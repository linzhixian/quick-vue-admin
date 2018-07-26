var dateFormat = require('dateformat');
var utility = require('utility');

//2013-04-17 14:43:02
exports.YYYYMMDDHHmmss = function() {
    var now = new Date();
    return dateFormat(now, "yyyy-mm-dd HH:MM:ss");
};
exports.YYYYMMDDHHmmssl = function() {
    var now = new Date();
    return dateFormat(now, "yyyymmddHHMMssl");
};
exports.YYYYMMDDHHmm = function() {
    var now = new Date();
    return dateFormat(now, "yyyymmddHHMM");
};
exports.print = function(msg) {
    console.log(utility.logDate() + ":" + msg)
}
exports.errorMsg = function(error) {
    let msg = ""
    if (typeof error == 'object') {
        if (error.name) msg = msg + "    Error.name:" + error.name + "\n"
        if (error.message) msg = msg + "    Error.message:" + error.message + "\n"
        if (error.stack) msg = msg + "    Error.stack:" + error.stack + "\n"
    } else {
        msg = error
    }
    return msg
}

exports.printError = function(error, title) {
    if (!error) return
    let msg = "Error:\n"
    if (title) {
        msg = msg + ",title=" + title
    }
    msg = msg + "," + exports.errorMsg(error)
    console.error(utility.logDate() + ":" + msg)
}
exports.findObjInArray = function(list, key, value) {
    for (let one of list) {
        if (one[key] == value) {
            return one
        }
    }
    return null
}
exports.convertDot = function(str) {
    if (str) {
        return str.replace(/\./g, "@")
    }
    return str
}
exports.convertDotBack = function(str) {
    if (str) {
        return str.replace(/\@/g, ".")
    }
    return str
}

exports.clone=function(obj) {    
    if(typeof obj==='object') {
     if(Array.isArray(obj)) {
        return exports.cloneArray(obj)
     } else {
       return exports.cloneObject(obj)
     }
    } else {
        return obj
    }
}
exports.cloneArray=function(obj) {
    let c=[]
    for(let one of obj) {
        c.push(exports.clone(one))
    }
    return c
}
exports.cloneObject=function(obj) {
    let c={}
    for(let one of Object.keys(obj)) {
        c[one]=exports.clone(obj[one])
    }
    return c
}

