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
        return str.replace(/\./g, "_")
    }
    return str
}
exports.convertDotBack = function(str) {
    if (str) {
        return str.replace(/\_/g, ".")
    }
    return str
}