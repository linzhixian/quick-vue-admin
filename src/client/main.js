import babelpolyfill from "babel-polyfill";
import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
//import "./assets/theme/theme-green/index.css"
import VueRouter from "vue-router";
import store from "./vuex/store";
import Vuex from "vuex";
//import NProgress from "nprogress"
//import "nprogress/nprogress.css"
import { routes } from "./routes";

//Mock.bootstrap();
import "font-awesome/css/font-awesome.min.css";
import PageAdmin from './components/PageAdmin.vue';
import TreeAdmin from './components/TreeAdmin.vue';

import CustomPage from './components/custom/CustomPage.vue'
import LoadCustomPage from './components/custom/'

import { generateRoutes } from "./routes";

Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(Vuex);
Vue.component('page-admin', PageAdmin);
Vue.component('tree-admin', TreeAdmin);

LoadCustomPage.load(Vue)

//NProgress.configure({ showSpinner: false });
console.log(routes);
const router = new VueRouter({
    routes
})
//解决登录后刷新空白问题：因为刷新后所以东西都重新加载，login动态加载的routes也丢失了，这里再次加载
router.addRoutes(generateRoutes());
router.beforeEach((to, from, next) => {
    //NProgress.start();
    console.log("beforeEach:" + JSON.stringify(sessionStorage));
    if (to.path == "/login") {
        sessionStorage.removeItem("user");
    }
    let user = JSON.parse(sessionStorage.getItem("user"));
    if (!user && to.path != "/login") {
        next({ path: "/login" })
    } else {
        console.log("routerTo:"+to.path)
        next()
        console.log("routerOk:",to)
    }
})
router.onError(function(err){
    console.err(err)
})
//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
    //el: "#app",
    //template: "<App/>",
    router,
    store,
    //components: { App }
    render: h => h(App)
}).$mount("#app")