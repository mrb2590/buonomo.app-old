import axios from 'axios';
import moment from 'moment';
import lang from 'lodash/lang';

var apiUrl = process.env.VUE_APP_API_URL;

export const state = {
  openFolder: null,
  tree: null,
  loadingOpenFolder: true,
  dialogRenameFile: null, // The file to rename
  // Show.hide state of something
  show: {
    dropzone: false,
    dialogRenameFile: false
  },
  // Current events happening (for animations usually)
  events: {
    updatingFolderSizes: false
  }
};

export const getters = {
  formatDate: (state) => (date) => {
    return moment(date).format('MMMM Do, YYYY');
  }
};

export const mutations = {
  SET_OPEN_FOLDER (state, newValue) {
    state.openFolder = newValue; // Keep by reference
    if (newValue) {
      state.openFolder.folders = sortByKey(newValue.folders, 'name');
      state.openFolder.files = sortByKey(newValue.files, 'name');
    }
  },

  SET_FOLDER_ATTRIBUTE (state, { folder, attribute, newValue }) {
    folder[attribute] = newValue;
  },

  SET_FILE_ATTRIBUTE (state, { file, attribute, newValue }) {
    file[attribute] = newValue;
  },

  SET_TREE (state, newValue) {
    state.tree = lang.cloneDeep(newValue);
  },

  SET_LOADING_OPEN_FOLDER (state, newValue) {
    state.loadingOpenFolder = newValue;
  },

  SET_UPDATING_FOLDER_SIZES (state, newValue) {
    state.events.updatingFolderSizes = newValue;
  },

  SET_SHOW_DROPZONE (state, newValue) {
    state.show.dropzone = newValue;
  },

  SET_DIALOG_RENAME_FILE (state, newValue) {
    state.dialogRenameFile = newValue;
  },

  SET_SHOW_DIALOG_RENAME_FILE (state, newValue) {
    state.show.dialogRenameFile = newValue;
  },

  ADD_FOLDER_TO_OPEN_FOLDER (state, folder) {
    state.openFolder.folders.push(lang.cloneDeep(folder));
    state.openFolder.folders = sortByKey(state.openFolder.folders, 'name');
  },

  ADD_FILE_TO_OPEN_FOLDER (state, file) {
    state.openFolder.files.push(lang.cloneDeep(file));
    state.openFolder.files = sortByKey(state.openFolder.files, 'name');

    // Update parent folder sizes
    state.events.updatingFolderSizes = true;

    recursiveForEachParent(state.tree, file.folder_id, (parentFolder) => {
      parentFolder.size += file.size;
      parentFolder.formatted_size = formatBytes(parentFolder.size);
    });

    state.events.updatingFolderSizes = false;
  },

  ADD_FOLDER_CHILREN_TO_TREE (state, folder) {
    let foundFolder = searchTree(state.tree, folder.id);
    foundFolder.folders = lang.cloneDeep(folder.folders);
    foundFolder.files = lang.cloneDeep(folder.files);
    state.tree = lang.cloneDeep(state.tree);
    foundFolder.folders = sortByKey(foundFolder.folders, 'name');
    foundFolder.files = sortByKey(foundFolder.files, 'name');
  },

  UPDATE_FOLDER_NAME (state, { folder, newValue }) {
    folder.name = newValue;

    // Sort parent folder in tree
    if (folder.folder_id) {
      let foundFolder = searchTree(state.tree, folder.folder_id);
      foundFolder.folders = sortByKey(foundFolder.folders, 'name');
    }
  },

  REMOVE_FOLDER_FROM_OPEN_FOLDER (state, folder) {
    for (var i = 0; i < state.openFolder.folders.length; i++) {
      if (state.openFolder.folders[i].id === folder.id) {
        state.openFolder.folders.splice(i, 1);
      }
    }
  },

  REMOVE_FILE_FROM_OPEN_FOLDER (state, file) {
    for (var i = 0; i < state.openFolder.files.length; i++) {
      if (state.openFolder.files[i].id === file.id) {
        state.openFolder.files.splice(i, 1);
      }
    }
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
        if (setCurrent) commit('SET_OPEN_FOLDER', folder);
        if (!expanding) setTimeout(function () { commit('SET_LOADING_OPEN_FOLDER', false); }, 333);
        return Promise.resolve(folder);
      }
    }
    return axios.get(`${apiUrl}/v1/drive/folders/${folderId}/list`)
      .then(response => {
        dispatch('updateTree', response.data.data);
        let folder = searchTree(state.tree, response.data.data.id);
        if (setCurrent) commit('SET_OPEN_FOLDER', folder);
        if (!expanding) commit('SET_LOADING_OPEN_FOLDER', false);
        return response.data.data;
      })
      .catch(() => {
        if (setCurrent) commit('SET_OPEN_FOLDER', null);
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
        commit('ADD_FOLDER_TO_OPEN_FOLDER', response.data.data);
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
          text: 'Failed to rename the folder!'
        });
      });
  },

  renameFile ({ state, commit }, { file, name }) {
    return axios.patch(`${apiUrl}/v1/drive/files/${file.id}`, { name: name })
      .then(response => {
        commit('SET_FILE_ATTRIBUTE', {
          file: file,
          attribute: 'name',
          newValue: response.data.data.name
        });
      })
      .catch(() => {
        this.commit('app/SET_SNACKBAR', {
          show: true,
          color: 'error',
          closeColor: 'white',
          text: 'Failed to rename the folder!'
        });
      });
  },

  trashFolder ({ state, commit, dispatch }, folder) {
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

          commit('SET_OPEN_FOLDER', foundFolder);
        }
        commit('REMOVE_FOLDER_FROM_OPEN_FOLDER', folder);

        return dispatch('deleteFolder', folder);
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

  deleteFolder ({ state, commit }, folder) {
    if (folder.folder_id === null) {
      this.commit('app/SET_SNACKBAR', {
        show: true,
        color: 'error',
        closeColor: 'white',
        text: 'You cannot remove the root folder.'
      });

      return Promise.resolve(false);
    }

    commit('SET_UPDATING_FOLDER_SIZES', true);

    return axios.delete(`${apiUrl}/v1/drive/folders/${folder.id}`)
      .then(response => {
        // Update all parent folder sizes
        if (folder.folder_id) {
          recursiveForEachParent(state.tree, folder.folder_id, (parentFolder) => {
            let newFolderSize = parentFolder.size - folder.size;

            commit('SET_FOLDER_ATTRIBUTE', {
              folder: parentFolder,
              attribute: 'size',
              newValue: newFolderSize
            });
            commit('SET_FOLDER_ATTRIBUTE', {
              folder: parentFolder,
              attribute: 'formatted_size',
              newValue: formatBytes(newFolderSize, 2)
            });
          });
        }

        // Update user's used drive bytes
        let newUsedDriveBytes = this.state.user.user.used_drive_bytes - folder.size;

        this.commit('user/SET_USER_ATTRIBUTE', {
          attribute: 'used_drive_bytes',
          newValue: newUsedDriveBytes
        });
        this.commit('user/SET_USER_ATTRIBUTE', {
          attribute: 'formatted_used_drive_bytes',
          newValue: formatBytes(newUsedDriveBytes, 2)
        });

        commit('SET_UPDATING_FOLDER_SIZES', false);
      })
      .catch(() => {
        this.commit('app/SET_SNACKBAR', {
          show: true,
          color: 'error',
          closeColor: 'white',
          text: 'Failed to delete the folder!'
        });

        commit('SET_UPDATING_FOLDER_SIZES', false);
      });
  },

  trashFile ({ state, commit, dispatch }, file) {
    return axios.delete(`${apiUrl}/v1/drive/files/${file.id}/trash`)
      .then(response => {
        commit('REMOVE_FILE_FROM_OPEN_FOLDER', file);

        return dispatch('deleteFile', file);
      })
      .catch(() => {
        this.commit('app/SET_SNACKBAR', {
          show: true,
          color: 'error',
          closeColor: 'white',
          text: 'Failed to trash the file!'
        });
      });
  },

  deleteFile ({ state, commit }, file) {
    commit('SET_UPDATING_FOLDER_SIZES', true);

    return axios.delete(`${apiUrl}/v1/drive/files/${file.id}`)
      .then(response => {
        // Update all parent folder sizes
        recursiveForEachParent(state.tree, file.folder_id, (parentFolder) => {
          let newFolderSize = parentFolder.size - file.size;

          commit('SET_FOLDER_ATTRIBUTE', {
            folder: parentFolder,
            attribute: 'size',
            newValue: newFolderSize
          });
          commit('SET_FOLDER_ATTRIBUTE', {
            folder: parentFolder,
            attribute: 'formatted_size',
            newValue: formatBytes(newFolderSize, 2)
          });
        });

        // Update user's used drive bytes
        let newUsedDriveBytes = this.state.user.user.used_drive_bytes - file.size;

        this.commit('user/SET_USER_ATTRIBUTE', {
          attribute: 'used_drive_bytes',
          newValue: newUsedDriveBytes
        });
        this.commit('user/SET_USER_ATTRIBUTE', {
          attribute: 'formatted_used_drive_bytes',
          newValue: formatBytes(newUsedDriveBytes, 2)
        });

        commit('SET_UPDATING_FOLDER_SIZES', false);
      })
      .catch(() => {
        this.commit('app/SET_SNACKBAR', {
          show: true,
          color: 'error',
          closeColor: 'white',
          text: 'Failed to delete the file!'
        });

        commit('SET_UPDATING_FOLDER_SIZES', false);
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

let recursiveForEachParent = (tree, folderId, callback) => {
  if (!folderId) return;

  let parent = searchTree(tree, folderId);

  callback(parent);

  recursiveForEachParent(tree, parent.folder_id, callback);
};

let formatBytes = (bytes, decimals) => {
  if (bytes === 0) return '0 Bytes';
  let k = 1024;
  let dm = decimals <= 0 ? 0 : decimals || 2;
  let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
