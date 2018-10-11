import axios from 'axios'
import moment from 'moment'
import { b64toBlob } from '../../state/functions'
import lang from 'lodash/lang'

var apiUrl = process.env.VUE_APP_API_URL

export const state = {
  openFolder: null,
  tree: null,
  loadingOpenFolder: true
}

export const getters = {
  formatDate: (state) => (date) => {
    return moment(date).format('MMMM Do, YYYY')
  }
}

export const mutations = {
  SET_FOLDER (state, newValue) {
    state.openFolder = lang.cloneDeep(newValue)
    if (newValue) {
      state.openFolder.children = sortByKey(state.openFolder.children, 'name')
      state.openFolder.files = sortByKey(state.openFolder.files, 'display_filename')
    }
  },
  ADD_CHILD_FOLDER (state, folder) {
    // Add child folder to folder
    state.openFolder.children.push(lang.cloneDeep(folder))
    state.openFolder.children = sortByKey(state.openFolder.children, 'name')
    // Add child folder to tree
    let parent = searchTree(state.tree, state.openFolder.id)
    if (parent) parent.children.push(lang.cloneDeep(folder))
    parent.children = sortByKey(parent.children, 'name')
  },
  SET_TREE (state, newValue) {
    state.tree = lang.cloneDeep(newValue)
  },
  ADD_FOLDER_TO_TREE (state, folder) {
    let foundFolder = searchTree(state.tree, folder.id)
    foundFolder.children = lang.cloneDeep(folder.children)
    state.tree = lang.cloneDeep(state.tree)
    foundFolder.children = sortByKey(foundFolder.children, 'name')
  },
  SET_LOADING_OPEN_FOLDER (state, newValue) {
    state.loadingOpenFolder = newValue
  },
  UPDATE_FOLDER_NAME (state, { folder, newValue }) {
    folder.name = newValue
    let foundFolder = searchTree(state.tree, folder.id)
    foundFolder.name = newValue
    if (folder.parent_id) {
      foundFolder = searchTree(state.tree, folder.parent_id)
      foundFolder.children = sortByKey(foundFolder.children, 'name')
    }
    state.openFolder.children = sortByKey(state.openFolder.children, 'name')
  }
}

export const actions = {
  updateTree ({ commit, state }, folder) {
    if (state.tree && folder) {
      commit('ADD_FOLDER_TO_TREE', folder)
    } else {
      commit('SET_TREE', folder)
    }
  },

  fetchFolder ({ commit, state, dispatch }, {
    folderId,
    force = false,
    setCurrent = true,
    expanding = false
  }) {
    if (!expanding) commit('SET_LOADING_OPEN_FOLDER', true)
    // Search tree first for cached folder
    if (!force) {
      let folder = searchTree(state.tree, folderId)
      if (folder.children) {
        if (setCurrent) commit('SET_FOLDER', folder)
        if (!expanding) setTimeout(function () { commit('SET_LOADING_OPEN_FOLDER', false) }, 333)
        return Promise.resolve(folder)
      }
    }
    return axios.get(`${apiUrl}/v1/folders/${folderId}/children`)
      .then(response => {
        if (setCurrent) commit('SET_FOLDER', response.data)
        dispatch('updateTree', response.data)
        if (!expanding) commit('SET_LOADING_OPEN_FOLDER', false)
        return response.data
      })
      .catch(() => {
        if (setCurrent) commit('SET_FOLDER', null)
        if (!expanding) commit('SET_LOADING_OPEN_FOLDER', false)
        this.commit('app/SET_SNACKBAR', {
          show: true,
          color: 'error',
          closeColor: 'white',
          text: 'Failed to load the folder!'
        })
      })
  },

  downloadFolder ({ state }, folderId) {
    return axios.get(`${apiUrl}/v1/folders/${folderId}/download`, {
      params: {
        encoded: 1
      }
    })
      .then(response => {
        let anchor = document.createElement('a')
        let blob = b64toBlob(response.data.file, 'application/zip')
        let windowUrl = window.URL || window.webkitURL
        let url = windowUrl.createObjectURL(blob)
        anchor.setAttribute('href', url)
        anchor.setAttribute('download', response.data.filename)
        anchor.click()
      })
      .catch(() => {
        this.commit('app/SET_SNACKBAR', {
          show: true,
          color: 'error',
          closeColor: 'white',
          text: 'Failed to download the folder!'
        })
      })
  },

  downloadFile ({ state }, file) {
    return axios.get(`${apiUrl}/v1/files/${file.id}/download`, {
      params: {
        encoded: 1
      }
    })
      .then(response => {
        let anchor = document.createElement('a')
        let blob = b64toBlob(response.data.file, file.mime_type)
        let windowUrl = window.URL || window.webkitURL
        let url = windowUrl.createObjectURL(blob)
        anchor.setAttribute('href', url)
        anchor.setAttribute('download', response.data.filename)
        anchor.click()
      })
      .catch(() => {
        this.commit('app/SET_SNACKBAR', {
          show: true,
          color: 'error',
          closeColor: 'white',
          text: 'Failed to download the file!'
        })
      })
  },

  addFolder ({ commit }, { name = null, parentId = null }) {
    return axios.post(`${apiUrl}/v1/folders`, {
      name: name,
      parent_id: parentId
    })
      .then(response => {
        commit('ADD_CHILD_FOLDER', response.data)
        commit('ADD_FOLDER_TO_TREE', response.data)
      })
      .catch(() => {
        this.commit('app/SET_SNACKBAR', {
          show: true,
          color: 'error',
          closeColor: 'white',
          text: 'Failed to create the folder!'
        })
      })
  },

  renameFolder ({ state, commit }, { folder, name }) {
    return axios.patch(`${apiUrl}/v1/folders/${folder.id}`, { name: name })
      .then(response => {
        commit('UPDATE_FOLDER_NAME', {
          folder: folder,
          newValue: response.data.name
        })
      })
      .catch(() => {
        this.commit('app/SET_SNACKBAR', {
          show: true,
          color: 'error',
          closeColor: 'white',
          text: 'Failed to rename the folder!'
        })
      })
  }
}

let searchTree = (folder, folderToFindId) => {
  if (!folder) return false
  if (folder.id === folderToFindId) {
    return folder
  }
  if (folder.children) {
    for (let i in folder.children) {
      let result = searchTree(folder.children[i], folderToFindId)
      if (result) return result
    }
  }
  return false
}

let sortByKey = (sortable = [], key = 'name') => {
  return sortable.sort((a, b) => {
    return a[key].localeCompare(b[key], 'en', {
      numeric: true,
      sensitivity: 'base'
    })
  })
}
