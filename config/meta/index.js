
import sys from "./sys";
import company from "./company";



let map = {};
load("company", company);
load("sys", sys);
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