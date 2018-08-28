module.exports = {
    pageAdminComponent:'tree-admin',
    entityName:'category',
    columnsDef: [{
        prop: '_id',
        label: '编码',        
        edit: false,
        width: 200,
        input: { type: 'text', required: true },
        add:true
    },
    {
        prop: 'name',
        label: '名称',
        width: 200,
        input: { type: 'text', required: true }        
    }
   ],

   treeProps:{ label: 'name', children: 'sub' }
}
