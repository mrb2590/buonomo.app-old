import { getSavedState, saveState } from '../functions'

export const state = {
  darkMode: getSavedState('preferences.darkMode', 'local')
}

export const getters = {
  //
}

export const mutations = {
  SET_DARK_MODE (state, newValue) {
    state.darkMode = newValue
    saveState('preferences.darkMode', newValue, 'local')
  }
}

export const actions = {
  init ({ state, dispatch, commit }) {
    commit('SET_DARK_MODE', state.darkMode ? state.darkMode : false)
  }
}
