/**
  元数据完整例子
*/

var utility = require('utility');
//实体名定义，也是mongodb的数据保存集合名
let entityName = "templet";
/**
 前端函数定义
*/

let methods = {
	formatBool: function(row, column) {
		if (row[column.property]) {
			return "是";
		}
		return "否";
	},
	formatMacScope: function(row, column) {
		if (row.macScope && row.macScope.length > 1) {
			return row.macScope[0] + "->" + row.macScope[1];
		}
		return row.macScope;

	},
	submitCheck: function(para) {
		para.macScope = [];
		if (para.macScope_from) {
			para.macScope.push(para.macScope_from);
		}
		if (para.macScope_to) {
			para.macScope.push(para.macScope_to);
		}
		return para;
	}
};
//列定义
/**
  inputType支持类型：1）text 2）twoText 3）radio 4）checbox
  inputOptions:{
		multiple: true,
		ajax: {
			entityName: "role",
			params: {},
			label:'',//option的label名
			value:'' //option的value名
		}
	}

*/
let columnsDef=[
                 {prop:'name',label:'文本框',width:130,inputType:'text',required: true,filter:true},                 
                 {prop:'twoInput',label:'两文本框',width:290,formatter:methods.formatMacScope,inputType:'twoText',props:['macScope_from','macScope_to']},
                 {prop:'radioInput',label:'单选框',width:120,inputType:'radio',inputOptions:[{label:'A'},{label:'B'}]},               
                 {prop:'checkbox',label:'checkbox',width:100,formatter:methods.formatBool,inputType:'checkbox'},
				];

/**
 前端界面控制参数
*/
let pageSize = 20; //分页条数,默认20
let showAdd = true; //是否显示新增按钮,默认true
let showEdit = true; //是否双击可编辑数据,默认true
let showRemove = true; //是否显示删除按钮,默认true
let showPagination = true; //是否显示页码和分页信息,默认true
let showIndexCol = true; //是否显示索引列,默认true
let showSelectCol = true; //是否显示选择列,默认true
let showFilter=true;
/**
后端调用钩子
*/
let api = {
	beforeAdd: function(doc) {
		doc.enable = true;
		doc.addTime = utility.YYYYMMDDHHmmss();
		return doc;
	},
	beforeUpdate: function(doc) {
		doc.updateTime = utility.YYYYMMDDHHmmss();
		return doc;
	},
	beforeRemove: null,
	beforeBatchRemove: null,
	beforeListPage: function(doc) {
		if (doc) {
			doc.enable = true;
		} else {
			doc = {
				enable: true
			};
		}
		return doc;
	}
};

exports.entityName=entityName;
exports.columnsDef=columnsDef;
exports.pageSize=pageSize;
exports.api=api;
exports.showAdd=showAdd;
exports.showEdit=showEdit;
exports.showRemove=showRemove;
exports.showFilter=showFilter;
exports.showPagination=showPagination;
exports.showIndexCol=showIndexCol;
exports.showSelectCol=showSelectCol;
exports.methods=methods;
