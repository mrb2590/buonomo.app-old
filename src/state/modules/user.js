import axios from 'axios'
import moment from 'moment'

var apiUrl = process.env.VUE_APP_API_URL

export const state = {
  user: null
}

export const getters = {
  fullName (state) {
    if (state.user) {
      return `${state.user.first_name} ${state.user.last_name}`
    }
  },

  initials (state) {
    if (state.token) {
      return `${state.user.first_name.charAt(0)}${state.user.last_name.charAt(0)}`
    }
  },

  formatDate: (state) => (date) => {
    return moment(date).format('MMMM Do, YYYY')
  }
}

export const mutations = {
  SET_USER (state, newValue) {
    state.user = newValue
  }
}

export const actions = {
  fetchUser ({ commit, state }) {
    if (state.user) {
      return
    }
    return axios.get(`${apiUrl}/v1/user`)
      .then(response => {
        commit('SET_USER', response.data)
        return response.data
      })
      .catch(error => {
        if (error) {
          commit('SET_USER', null)
        }
        console.log('Could not fetch profile.')
        console.log(error)
      })
  }
}
