const state = {
    // 判断
    isFreshAdd: false, // 仓库新增
    isFreshAddA: false, // 库区新增
    isFreshAddS: false, // 货列新增
    isFreshAddG: false, // 货位新增
    isFreshAddQ: false, // 质检台新增
    isFreshAddC: false, // 码表新增
    isFreshAddL: false, // 物流新增
    isFreshEdit: false,
    formDetail: false,
    formDetailC: false
};

const mutations = {
    // 判断新增页面是否清缓存
    getFreshAdd(state, params) {
        state.isFreshAdd = params
    },
    getFreshAddA(state, params) {
        state.isFreshAddA = params
    },
    getFreshAddS(state, params) {
        state.isFreshAddS = params
    },
    getFreshAddG(state, params) {
        state.isFreshAddG = params
    },
    getFreshAddQ(state, params) {
        state.isFreshAddQ = params
    },
    getFreshAddC(state, params) {
        state.isFreshAddC = params
    },
    getFreshAddL(state, params) {
        state.isFreshAddL = params
    },
    // 判断编辑页面是否清缓存
    getFreshEdit(state, params) {
        state.isFreshEdit = params
    },
    // 判断仓库编辑页面是否从详情页进来的
    getFormDetail(state, params) {
        state.formDetail = params
    },
    // 判断码表编辑页面是否从详情页进来的
    getFormDetailC(state, params) {
        state.formDetailC = params
    },
};
export default {
    state,
    mutations,
};