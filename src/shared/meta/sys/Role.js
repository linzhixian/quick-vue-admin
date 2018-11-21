var utility = require('../../utils/CommonUtils');
var nav_menu = require('../../../../config/shared/nav_menu');
//实体名定义，也是mongodb的数据保存集合名
let entityName = "role";
let methods = {
    submitCheck: function(para, vum) {
        console.log("------submitCheck");
        //console.log("refs",tableAdmin.$refs);
        let checkRights = vum.$refs.right[0].getCheckedKeys();
        para.right = {};
        for (let oneid of checkRights) {
            let oneRight = {};    
            console.log('p' + oneid + 'add')
            console.log(document.getElementById('p' + oneid + 'add'));
            let add=document.getElementById('p' + oneid + 'add')
            if (add && add.checked) {
                oneRight.add = 1;
            }
            let edit=document.getElementById('p' + oneid + 'edit')
            if (edit && edit.checked) {
                oneRight.edit = 1;
            }
              let remove=document.getElementById('p' + oneid + 'remove')
            if (remove && remove.checked) {
                oneRight.remove = 1;
            }
            para.right[oneid] = oneRight
        }
        return para;
    },
    formatRight: function(row, column) {
        return "...";
    },
    onShowEdit: function(addForm, vum) {
        let right = addForm.right;
        if (!right) return
        if (!vum.$refs.right) return
        let ids = Object.keys(right);            
        vum.$refs.right[0].setCheckedKeys(ids);
        setTimeout(()=>{
                 for (let id of ids) {  
                   let actions = right[id];                 
                   if (document.getElementById('p' + id + 'add')) {                   
                    document.getElementById('p' + id + 'add').checked =(actions.add==1)
                    document.getElementById('p' + id + 'edit').checked = (actions.edit==1)
                    document.getElementById('p' + id + 'remove').checked = (actions.remove==1)
                  }                 
                }
        },200)        
        
    },
    onShowAdd: function(addForm, tableAdmin) {
        if (tableAdmin.$refs.tree instanceof Array) {
            tableAdmin.$refs.tree[0].setCheckedKeys([]);
        }
    },
    renderContent: function(h, { node, data, store }) {
        if (data.path == '/') {
            return (<span>{node.label}</span>)
        } else {

           return (
          <span style="flex: 1;display: flex;align-items: center;justify-content: space-between;font-size: 14px;padding-right: 8px;">
            <span>{node.label}</span>
            <span id={'p'+data.id} style="display:none">
              <input type="checkbox"  id={'p'+data.id+'add'}/>新增&nbsp;&nbsp;
              <input type="checkbox"  id={'p'+data.id+'edit'}/>修改&nbsp;&nbsp;
              <input type="checkbox"  id={'p'+data.id+'remove'}/>删除
              
            </span>
          </span>)
        }
    },
    checkChange: function(data, isCheck) {
        if (data.path != '/') {
            let id = data.id;
            if( document.getElementById('p' + id)) {
             document.getElementById('p' + id).style.display = isCheck ? "" : "none";
            }
            if (document.getElementById('p' + id + 'add')) {
                document.getElementById('p' + id + 'add').checked = isCheck;
            }
            if (document.getElementById('p' + id + 'edit')){
                document.getElementById('p' + id + 'edit').checked = isCheck;
            }
            if (document.getElementById('p' + id + 'remove')) {
                console.log("--checkChange set move",isCheck)
                document.getElementById('p' + id + 'remove').checked = isCheck;
            }
        }
    }
};


function loadTreeData() {
    let ops = {};
   
    ops.data = nav_menu.nav_menu;
    return ops.data;
}
//列定义
/**
  inputType支持类型：1）text 2）twoText 3）radio 4）checbox
*/
let columnsDef = [{
        prop: 'name',
        label: '{roleName}',
        width: 250,
        input: { type: 'text', rule: 'required' },        
        filter: true,
        index:{options:{unique:true}}
    },
    {
        prop: 'memo',
        label: '{memo}',
        width: 200,
        input: 'text'
    },
    {
        prop: 'right',
        label: '{permission}',
        width: 200,
        input: { type: 'tree',expandAll:true, nodeKey:'id',renderContent:methods.renderContent, props:{ label: 'name', children: 'children' },data: loadTreeData(),checkChange:methods.checkChange },
        formatter: methods.formatRight
    }
];



let api = {
    beforeAdd: function(doc) {
        doc.addTime = utility.YYYYMMDDHHmmss();
        return doc;
    },
    beforeUpdate: function(doc) {
        doc.updateTime = utility.YYYYMMDDHHmmss();
        return doc;
    }

};
exports.entityName = entityName;
exports.columnsDef = columnsDef;
exports.api = api;
exports.methods = methods;
exports.hook={
    submitCheck:methods.submitCheck,
    onShowEdit:methods.onShowEdit,
    onShowAdd:methods.onShowAdd
}