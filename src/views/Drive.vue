<template>
  <div class="drive" @keyup="checkKeyboardShortcuts(e)" @keydown="checkKeyboardShortcuts(e)">
    <ExplorerToolbar
      :folder="openFolder"
      :openNewFolder="openNewFolder"
      @toggleSidebar="toggleSidebar()"
      @downloadFolder="downloadFolder(openFolder)"
      @showDialogFolderInfo="setShowDialogFolderInfo(true); infoFolder = openFolder"
      @showDialogCreateFolder="setShowDialogCreateFolder"
      @showDialogRenameFolder="setShowDialogRenameFolder(true); infoFolder = openFolder"
      @trashFolder="trashFolder(openFolder)"
    />

    <div class="drive-container" :class="{ 'sidebar-open': sidebarOpen }">

      <Dropzone v-if="openFolder" />

      <div class="sidebar">
        <ul class="folder-tree">
          <FolderTree
            v-if="tree"
            :folder="tree"
            :openFolder="openNewFolder"
            :startExpanded="true"
          >
          </FolderTree>
        </ul>
        <div class="drive-storage" v-if="openFolder">
          {{ $store.state.drive.tree.total_folders}} Folders - {{ $store.state.drive.tree.total_files}} Files
          <v-progress-linear :value="this.$store.state.user.user.used_drive_bytes / this.$store.state.user.user.allocated_drive_bytes * 100"></v-progress-linear>
          Used
          <span v-show="!$store.state.drive.events.updatingFolderSizes">
            {{ $store.state.user.user.formatted_used_drive_bytes }}
          </span>
          <span v-show="$store.state.drive.events.updatingFolderSizes">
            <v-progress-circular
              indeterminate
              color="primary"
              size="14"
              :width="2"
            ></v-progress-circular>
          </span>
          of {{ $store.state.user.user.formatted_allocated_drive_bytes }}
        </div>
      </div>

      <div class="explorer">
        <transition name="fade">
          <div class="center-align-outer" v-show="loadingOpenFolder">
            <div class="center-align-inner">
              <v-progress-circular indeterminate :size="50" :width="5" color="secondary"></v-progress-circular>
            </div>
          </div>
        </transition>

        <transition name="fade">
          <v-container fluid v-show="!loadingOpenFolder">
            <v-layout row wrap v-if="openFolder">

              <v-flex xs12>
                <div class="title explorer-title">
                  <v-chip color="primary">{{ openFolder.folders_count }}</v-chip>
                  Folders
                </div>
                <div class="body-1 explorer-title" v-if="!openFolder.folders.length">There are no folders to show.</div>
              </v-flex>

              <v-flex xs12 sm12 md6 lg4 xl3
                v-for="(childFolder, index) in openFolder.folders"
                v-bind:key="`folder-${index}`"
              >
                <Folder
                  :folder="childFolder"
                  :openNewFolder="openNewFolder"
                  @showInfoFolder="setShowInfoFolder"
                  @showDialogFolderInfo="setShowDialogFolderInfo"
                  @showDialogRenameFolder="setShowDialogRenameFolder"
                />
              </v-flex>

              <v-flex xs12>
                <div class="title explorer-title">
                  <v-chip color="primary">{{ openFolder.files_count }}</v-chip>
                  Files
                </div>
                <div class="body-1 explorer-title" v-if="!openFolder.files.length">There are no files to show.</div>
              </v-flex>

              <v-flex xs12 sm12 md6 lg4 xl3
                v-for="(file, index) in openFolder.files"
                v-bind:key="`file-${index}`"
              >
                <File
                  :file="file"
                  @showInfoFile="setShowInfoFile"
                  @showDialogFileInfo="setShowDialogFileInfo"
                />
              </v-flex>

            </v-layout>
          </v-container>
        </transition>
      </div>
    </div>

    <DialogRenameFile />
    <DialogRenameFolder :folder="infoFolder" @showDialogRenameFolder="setShowDialogRenameFolder"/>
    <DialogCreateFolder @showDialogCreateFolder="setShowDialogCreateFolder"/>
    <DialogFolderInfo :folder="infoFolder" @showDialogFolderInfo="setShowDialogFolderInfo"/>
    <DialogFileInfo :file="infoFile" @showDialogFileInfo="setShowDialogFileInfo"/>
  </div>
</template>

<script>
import DialogCreateFolder from '../components/drive/DialogCreateFolder';
import DialogFileInfo from '../components/drive/DialogFileInfo';
import DialogFolderInfo from '../components/drive/DialogFolderInfo';
import DialogRenameFile from '../components/drive/DialogRenameFile';
import DialogRenameFolder from '../components/drive/DialogRenameFolder';
import Dropzone from '../components/drive/Dropzone';
import ExplorerToolbar from '../components/drive/ExplorerToolbar';
import File from '../components/drive/File';
import Folder from '../components/drive/Folder';
import FolderTree from '../components/drive/FolderTree';
import { userComputed, driveComputed, driveMethods } from '../state/helpers';

export default {
  name: 'Drive',

  metaInfo: {
    title: 'Drive',
    meta: [
      {
        name: 'description',
        content: 'My drive.'
      }
    ]
  },

  data: () => ({
    infoFile: false,
    infoFolder: false,
    sidebarOpen: true,
    showDialogCreateFolder: false,
    showDialogFolderInfo: false,
    showDialogRenameFolder: false,
    showDialogFileInfo: false,
    keyboardShortcutMap: {}
  }),

  components: {
    File,
    Folder,
    FolderTree,
    ExplorerToolbar,
    DialogCreateFolder,
    DialogFolderInfo,
    DialogFileInfo,
    DialogRenameFile,
    DialogRenameFolder,
    Dropzone
  },

  computed: {
    ...driveComputed,
    ...userComputed
  },

  methods: {
    ...driveMethods,

    setShowDialogCreateFolder (value) {
      this.showDialogCreateFolder = value;
    },

    setShowDialogFolderInfo (value) {
      this.showDialogFolderInfo = value;
    },

    setShowDialogRenameFolder (value) {
      this.showDialogRenameFolder = value;
    },

    setShowInfoFolder (value) {
      this.infoFolder = value;
    },

    setShowDialogFileInfo (value) {
      this.showDialogFileInfo = value;
    },

    setShowInfoFile (value) {
      this.infoFile = value;
    },

    openNewFolder: function (folderId, force = false) {
      this.fetchFolder({
        folderId: folderId,
        force: force
      }).then(response => {
        if (window.innerWidth < 600) {
          this.sidebarOpen = false;
        }
      });
    },

    toggleSidebar () {
      this.sidebarOpen = !this.sidebarOpen;
    },

    checkKeyboardShortcuts: function (e) {
      this.keyboardShortcutMap[e.keyCode] = e.type === 'keydown';

      // Show upload file dialog
      // Shift + f
      if (this.keyboardShortcutMap[16] && this.keyboardShortcutMap[70]) {
        this.$store.commit('drive/SET_SHOW_DROPZONE', true);
      }

      // Show create folder dialog
      // Shift + n
      if (this.keyboardShortcutMap[16] && this.keyboardShortcutMap[78]) {
        this.setShowDialogCreateFolder(true);
      }

      // Close file dialog
      // Esc
      if (this.keyboardShortcutMap[27]) {
        this.$store.commit('drive/SET_SHOW_DROPZONE', false);
      }
    }
  },

  created () {
    if (!this.openFolder && this.user) {
      this.openNewFolder(this.user.folder_id);
    }

    // Init keyboard shortcut listeners
    window.onkeydown = window.onkeyup = this.checkKeyboardShortcuts;
  },

  destroyed () {
    // Destroy keyboard shortcut listeners
    window.onkeydown = window.onkeyup = null;
  }
};
</script>

<style>
.sidebar > .folder-tree {
  height: calc(100% - 77px);
  overflow-y: auto;
  overflow-x: hidden;
}
.sidebar > .folder-tree > li {
  border-left: 0 !important;
}

</style>

<style lang="scss" scoped>
.drive {
  height: 100%;
}

.drive-container {
  position: relative;
  display: flex;
  height: 100%;
  align-items: stretch;
  align-content: stretch;

  .sidebar, .explorer {
    height: calc(100vh - 164px);
    transition: all 0.3s ease-in-out;
  }

  .sidebar {
    width: 350px;
    left: -100%;
    padding: 8px;
    overflow-x: hidden;
    position: absolute;
    background: #fafafa;
    // border-right: 1px solid;
    // border-color: #e0e0e0;

    > .folder-tree {
      margin-left: 0;
      padding-left: 0;
    }
  }

  .explorer {
    width: 100%;
    position: absolute;
    overflow: auto;
    left: 0;

    .container {
      height: 100%;
      padding: 0 8px 8px;
    }

    .explorer-title {
      margin: 14px 12px;
    }
  }
}

.drive-storage {
  position: absolute;
  bottom: 8px;
  left: 8px;
  width: calc(100% - 16px);
}

.drive-container.sidebar-open {
  .explorer {
    width: calc(100% - 350px);
    left:  350px;
  }
  .sidebar {
    left: 0;
  }
}

.v-toolbar {
  background-color: transparent;
}

.theme--dark {
  .sidebar {
    background: #303030;
    // border-color: #595959;
  }
}

@media (max-width: 959px) and (min-width: 751px) {
  .drive-container {
    .sidebar, .explorer {
      height: calc(100vh - 132px);
    }
  }
}

@media (max-width: 750px) {
  .drive-container {
    .sidebar, .explorer {
      height: calc(100vh - 148px);
    }
  }
}

@media (max-width: 599px) {
  .drive-container {
    .sidebar {
      width: 100%;
      left: 0;
      bottom: -100%;
      z-index: 2;
    }

    .explorer {
      width: 100% !important;
      left: 0 !important;

      .container {
        padding: 0;
      }
    }
  }

  .drive-container.sidebar-open {
    .explorer {
      width: 100%;
    }

    .sidebar {
      bottom: 60px;
    }
  }
}
</style>
