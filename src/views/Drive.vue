<template>
  <div class="drive">
    <ExplorerToolbar
      :folder="openFolder"
      :openNewFolder="openNewFolder"
      @toggleSidebar="toggleSidebar()"
    />

    <!-- <FolderBreadcrumb :folder="openFolder"/> -->
    <div class="drive-container" :class="{ 'sidebar-open': sidebarOpen }">
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
              <v-flex xs12 sm12 md6 lg4 xl3
                v-for="(childFolder, index) in openFolder.children"
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

    <ExplorerSpeedDial
      :folder="openFolder"
      @downloadFolder="downloadFolder(openFolder.id)"
      @showDialogFolderInfo="setShowDialogFolderInfo(true); infoFolder = openFolder"
      @showDialogCreateFolder="setShowDialogCreateFolder"
      @showDialogRenameFolder="setShowDialogRenameFolder(true); infoFolder = openFolder"
      @trashFolder="trashFolder(openFolder)"
    />

    <DialogRenameFolder :folder="infoFolder" @showDialogRenameFolder="setShowDialogRenameFolder"/>
    <DialogCreateFolder @showDialogCreateFolder="setShowDialogCreateFolder"/>
    <DialogFolderInfo :folder="infoFolder" @showDialogFolderInfo="setShowDialogFolderInfo"/>
    <DialogFileInfo :file="infoFile" @showDialogFileInfo="setShowDialogFileInfo"/>
  </div>
</template>

<script>
import DialogCreateFolder from '../components/drive/DialogCreateFolder'
import DialogFileInfo from '../components/drive/DialogFileInfo'
import DialogFolderInfo from '../components/drive/DialogFolderInfo'
import DialogRenameFolder from '../components/drive/DialogRenameFolder'
import ExplorerSpeedDial from '../components/drive/ExplorerSpeedDial'
import ExplorerToolbar from '../components/drive/ExplorerToolbar'
import File from '../components/drive/File'
import Folder from '../components/drive/Folder'
import FolderBreadcrumb from '../components/drive/FolderBreadcrumb'
import FolderTree from '../components/drive/FolderTree'
import { userComputed, driveComputed, driveMethods } from '../state/helpers'

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
    showDialogFileInfo: false
  }),

  components: {
    File,
    Folder,
    FolderTree,
    FolderBreadcrumb,
    ExplorerToolbar,
    ExplorerSpeedDial,
    DialogCreateFolder,
    DialogFolderInfo,
    DialogFileInfo,
    DialogRenameFolder
  },

  computed: {
    ...driveComputed,
    ...userComputed
  },

  methods: {
    ...driveMethods,

    setShowDialogCreateFolder (value) {
      this.showDialogCreateFolder = value
    },

    setShowDialogFolderInfo (value) {
      this.showDialogFolderInfo = value
    },

    setShowDialogRenameFolder (value) {
      this.showDialogRenameFolder = value
    },

    setShowInfoFolder (value) {
      this.infoFolder = value
    },

    setShowDialogFileInfo (value) {
      this.showDialogFileInfo = value
    },

    setShowInfoFile (value) {
      this.infoFile = value
    },

    openNewFolder: function (folderId, force = false) {
      this.fetchFolder({
        folderId: folderId,
        force: force
      }).then(response => {
        if (window.innerWidth < 600) {
          this.sidebarOpen = false
        }
      })
    },

    toggleSidebar () {
      this.sidebarOpen = !this.sidebarOpen
    }
  },

  created () {
    if (!this.openFolder && this.user) {
      this.openNewFolder(this.user.folder_id)
    }
  }
}
</script>

<style>
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
  }

  .sidebar {
    transition: left 0.3s ease-in-out;
    width: 350px;
    left: -100%;
    padding: 8px;
    overflow: auto;
    position: absolute;
    background: #fafafa;
    border-right: 1px solid #e0e0e0;

    > .folder-tree {
      margin-left: 0;
      padding-left: 0;
    }
  }

  .explorer {
    transition: all 0.3s ease-in-out;
    width: 100%;
    position: absolute;
    overflow: auto;
    left: 0;

    .container {
      height: 100%;
      padding: 0 8px 8px;
    }
  }
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
    border-right: 1px solid #595959;
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
    .explorer {
      width: 100% !important;
      left: 0 !important;

      .container {
        padding: 0;
      }
    }

    .sidebar {
      width: 100%;
      z-index: 2;
    }
  }
}
</style>
