let MyPlugin = {}
import { Title, Pagination, ConfigSet, Table, Dialog ,BottomBtn, Editor,PrintNotice} from '@/components/common'
import api from '@/api'
import utils from '@/utils'

MyPlugin.install = function(Vue){
    //注册全局组件
    Vue.component('V-Title', Title);
    Vue.component('V-Pagination', Pagination);
    Vue.component('ConfigSet', ConfigSet);
    Vue.component('V-Table', Table);
    Vue.component('V-Dialog', Dialog);
    Vue.component('V-BottomBtn', BottomBtn);
    Vue.component('V-Editor', Editor);
    Vue.component('PrintNotice', PrintNotice);
    //全局方法
    Vue.prototype.$api = api;
    Vue.prototype.$utils = utils;
}

export {
    MyPlugin
}