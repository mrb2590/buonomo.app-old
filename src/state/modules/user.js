import axios from 'axios';
import moment from 'moment';
import lang from 'lodash/lang';

var apiUrl = process.env.VUE_APP_API_URL;

export const state = {
  user: null
};

export const getters = {
  fullName (state) {
    if (state.user) {
      return `${state.user.first_name} ${state.user.last_name}`;
    }
  },

  initials (state) {
    if (state.token) {
      return `${state.user.first_name.charAt(0)}${state.user.last_name.charAt(0)}`;
    }
  },

  formatDate: (state) => (date) => {
    return moment(date).format('MMMM Do, YYYY');
  }
};

export const mutations = {
  SET_USER (state, newValue) {
    state.user = lang.cloneDeep(newValue);
  }
};

export const actions = {
  async fetchUser ({ commit, state }, force = false) {
    if (!force && state.user) {
      return;
    }
    return axios.get(`${apiUrl}/v1/user`)
      .then(response => {
        commit('SET_USER', response.data.data);
        return response.data.data;
      })
      .catch(() => {
        commit('SET_USER', null);
        this.commit('app/SET_SNACKBAR', {
          show: true,
          text: 'Failed to load your profile!',
          timeout: 12
        });
      });
  }
};
