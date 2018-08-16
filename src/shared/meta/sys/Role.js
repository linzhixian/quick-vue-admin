var utility = require('../../utils/CommonUtils');
var nav_menu = require('../../../../config/shared/nav_menu');
//实体名定义，也是mongodb的数据保存集合名
let entityName = "role";
let methods = {
    submitCheck: function(para, tableAdmin) {
        console.log("------submitCheck");
        console.log(tableAdmin.$refs);
        let checkRights = tableAdmin.$refs.tree[0].getCheckedKeys();
        para.right = {};
        for (let oneid of checkRights) {
            let oneRight = {};
            console.log(document.getElementById('p' + oneid + 'add'));
            if (document.getElementById('p' + oneid + 'add').checked) {
                oneRight.add = 1;
            }
            if (document.getElementById('p' + oneid + 'edit').checked) {
                oneRight.edit = 1;
            }
            if (document.getElementById('p' + oneid + 'remove').checked) {
                oneRight.remove = 1;
            }
            para.right[oneid] = oneRight
        }
        return para;
    },
    formatRight: function(row, column) {
        return "...";
    },
    onShowEdit: function(addForm, tableAdmin) {
        let right = addForm.right;
        if (right) {
            let ids = Object.keys(right);
            if (tableAdmin.$refs.tree instanceof Array) {
                tableAdmin.$refs.tree[0].setCheckedKeys(ids);
            }
            for (let id of ids) {
                let actions = right[id];
                if (actions.add) {
                    document.getElementById('p' + id + 'add').disabled = false;
                    document.getElementById('p' + id + 'add').checked = true;
                }
                if (actions.edit) {
                    document.getElementById('p' + id + 'edit').disabled = false;
                    document.getElementById('p' + id + 'edit').checked = true;
                }
                if (actions.remove) {
                    document.getElementById('p' + id + 'remove').disabled = false;
                    document.getElementById('p' + id + 'remove').checked = true;
                }
            }
        }
    },
    onShowAdd: function(addForm, tableAdmin) {
        if (tableAdmin.$refs.tree instanceof Array) {
            tableAdmin.$refs.tree[0].setCheckedKeys([]);
        }
    },
    renderContent: function(h, { node, data, store }) {
        if (data.path == '/') {
            return h('span', node.label);
        } else {
            let fc = [];
            fc.push(h("input", { attrs: { type: 'checkbox', value: 'add', id: 'p' + data.id + 'add' } }));
            fc.push("新增");
            fc.push(h("input", { attrs: { type: 'checkbox', value: 'edit', id: 'p' + data.id + 'edit' } }));
            fc.push("修改");
            fc.push(h("input", { attrs: { type: 'checkbox', value: 'remove', id: 'p' + data.id + 'remove' } }));
            fc.push("删除");
            return h('span', [h('span', node.label), h('span', { attrs: { id: 'p' + data.id }, style: { display: 'none', float: 'right', marginRight: '20px' } }, fc)]);
        }
    },
    checkChange: function(data, isCheck) {
        if (data.path != '/') {
            let id = data.id;
            document.getElementById('p' + id).style.display = isCheck ? "" : "none";
            if (document.getElementById('p' + id + 'add'))
                document.getElementById('p' + id + 'add').checked = isCheck;
            if (document.getElementById('p' + id + 'edit'))
                document.getElementById('p' + id + 'edit').checked = isCheck;
            if (document.getElementById('p' + id + 'remove'))
                document.getElementById('p' + id + 'remove').checked = isCheck;
        }
    }
};


function loadTreeData() {
    let ops = {};
    ops.props = { label: 'name', children: 'children' };
    ops.data = nav_menu.nav_menu;
    ops.handleCheckChange = function() {};
    ops.renderContent = methods.renderContent;
    ops.checkChange = methods.checkChange;
    return ops;
}
//列定义
/**
  inputType支持类型：1）text 2）twoText 3）radio 4）checbox
*/
let columnsDef = [{
        prop: 'name',
        label: '角色名',
        width: 250,
        input: { type: 'text', rule: 'required' },        
        filter: true
    },
    {
        prop: 'memo',
        label: '描述',
        width: 200,
        input: 'text'
    },
    {
        prop: 'right',
        label: '权限',
        width: 200,
        input: { type: 'tree', options: loadTreeData() },
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