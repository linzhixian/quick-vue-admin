let map = {};

load("company", require("./company"));
load("sys",require("./sys"));
load("example", require("./example"));


function load(path, modules) {
    for (let key of Object.keys(modules)) {
        modules[key].columnsMap = {};
        if (modules[key].columnsDef) {
            for (let one of modules[key].columnsDef) {
                modules[key].columnsMap[one.prop] = one;
            }
        }
        map["/" + path + "/" + key] = modules[key];
        console.log("loaded:" + "/" + path + "/" + key);
    }
}
module.exports = map; 