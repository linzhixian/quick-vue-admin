import babelpolyfill from "babel-polyfill";
import Vue from "vue";

import App from "./App.vue";
import ElementUI from "element-ui";


import "element-ui/lib/theme-chalk/index.css";
//import "./assets/theme/theme-green/index.css"
import VueRouter from "vue-router";
import store from "./vuex/store";
import Vuex from "vuex";

import VueI18n from 'vue-i18n'
//import NProgress from "nprogress"
//import "nprogress/nprogress.css"
import { routes } from "./routes";

//Mock.bootstrap();
import "font-awesome/css/font-awesome.min.css";
import TableAdmin from './components/TableAdmin.vue';
import TreeAdmin from './components/TreeAdmin.vue';
import messages from './../shared/i18n';

import LoadCustomPage from './components/custom/'

import { generateRoutes } from "./routes";


//i18n_res.load(Vue,ElementUI)

function detectLocale() {
 var JsSrc =(navigator.language || navigator.browserLanguage).toLowerCase();
 if(JsSrc.indexOf('zh')>=0) return 'zh'
 return 'en'
}
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: detectLocale(), // set locale
  messages, // set locale messages
})


Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.component('table-admin', TableAdmin);
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



new Vue({
    i18n,
    router, 
    render: h => h(App)
}).$mount("#app")