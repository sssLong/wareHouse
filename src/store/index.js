import Vue from "vue";
import Vuex from "vuex";
import mutations from "./mutations";
import getters from "./getters";
import * as actions from "./actions";
import createPersistedState from "vuex-persistedstate"

import tags from './Tags'
import qcReceiptsList from './modules/qcReceiptsList'
import shelfList from './modules/shelfList'
import warehouse from './modules/warehouse'
import permission from './modules/permission'
Vue.use(Vuex);
const state = {
    count: 0, // 测试
    todos: [
        { id: 1, text: "...", done: true },
        { id: 2, text: "...", done: false }
    ], // 测试
    token: "", // token
    activeMenu: "", // 菜单栏选中项
    screenHeight: 0, // 
    cardBord: '',    //卡板号
    len: 0,   //卡板绑定的运单数量
    defaultPwd:'',
    disbandFlag: false // 解散后清除集包称重页面数据
};

export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    modules: {
        tags,
        qcReceiptsList,
        shelfList,
        warehouse,
        permission
    },
    plugins: [createPersistedState({
        storage: window.localStorage,
        reducer(val) {
            return {
                // 只储存state中的tags数据
                tags: val.tags,
                qcReceiptsList: val.qcReceiptsList,
                shelfList: val.shelfList
            }
        }
    })]
});