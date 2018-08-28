module.exports = {
    title: 'HR系统',
    pwdmd5:'323d23923#23fsfgb',
    nav_menu: [{
            id:100,
            path: '/',
            name: '功能',
            iconCls: 'el-icon-menu', //图标样式class       
            children: [
                {id:101, path: '/company/Department', name: '部门' },
                {id:102, path: '/company/Employee', name: '员工' },

            ]
        },              
        {
            id:200,
            path: '/',
            name: '样例',
            iconCls: 'el-icon-menu',    
            children: [
                { id:201,path: '/example/Input', name: '输入大全' },
                { id:202,path: '/example/Tree', name: '树之CRUD' }, // 
                { id:203,path: '/example/SetThemeColor', name: '设置主题颜色' } // 
            ]
        }
    ]
};