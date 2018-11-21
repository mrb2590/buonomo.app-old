const defaultSnackbar = {
  show: false,
  color: 'dark',
  closeColor: 'pink',
  multiline: false,
  timeout: 0,
  vertical: false,
  text: ''
};

export const state = {
  dialogFullscreen: false,
  snackbar: { ...defaultSnackbar }
};

export const getters = {
  //
};

export const mutations = {
  SET_DIALOG_FULLSCREEN (state) {
    state.dialogFullscreen = window.innerWidth < 600;
  },
  SET_SNACKBAR (state, newvalue) {
    state.snackbar = Object.assign(state.snackbar, defaultSnackbar, newvalue);
  },
  RESET_SNACKBAR (state) {
    state.snackbar = { ...defaultSnackbar };
  }
};

export const actions = {
  init ({ state, dispatch, commit }) {
    commit('SET_DIALOG_FULLSCREEN');

    window.onresize = function () {
      commit('SET_DIALOG_FULLSCREEN');
    };
  }
};
