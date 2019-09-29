// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store/index';
import ElementUI from 'element-ui';
import '@/assets/css/MarginPaddingMixin.scss';
import './assets/css/index.scss';
import './assets/icon/iconfont.css';
import animated from 'animate.css'
import {MyPlugin} from './plugin' // api
import mixin from './mixin' //混入
import BtnPermission from './utils/buttonPermission'
import promise from 'es6-promise'

// 解决重复点击路由报错问题
import Router from 'vue-router'
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

promise.polyfill();
// 测试
Vue.use(animated)
Vue.use(ElementUI);
Vue.use(MyPlugin);
Vue.mixin(mixin);

Vue.prototype.btnPermission = function (name){
    return BtnPermission.rouleButtonPermissionFn.bind(this)(name);
}

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    window.tableHasLoading = false
    if (!localStorage.getItem('token')) {
        if (
            to.matched.length > 0 &&
            !to.matched.some(record => record.meta.requiresAuth)
        ) {
            next()
        } else {
            next({ path: '/Login' })
        }
    } else {
        if (!store.state.permission.permissionList) {
            store.dispatch('permission/FETCH_PERMISSION').then(() => {
                next({ path: to.fullPath })
            })
        } else {
            next()
        }
    }
})
Vue.config.productionTip = false;
export default new Vue({
    el: '#app',
    router,
    store,
    components: {
        App
    },
    template: '<App/>'
})
