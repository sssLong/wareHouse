/*
 * @Autor: 廖佳星
 * @LastEditors: 廖佳星
 * @LastEditTime: 2019-08-22 16:10:09
 */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* 初始路由 */
export default new Router({
    mode: 'history',
    routes: [{
        path: '/Login',
        name: 'Login',
        component:  () => import ("@/components/Login"),
        meta: { title: '登录' }
    }
]
})

/* 准备动态添加的路由 */
export const DynamicRoutes = [
    {
        path: '/',
        name: 'index',
        component: () => import ("@/components/index"),
        redirect: { name: 'home' },
        children: [
            {
                path: '/',
                name: 'home',
                component:  () => import ("@/components/pages/UserManage/home"),
                meta: { title: '首页' }
            }
        ]
    }
]

