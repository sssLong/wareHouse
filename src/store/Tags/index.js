/*
 * @Author: 李步钻 
 * @Date: 2019-06-05 21:37:09 
 * @Last Modified by: 李步钻
 * @Last Modified time: 2019-08-19 17:25:29
 */

const tags = {
    state: {
        tagsView: [], // 标签视图
        cachedViews: [], // 需要缓存
        tagValue: '',
        arrivalNoticeRoute: {},   //到货通知路由
        returnRoute: {}        //销退收货路由
    },
    mutations: {
        SET_TAGVALUE (state,val){
            state.tagValue = val;
        },
        SET_ARRIVAL_ROUTE: (state,route) => {
            state.arrivalNoticeRoute = Object.assign({},route);
            delete state.arrivalNoticeRoute.matched
        },
        SET_BACK_ROUTE: (state,route) => {
            state.returnRoute = Object.assign({},route);
            delete state.returnRoute.matched
        },
        ADD_TAGS_VIEW: (state, tag) => {
            let isRepeat = state.tagsView.some(v => v.path == tag.path) || tag.path == '/Login'
            if (isRepeat) {
                // 解决重复路由有查询字符串的时候，没有更新问题
                state.tagsView.forEach((v) => {
                    if ((v.path == tag.path)) {
                        v.query = tag.query
                    }
                })
                return
            }
            state.tagsView.push(
                Object.assign({}, tag)
            )
            // 删除循环引用，解决JSON.stringify的报错
            state.tagsView.forEach(v => {
                delete v.matched
            })
        },
        ADD_CASHED_VIEW: (state, tag) => {
            if (state.cachedViews.includes('/'+tag.meta.name)) return
            state.cachedViews.push('/'+tag.meta.name)
        },
        DEL_TAGS_VIEW: (state, tag) => {
            for (const [i, v] of state.tagsView.entries()) {
                if (v.path == tag) {
                    state.tagsView.splice(i, 1)
                    break;
                }
            }
        },
        DEL_CACHED_VIEW: (state, tag) => {
            for (const i of state.cachedViews) {
                if (i === tag) {
                    const index = state.cachedViews.indexOf(i)
                    state.cachedViews.splice(index, 1)
                    break
                }
            }
        },
        DEL_ALL: (state) => {
            state.tagsView = []
        },
        DEL_ALL_CACHED_VIEWS: state => {
            state.cachedViews = []
        },
        GET_LIST: (state, data) => {
            state.data = data
        }
    },
    actions: {
        addView({ dispatch }, tag) {
            dispatch('addTagsView', tag)
            dispatch('addCachedView', tag)
        },
        addNoticeRoute({ commit }, tag) {
            commit('SET_ARRIVAL_ROUTE', tag)
        },
        addTagsView({ commit }, tag) {
            commit('ADD_TAGS_VIEW', tag)
        },
        addCachedView({ commit }, tag) {
            commit('ADD_CASHED_VIEW', tag)
        },
        delTagsView({ commit, state }, tag) {
            return new Promise(resolve => {
                commit('DEL_TAGS_VIEW', tag)
                resolve([...state.tagsView])
            })
        },
        delCachedView({ commit, state }, tag) {
            return new Promise(resolve => {
                commit('DEL_CACHED_VIEW', tag)
                resolve([...state.cachedViews])
            })
        },
        delAll({ commit, state }) {
            commit('DEL_ALL')
            return new Promise(resolve => {
                resolve([...state.tagsView])
            })
        },
        delAllCachedViews({ commit, state }) {
            return new Promise(resolve => {
              commit('DEL_ALL_CACHED_VIEWS')
              resolve([...state.cachedViews])
            })
        },
        
    }
}

export default tags;