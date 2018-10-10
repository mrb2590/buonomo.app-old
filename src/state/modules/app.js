export const state = {
  dialogFullscreen: false
}

export const getters = {
  //
}

export const mutations = {
  SET_DIALOG_FULLSCREEN (state) {
    state.dialogFullscreen = window.innerWidth < 600
  }
}

export const actions = {
  init ({ state, dispatch, commit }) {
    commit('SET_DIALOG_FULLSCREEN')

    window.onresize = function () {
      commit('SET_DIALOG_FULLSCREEN')
    }
  }
}
