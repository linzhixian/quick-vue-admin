exports.toSelectOptions = function(datas, label, value) {
    //console.log("toSelectOptionsbef:" + JSON.stringify(datas));
    if (!label && !value) return datas;
    if (!label) label = 'label';
    if (!value) value = 'value';
    let res = [];
    if (datas && datas.length > 0) {
        for (let one of datas) {
            if(typeof label=='string') {
               if (one[label] && one[value]) {                
                res.push({ label: one[label], value: one[value] });
              } 
            } else if(typeof label=='function') {
                 res.push({ label: label(one), value: one[value] });
            } 
            
        }
    }
    //console.log("toSelectOptionsRes:"+JSON.stringify(res));
    return res;
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

exports.checkPermission=function(id,action) {
      let user = JSON.parse(sessionStorage.getItem("user"));
      console.log("checkPermission",user,id,action)
      if(user.type=='root') return true
      if(user.right) {
        return user.right[id] && user.right[id][action]
      }
      return false
}