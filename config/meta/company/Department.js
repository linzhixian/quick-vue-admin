module.exports = {
    entityName: 'department',
    showAdd:false,
    columnsDef: [{
            prop: 'name',
            label: '部门名称',
            width: 240,
            filter: true,
            input: { type: 'text', rule: 'required' }
        },
        {
            prop: 'memo',
            label: '备注',
            width: 150,
            input: 'text'
        }
    ]
}