import axios from 'axios';
import moment from 'moment';
import lang from 'lodash/lang';

var apiUrl = process.env.VUE_APP_API_URL;

export const state = {
  openFolder: null,
  tree: null,
  loadingOpenFolder: true,
  show: {
    dropzone: false
  }
};

export const getters = {
  formatDate: (state) => (date) => {
    return moment(date).format('MMMM Do, YYYY');
  }
};

export const mutations = {
  SET_FOLDER (state, newValue) {
    state.openFolder = newValue; // Keep by reference
    if (newValue) {
      state.openFolder.folders = sortByKey(newValue.folders, 'name');
      state.openFolder.files = sortByKey(newValue.files, 'name');
    }
  },

  ADD_CHILD_FOLDER (state, folder) {
    // Add child folder to folder
    state.openFolder.folders.push(lang.cloneDeep(folder));
    state.openFolder.folders = sortByKey(state.openFolder.folders, 'name');
    // Add child folder to tree
    // let parent = searchTree(state.tree, state.openFolder.id)
    // if (parent) parent.folders.push(lang.cloneDeep(folder))
    // parent.folders = sortByKey(parent.folders, 'name')
  },

  ADD_CHILD_FILE (state, file) {
    // Add child folder to folder
    state.openFolder.files.push(lang.cloneDeep(file));
    state.openFolder.files = sortByKey(state.openFolder.files, 'name');
  },

  SET_TREE (state, newValue) {
    state.tree = lang.cloneDeep(newValue);
  },

  ADD_FOLDER_CHILREN_TO_TREE (state, folder) {
    let foundFolder = searchTree(state.tree, folder.id);
    foundFolder.folders = lang.cloneDeep(folder.folders);
    foundFolder.files = lang.cloneDeep(folder.files);
    state.tree = lang.cloneDeep(state.tree);
    foundFolder.folders = sortByKey(foundFolder.folders, 'name');
    foundFolder.files = sortByKey(foundFolder.files, 'name');
  },

  SET_LOADING_OPEN_FOLDER (state, newValue) {
    state.loadingOpenFolder = newValue;
  },

  UPDATE_FOLDER_NAME (state, { folder, newValue }) {
    folder.name = newValue;
    let foundFolder = searchTree(state.tree, folder.id);
    foundFolder.name = newValue;
    if (folder.folder_id) {
      foundFolder = searchTree(state.tree, folder.folder_id);
      foundFolder.folders = sortByKey(foundFolder.folders, 'name');
    }
    state.openFolder.folders = sortByKey(state.openFolder.folders, 'name');
  },

  REMOVE_FOLDER (state, folder) {
    for (var i = 0; i < state.openFolder.folders.length; i++) {
      if (state.openFolder.folders[i].id === folder.id) {
        state.openFolder.folders.splice(i, 1);
      }
    }
  },

  REMOVE_FILE (state, file) {
    for (var i = 0; i < state.openFolder.files.length; i++) {
      if (state.openFolder.files[i].id === file.id) {
        state.openFolder.files.splice(i, 1);
      }
    }
  },

  SET_SHOW_DROPZONE (state, newValue) {
    state.show.dropzone = newValue;
  }
};

export const actions = {
  updateTree ({ commit, state }, folder) {
    if (state.tree && folder) {
      commit('ADD_FOLDER_CHILREN_TO_TREE', folder);
    } else {
      commit('SET_TREE', folder);
    }
  },

  fetchFolder ({ commit, state, dispatch }, {
    folderId,
    force = false,
    setCurrent = true,
    expanding = false
  }) {
    if (!expanding) commit('SET_LOADING_OPEN_FOLDER', true);
    // Search tree first for cached folder
    if (!force) {
      let folder = searchTree(state.tree, folderId);
      if (folder.folders) {
        if (setCurrent) commit('SET_FOLDER', folder);
        if (!expanding) setTimeout(function () { commit('SET_LOADING_OPEN_FOLDER', false); }, 333);
        return Promise.resolve(folder);
      }
    }
    return axios.get(`${apiUrl}/v1/drive/folders/${folderId}/list`)
      .then(response => {
        dispatch('updateTree', response.data.data);
        let folder = searchTree(state.tree, response.data.data.id);
        if (setCurrent) commit('SET_FOLDER', folder);
        if (!expanding) commit('SET_LOADING_OPEN_FOLDER', false);
        return response.data.data;
      })
      .catch(() => {
        if (setCurrent) commit('SET_FOLDER', null);
        if (!expanding) commit('SET_LOADING_OPEN_FOLDER', false);
        this.commit('app/SET_SNACKBAR', {
          show: true,
          color: 'error',
          closeColor: 'white',
          text: 'Failed to load the folder!'
        });
      });
  },

  downloadFolder ({ state }, folder) {
    return axios.get(`${apiUrl}/v1/drive/folders/${folder.id}/download`, {
      responseType: 'arraybuffer'
    })
      .then(response => {
        let anchor = document.createElement('a');
        let blob = new Blob([response.data], { type: 'application/zip' });
        let windowUrl = window.URL || window.webkitURL;
        let url = windowUrl.createObjectURL(blob);
        anchor.setAttribute('href', url);
        anchor.setAttribute('download', `${folder.name}.zip`);
        anchor.click();
      })
      .catch(() => {
        this.commit('app/SET_SNACKBAR', {
          show: true,
          color: 'error',
          closeColor: 'white',
          text: 'Failed to download the folder!'
        });
      });
  },

  downloadFile ({ state }, file) {
    return axios.get(`${apiUrl}/v1/drive/files/${file.id}/download`, {
      responseType: 'arraybuffer'
    })
      .then(response => {
        let anchor = document.createElement('a');
        let blob = new Blob([response.data], { type: file.mime_type });
        let windowUrl = window.URL || window.webkitURL;
        let url = windowUrl.createObjectURL(blob);
        anchor.setAttribute('href', url);
        anchor.setAttribute('download', `${file.name}.${file.extension}`);
        anchor.click();
      })
      .catch(() => {
        this.commit('app/SET_SNACKBAR', {
          show: true,
          color: 'error',
          closeColor: 'white',
          text: 'Failed to download the file!'
        });
      });
  },

  createFolder ({ commit }, { name = null, folderId = null }) {
    return axios.post(`${apiUrl}/v1/drive/folders`, {
      name: name,
      folder_id: folderId
    })
      .then(response => {
        commit('ADD_CHILD_FOLDER', response.data.data);
        // commit('ADD_FOLDER_CHILREN_TO_TREE', response.data)
      })
      .catch(() => {
        this.commit('app/SET_SNACKBAR', {
          show: true,
          color: 'error',
          closeColor: 'white',
          text: 'Failed to create the folder!'
        });
      });
  },

  renameFolder ({ state, commit }, { folder, name }) {
    return axios.patch(`${apiUrl}/v1/drive/folders/${folder.id}`, { name: name })
      .then(response => {
        commit('UPDATE_FOLDER_NAME', {
          folder: folder,
          newValue: response.data.data.name
        });
      })
      .catch(() => {
        this.commit('app/SET_SNACKBAR', {
          show: true,
          color: 'error',
          closeColor: 'white',
          text: 'Failed to trash the folder!'
        });
      });
  },

  trashFolder ({ state, commit }, folder) {
    if (folder.folder_id === null) {
      this.commit('app/SET_SNACKBAR', {
        show: true,
        color: 'error',
        closeColor: 'white',
        text: 'You cannot remove the root folder.'
      });
      return Promise.resolve(false);
    }
    return axios.delete(`${apiUrl}/v1/drive/folders/${folder.id}/trash`)
      .then(response => {
        // Open the parent folder since we are trashing the current one
        if (folder.id === state.openFolder.id) {
          let foundFolder = searchTree(state.tree, folder.folder_id);
          commit('SET_FOLDER', foundFolder);
        }
        commit('REMOVE_FOLDER', folder);

        return axios.delete(`${apiUrl}/v1/drive/folders/${folder.id}`)
          .then(response => {
            //
          })
          .catch(() => {
            this.commit('app/SET_SNACKBAR', {
              show: true,
              color: 'error',
              closeColor: 'white',
              text: 'Failed to delete the folder!'
            });
          });
      })
      .catch(() => {
        this.commit('app/SET_SNACKBAR', {
          show: true,
          color: 'error',
          closeColor: 'white',
          text: 'Failed to trash the folder!'
        });
      });
  },

  trashFile ({ state, commit }, file) {
    return axios.delete(`${apiUrl}/v1/drive/files/${file.id}/trash`)
      .then(response => {
        commit('REMOVE_FILE', file);

        return axios.delete(`${apiUrl}/v1/drive/files/${file.id}`)
          .then(response => {
            //
          })
          .catch(() => {
            this.commit('app/SET_SNACKBAR', {
              show: true,
              color: 'error',
              closeColor: 'white',
              text: 'Failed to delete the file!'
            });
          });
      })
      .catch(() => {
        this.commit('app/SET_SNACKBAR', {
          show: true,
          color: 'error',
          closeColor: 'white',
          text: 'Failed to trash the file!'
        });
      });
  }
};

let searchTree = (folder, folderToFindId) => {
  if (!folder) return false;
  if (folder.id === folderToFindId) {
    return folder;
  }
  if (folder.folders) {
    for (let i in folder.folders) {
      let result = searchTree(folder.folders[i], folderToFindId);
      if (result) return result;
    }
  }
  return false;
};

let sortByKey = (sortable = [], key = 'name') => {
  return sortable.sort((a, b) => {
    return a[key].localeCompare(b[key], 'en', {
      numeric: true,
      sensitivity: 'base'
    });
  });
};
