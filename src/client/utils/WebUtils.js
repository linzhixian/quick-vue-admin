exports.findObjInArray = function(list, key, value) {
    for (let one of list) {
        if (one[key] == value) {
            return one
        }
    }
    return null
}
exports.findMultiInArray = function(list, key, value) {
    let objs=[]
    for (let one of list) {
        if (one[key] == value) {
            objs.push(one)
           
        }
    }
    return objs
}
exports.convertDot = function(str) {
    if (str) {
        return str.replace(/\./g, "_")
    }
    return str
}
exports.convertDotBack = function(str) {
    if (str) {
        return str.replace(/\@/g, ".")
    }
    return str
}