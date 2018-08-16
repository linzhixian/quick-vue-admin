var utility = require('../../utils/CommonUtils');
var dateFormat = require('dateformat');
var pathUtil = require('path');

//实体名定义，也是mongodb的数据保存集合名
let entityName = "user";

let data = {};
let typeNames = {
    'root': '超级管理员',
    'admin': '管理员',
    'pitcher': '投手'
};
let methods = {
    formatType: function(row, column) {
        let value = row[column.property];
        if (value) {
            if (typeNames[value]) return typeNames[value];
        }
        return value;
    },
    formatBool: function(row, column) {
        if (row[column.property]) {
            return "启用";
        }
        return "禁用";
    },
    formatRoles: function(row, column) {
        let res = "";
        if (row[column.property]) {
            let roleids = row[column.property];
            if (roleids.length > 0) {
                for (let id of roleids) {
                    res = res + getRoleName(id) + ",";
                }
            }
            if (res.endsWith(",")) {
                res = res.substring(0, res.length - 1);
            }

        }
        return res;
    }
};

function getRoleName(roleId) {
    if (!roleId) return roleId;
    if (data.roles) {
        for (let role of data.roles) {
            if (roleId == role._id) return role.name;
        }
    }
    return roleId;
}

function getSelectOptions(names) {
    let options = [];
    for (let key of Object.keys(names)) {
        options.push({
            label: names[key],
            value: key
        });
    }
    return options;
}
//列定义
/**
  inputType支持类型：1）text 2）twoText 3）radio 4）checbox
*/
let columnsDef = [{
        prop: 'username',
        label: '用户名',
        width: 250,
        input: { type: 'text', rule: 'required' },
        filter: true
    }, {
        prop: 'password',
        label: '密码',
        width: 200,
        input: 'text'
    }, {
        prop: 'type',
        label: '类型',
        width: 200,
        input: { type: 'select', options: getSelectOptions(typeNames), rule: 'required' },
        formatter: methods.formatType
    }, {
        prop: 'roles',
        label: '所属角色',
        width: 250,
        input: {
            type: 'selectMulti',
            options: {
                multiple: true,
                ajax: {
                    entityName: "/sys/Role",
                    params: {},
                    label: 'name',
                    value: '_id'
                }
            }
        },
        formatter: methods.formatRoles
    }, {
        prop: 'enable',
        label: '状态',
        width: 150,
        input: {
            type: 'radio',
            options: [{
                label: '启用',
                value: true
            }, {
                label: '禁用',
                value: false
            }]
        },
        formatter: methods.formatBool
    }, {
        prop: 'memo',
        label: '备注',
        width: 200,
        input: 'text'
    }

];



let serverHook = {
    pathSaveToProp: 'filePath', //文件信息保存字段： { path, md5, size,fileName }
    fileSavePath: 'data/apk', //文件保存在本地哪个位置 （相对项目目录）
    fileName: function(oldName) { //文件名取名
        return dateFormat(new Date(), "yyyymmddHHMMssl") + pathUtil.extname(oldName);
    },
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
exports.serverHook = serverHook;
exports.methods = methods;
exports.loadDatas = [{
    name: 'roles',
    ajax: {
        entityName: '/sys/Role',
        params: {}
    }
}];
exports.data = data;