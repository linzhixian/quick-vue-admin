import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'

import Vue from "vue";
import { nav_menu } from "./../config/nav_menu";

import metaMap from "./../config/meta";


console.log(metaMap);


function hasRight(user, menuItem) {
    if (!user) return false;
    if (user && user.type && user.type == 'root') return true;
    if (!user.right || user.right == '' || user.right.length == 0) return false;
    let ids = [];
    ids.push(menuItem.id);
    if (menuItem.children) {
        for (let child of menuItem.children) {
            ids.push(child.id);
        }
    }

    if (user.right) {
        for (let one of ids) {
            if (user.right[one]) return true;
        }
    }

    return false;
}

function createComponent(name) {
    if (name == '/') return Home;
    let metaData = metaMap[name];

    //console.log(metaMap);
    if (metaData == null) {
        console.log("no found:" + name);
        return NotFound;
    }
    metaData.path = name;
    if (name.includes("/")) {
        name = name.replace(/\//g, '');
    }
    let pageAdmin = metaData.pageAdminComponent ? metaData.pageAdminComponent : "page-admin";
    console.log("create compoent:"+name+":" + pageAdmin);
    return Vue.component(name, {
        template: '<' + pageAdmin + '  :init="metaData" ></' + pageAdmin + '>',
        data() {
            return {
                metaData
            }
        }
    });


}

function generateRoutes() {
    let otherRoutes = [];
    let session_user = JSON.parse(sessionStorage.getItem("user"));
    for (let menu of nav_menu) {
        let menuOne = {};
        if (hasRight(session_user, menu)) {
            menuOne = Object.assign({}, menu);
            menuOne.children = [];
            for (let childMenu of menu.children) {
                if (hasRight(session_user, childMenu)) {
                    menuOne.children.push(childMenu);
                }
            }
            otherRoutes.push(menuOne);
        }
    }
    otherRoutes.push({
        path: '*',
        hidden: true,
        redirect: {
            path: '/404'
        }
    });
    for (let item of otherRoutes) {
        if(!item.component) {
         item.component = createComponent(item.path);
        }
        if (item.children) {
            for (let one of item.children) {
                if(!one.component) {
                 one.component = createComponent(one.path);
               } else {
                  console.log("EXIT",one.path,one.component)
               }
            }
        }
    }
    if (session_user && session_user.type && session_user.type == 'root') {
        otherRoutes.push({
            path: '/',
            component: Home,
            name: '系统',
            iconCls: 'el-icon-star-on',
            children: [{
                path: '/sys/User',
                component: createComponent('/sys/User'),
                name: '用户'
            }, {
                path: '/sys/Role',
                component: createComponent('/sys/Role'),
                name: '角色'
            }]
        });
    }
    console.log("otherRoutes",otherRoutes)
    return otherRoutes
}

let routes = [{
    path: '/login',
    component: Login,
    name: '',
    hidden: true
}, {
    path: '/404',
    component: NotFound,
    name: '',
    hidden: true
}];



//export default routes;
export { routes, generateRoutes }; ;