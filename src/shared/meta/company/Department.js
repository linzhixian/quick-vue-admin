module.exports = {
    entityName: 'department',    
    columnsDef: [{
            prop: 'name',
            label: '部门名称',
            width: 240,
            filter: true,
            input: { type: 'text', rule: 'required' },
            index:true
        },
                {
            prop: 'config',
            label: '人数设置',
            width: 150,
            add:false,
            edit:false            
        },
        {
            prop: 'memo',
            label: '备注',
            width: 150,
            input: 'text'
        }
    ],
    extendActionButtons:"department_buttons"
}