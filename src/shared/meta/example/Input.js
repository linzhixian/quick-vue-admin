
const dateFormat = require('dateformat');
const pathUtil = require('path');
const provinceAndCityData=require("../../../../config/client/provinceAndCityTree")

let methods = {
    
    fileName: function(oldName) {
        return dateFormat(new Date(), "yyyymmddHHMMssl") + pathUtil.extname(oldName);
    } ,
    formatEnable: function (row, column,cellValue) {
        return cellValue? "启用" : "禁用"
    }
};

module.exports = {
    entityName: 'Example',    
    columnsDef: [{
            prop: 'text',
            label: '文本框',
            width: 240,
            filter: true,
            input: { type: 'text', rule: 'required' }
        },
        {
            prop: 'textarea',
            label: '多行文本框',
            width: 240,
            filter: true,
            input: { type: 'textarea', rule: 'required' }
        },        
        {
            prop: 'select',
            label: '选择框',
            width: 150,
            input:{type:'select',filterable:true,allowCreate:true,clearable:true,options:[{label:'黄色',value:'黄色'},{label:'白色',value:'色色'}]}
        },
        {
            prop: 'select_ajax',
            label: '动态选择框',
            width: 150,
            input:{type:'select',ajax:{path:'/company/Department',label:'name',value:'_id',projects:{_id:1,name:1}}}
        },
        {
            prop: 'radioGroup',
            label: '单选框',
            width: 150,
            input:{type:'radioGroup',options:[{label:'启用',value:true},{label:'禁用',value:false}]},
            formatter:methods.formatEnable
        },        
        {
            prop: 'checkbox',
            label: '多选框',
            width: 150,
            input:{type:'checkbox'}
        } ,
        {
            prop: 'checkboxGroup',
            label: '多选框组',
            width: 150,
            input:{type:'checkboxGroup',options:[{label:'北京',value:'bj'},{label:'深圳',value:'sz'},{label:'广州',value:'gz'}]}
        },
        {
            prop: 'date',
            label: '日期',
            width: 150,
            input:{type:'date',subType:'date',format:'yyyy 年 MM 月 dd 日',valueFormat:'yyyyMMdd'}
        } 
        ,
        {
            prop: 'time',
            label: '时间',
            width: 150,
            input:{type:'time'}
        },
        {
            prop: 'datetime',
            label: '日期时间',
            width: 150,
            input:{type:'date',subType:'datetime'}
        },        
        {
            prop: 'daterange',
            label: '日期范围',
            width: 150,
            input:{type:'date',subType:'daterange',rangeSeparator:'至',startPlaceholder:'开始日期',endPlaceholder:'结束日期'}
        } ,
                                {
            prop: 'datetimerange',
            label: '日期时间范围',
            width: 150,
            input:{type:'date',subType:'datetimerange',rangeSeparator:'至',startPlaceholder:'开始日期',endPlaceholder:'结束日期'}
        },
        {
        prop: 'fileInfo',
        label: '文件',
        width: 240,
        filter: false,
        input: { type: 'file', savePath: 'example', fileName: methods.fileName, ext: "txt"},
        download:true
      },
      {
        prop:'tree',
        label:'树',
          width:200,
        edit:true,
        add:true,    
        input: {            
            type: 'tree',
            data:provinceAndCityData,
            props:{label:'label',children:'city'}

        }
    },   
    {
        prop:'addTime',
        label:'创建时间',
         width:150,
        add:false,
        edit:false
    }   
    ]
}