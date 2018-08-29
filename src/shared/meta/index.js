let metaFiles=require("./metaFiles")
let map = {};

/*--start--*/
for(let one of Object.keys(metaFiles)) {
   load(one,metaFiles[one])
}

/*load("./company/Employee")
load("./example/Input")
load("./example/SetThemeColor")
load("./example/Tree")
load("./sys/Role")
load("./sys/User")*/
/*--end--*/


function load(path,modu) {    
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

      map[path ] = modu;        
      console.log("loaded:" +  path);

}

module.exports = map; 