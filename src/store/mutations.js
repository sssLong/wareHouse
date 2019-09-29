import * as types from './mutation-types';

export default {
    // 增加
    [types.INCREMENT]: state => {
        state.count++;
    },
    // 减少
    [types.DECREMENT]: state => {
        state.count--;
    },
    // 设置TOKEN
    [types.SET_TOKEN]: (state, token) => {
        state.token = token
    },
    // 设置菜单栏选中项
    [types.SET_ACTIVE]: (state, active) => {
        state.activeMenu = active
    },
     // 设置公共表格是否重绘  优化窗口变化 表格不会再次加载计算高度
     [types.SET_SCREENHEIGHT]: (state, value) => {
        state.screenHeight = value
    },
    [types.TOGGLE_DISBAND_FLAG] (state) {
        state.disbandFlag = !state.disbandFlag
    },
    GET_CARDBORD: (state,data) => {
        state.cardBord = data.cardBord;
        state.len = data.len;
    }
}
