import Usermanage from '@/api/Usermanage'
import router, { DynamicRoutes } from '@/router/index'
import { lazy } from './lazyLoading'
export default {
    namespaced: true,
    state: {
        permissionList: null /** 所有路由 */ ,

    },
    getters: {},
    mutations: {
        SET_PERMISSION(state, routes) {
            state.permissionList = routes
        },
    },
    actions: {
        async FETCH_PERMISSION({ commit, state }) {
            let params = localStorage.getItem('accountId');
            let permissionList = await Usermanage.getRoleMenuTree(params)
            let routerList = [];
            //new
            // permissionList.data.forEach(item=>{
            //     returnRouterList(item,routerList) && routerList.push(returnRouterList(item,routerList))
            // })
            // function returnRouterList(data,parentData) {
            //     let routerDict = {}
            //     routerDict.id = data.id
            //     routerDict.path = data.url
            //     routerDict.name = data.name
            //     routerDict.component = lazy(data.url)
            //     routerDict.meta = { title: data.name, name: data.url, id: data.id, parentId: data.parentId, level: data.level }
            //     routerDict.children=[]
            //     parentData.push(routerDict)
            //     if(data.children != null){
            //         data.children.forEach(childrenItem=>{
            //             returnRouterList(childrenItem,routerDict.children) 
            //         })
            //     }else{
            //         return routerDict
            //     }
            // }
            // routerList = routerList.filter(item =>{ return item != undefined})
            // old
            returnRouterList(permissionList.data)
            function returnRouterList(data) {
                data.forEach(item => {
                    let routerDict = {};
                    routerDict.id = item.id
                    routerDict.path = item.url
                    routerDict.name = item.name
                    routerDict.component = lazy(item.url)
                    routerDict.meta = { title: item.name, name: item.url, id: item.id, parentId: item.parentId, level: item.level }
                    if (item.type == 0 || item.type == 2) {
                        routerList.push(routerDict)
                    }
                    if (item.children) {
                        returnRouterList(item.children)
                    }
                });
            }   
            permissionList = routerList
            
            permissionList.push(
                {
                    path: '/404',
                    name: '404',
                    component:  () => import ("@/components/pages/UserManage/404"),
                    meta: { title: '404' }
                },
                { path: '*', redirect: '/404', hidden: true }
            )
            DynamicRoutes[0].children = [...DynamicRoutes[0].children, ...permissionList]

            /*  初始路由 */
            let initialRoutes = router.options.routes

            /*  动态添加路由 */
            router.addRoutes(DynamicRoutes)
                /* 完整的路由表 */
            commit('SET_PERMISSION', [...initialRoutes, ...DynamicRoutes])
        }
    }
}
