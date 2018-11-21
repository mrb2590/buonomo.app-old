import axios from 'axios';
import { getSavedState, saveState } from '../functions';

var apiUrl = process.env.VUE_APP_API_URL;

export const state = {
  token: null,
  remember: getSavedState('auth.remember', 'local')
};

export const mutations = {
  SET_TOKEN (state, newValue) {
    state.token = newValue;
    saveState('auth.token', newValue, state.remember ? 'local' : 'session');
    setDefaultAuthHeaders(state);
  },

  SET_REMEMBER (state, newValue) {
    state.remember = newValue;
    saveState('auth.remember', newValue, 'local');
  }
};

export const getters = {
  // Whether the user is currently logged in.
  signedIn (state) {
    return !!state.token;
  }
};

export const actions = {
  // This is automatically run in `src/state/store.js` when the app
  // starts, along with any other actions named `init` in other modules.
  init ({ state, dispatch, commit }) {
    setDefaultAuthHeaders(state);
    commit('SET_REMEMBER', state.remember ? state.remember : false);
    commit('SET_TOKEN', getSavedState('auth.token', state.remember ? 'local' : 'session'));
  },

  // Logs in the current user.
  signIn ({ commit, dispatch, getters }, { email, password, remember } = {}) {
    if (getters.loggedIn) return dispatch('validate');
    return axios.post(`${apiUrl}/oauth/token`, {
      grant_type: 'password',
      username: email,
      password: password,
      client_id: process.env.VUE_APP_CLIENT_ID,
      client_secret: process.env.VUE_APP_CLIENT_SECRET,
      scope: '*'
    })
      .then(response => {
        response.data.expires_on = getTimestamp(response.data.expires_in);
        const token = response.data;
        commit('SET_TOKEN', token);
        return token;
      });
  },

  // Logs out the current user.
  signOut ({ commit }) {
    commit('SET_TOKEN', null);
    this.commit('user/SET_USER', null);
  },

  // Validates the current user's token and refreshes it
  // with new data from the API.
  validate ({ commit, state }) {
    // Check if token is set
    if (!state.token) return Promise.resolve(null);
    // If the token is expired, try to refresh it
    let date = new Date();
    if (date.getTime() >= state.token.expires_on) {
      return axios.post(`${apiUrl}/oauth/token`, {
        grant_type: 'refresh_token',
        refresh_token: state.token.refresh_token,
        client_id: process.env.VUE_APP_CLIENT_ID,
        client_secret: process.env.VUE_APP_CLIENT_SECRET,
        scope: '*'
      })
        .then(response => {
          response.data.expires_on = getTimestamp(response.data.expires_in);
          const token = response.data;
          commit('SET_TOKEN', token);
          return this.dispatch('user/fetchUser').then(response => {
            return true;
          });
        })
        .catch(error => {
          if (error.response.status === 401) {
            commit('SET_TOKEN', null);
          }
          this.commit('app/SET_SNACKBAR', {
            show: true,
            color: 'error',
            closeColor: 'white',
            text: 'Failed to reauthenticate!'
          });
          return false;
        });
    } else {
      // Otherwise token is set and should be valid
      return this.dispatch('user/fetchUser').then(response => {
        return true;
      });
    }
  }
};

// Set auth headers for axios
function setDefaultAuthHeaders (state) {
  axios.defaults.headers.common.Accept = 'application/json';
  axios.defaults.headers.common.Authorization = state.token
    ? `Bearer ${state.token.access_token}`
    : '';
}

// Return a timestamp for when the token expires
function getTimestamp (expiresIn) {
  let date = new Date();
  return date.getTime() + (expiresIn * 1000 - 10000);
}
