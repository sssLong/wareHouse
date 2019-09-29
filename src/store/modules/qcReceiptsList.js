const QcReceiptsList = {
  namespaced: true,
  state: {
    row: {}
  },
  getters: {
    getRow: state => state.row
  },
  mutations: {
    SET_ROW(state, row) {
      state.row = row
    }
  },
  actions: {
    setRow({ commit }, row) {
      commit('SET_ROW',row)
    }
  }
}

export default QcReceiptsList;
