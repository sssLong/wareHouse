import * as types from './mutation-types';
export const GET_CARDBORD = ({ commit },data) => {
    commit('GET_CARDBORD',data)
}

export const increment = ({ commit, state }) => {
	commit(types.INCREMENT,state)
 }


