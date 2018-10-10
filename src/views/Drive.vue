<template>
  <div class="drive">
    <ExplorerToolbar
      :folder="openFolder"
      :openNewFolder="openNewFolder"
      @toggleSidebar="toggleSidebar()"
    />
    <CreateFolderDialog @showCreateFolderDialog="setShowCreateFolderDialog"/>
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
        <v-container fluid>
          <v-layout row wrap v-if="openFolder">
            <v-flex xs12 sm12 md6 lg4 xl3
              v-for="(childFolder, index) in openFolder.children"
              v-bind:key="`folder-${index}`"
            >
              <Folder
                :folder="childFolder"
                :openNewFolder="openNewFolder"
                @showInfoDialog="setShowInfoDialog"
                @showInfoFolder="setShowInfoFolder"
              />
            </v-flex>
            <v-flex xs12 sm12 md6 lg4 xl3
              v-for="(file, index) in openFolder.files"
              v-bind:key="`file-${index}`"
            >
              <File :file="file"/>
            </v-flex>
          </v-layout>
        </v-container>
      </div>
    </div>

    <ExplorerSpeedDial
      :folder="openFolder"
      @showCreateFolderDialog="setShowCreateFolderDialog"
    />

    <InfoDialog :folder="infoFolder" @showInfoDialog="setShowInfoDialog"/>
  </div>
</template>

<script>
import File from '../components/drive/File'
import Folder from '../components/drive/Folder'
import FolderTree from '../components/drive/FolderTree'
import FolderBreadcrumb from '../components/drive/FolderBreadcrumb'
import ExplorerToolbar from '../components/drive/ExplorerToolbar'
import ExplorerSpeedDial from '../components/drive/ExplorerSpeedDial'
import CreateFolderDialog from '../components/drive/CreateFolderDialog'
import InfoDialog from '../components/drive/InfoDialog'
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
    sidebarOpen: true,
    showCreateFolderDialog: false,
    showInfoDialog: false,
    infoFolder: false
  }),

  components: {
    File,
    Folder,
    FolderTree,
    FolderBreadcrumb,
    ExplorerToolbar,
    ExplorerSpeedDial,
    CreateFolderDialog,
    InfoDialog
  },

  computed: {
    ...driveComputed,
    ...userComputed
  },

  methods: {
    ...driveMethods,

    setShowCreateFolderDialog (value) {
      this.showCreateFolderDialog = value
    },

    setShowInfoDialog (value) {
      this.showInfoDialog = value
    },

    setShowInfoFolder (value) {
      this.infoFolder = value
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
    if (!this.openFolder) {
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
    width: 300px;
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
      padding: 0 8px 8px;
    }
  }
}

.drive-container.sidebar-open {
  .explorer {
    width: calc(100% - 300px);
    left:  300px;
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

@media (max-width: 959px) {
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
