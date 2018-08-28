let methods = {
    
    formatSex: function (row, column,cellValue) {
        return cellValue? "男" : "女"
    },
    formatDepartment:function(row, column,cellValue) {
        if(data.DepartmentList) {
          for (let item of data.DepartmentList) {
            if (cellValue == item._id) return item.name;
          }
        }

    }
};

let loadDatas = [{
    name: 'DepartmentList',
    ajax: {
        path: '/company/Department',
        projects:{_id:1,name:1}
    }
}]

let data = {}


module.exports = {
    entityName: 'employee',   
    loadDatas,
    data:data,
    columnsDef: [{
            prop: 'name',
            label: '姓名',
            width: 240,
            filter: true,
            input: { type: 'text', rule: 'required' },
            index:true
        },
        {
            prop: 'sex',
            label: '性别',
            width: 150,
            input:{type:'radioGroup',options:[{label:'男',value:true},{label:'女',value:false}]},
            formatter:methods.formatSex
        },   
        {
            prop: 'department',
            label: '部门',
            width: 150,
            input:{type:'select',ajax:{path:'/company/Department',label:'name',value:'_id',projects:{_id:1,name:1}}},
            formatter:methods.formatDepartment,
            autoRef:true
        },       
        {
            prop: 'memo',
            label: '备注',
            width: 150,
            input: 'text'
        }
    ]
}