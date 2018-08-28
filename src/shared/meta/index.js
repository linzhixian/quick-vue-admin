let map = {};

load("company", require("./company"));
load("sys",require("./sys"));
load("example", require("./example"));


function load(path, modules) {
    for (let key of Object.keys(modules)) {
        let modu=modules[key]
        modu.columnsMap = {};
        modu.subPermissions=[]
        if (modu.columnsDef) {
            for (let one of modu.columnsDef) {
                modu.columnsMap[one.prop] = one;
                if(one.input && one.input.ajax && one.input.ajax.path) {
                   modu.subPermissions.push( one.input.ajax.path) 
                }
            }
        }

       if(modu.loadDatas) {
        modu.loadDatas.forEach(function(item){
            modu.subPermissions.push(item.ajax.path)
        })
       }

        map["/" + path + "/" + key] = modu;        
        console.log("loaded:" + "/" + path + "/" + key);
    }
}
module.exports = map; 