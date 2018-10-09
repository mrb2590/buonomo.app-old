<template>
  <div class="drive">
    <v-toolbar flat transparent elevation="0" v-if="openFolder">
      <v-btn-toggle>
        <v-btn flat @click="sidebarOpen = !sidebarOpen"><v-icon>list</v-icon></v-btn>
      </v-btn-toggle>
      <v-toolbar-title v-if="openFolder">{{ openFolder.name }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn-toggle>
        <v-btn flat>
          <v-icon>chevron_left</v-icon>
        </v-btn>
        <v-btn flat>
          <v-icon>chevron_right</v-icon>
        </v-btn>
        <v-btn flat
          @click="upFolder()"
          :disabled="!openFolder.parent_id"
        >
          <v-icon>expand_less</v-icon>
        </v-btn>
        <v-btn flat
          @click="openNewFolder(openFolder.id, true)"
        >
          <v-icon>refresh</v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-toolbar>
    <div class="drive-container" :class="{ 'sidebar-open': sidebarOpen }">
      <div class="sidebar">
        <ul class="folder-tree">
          <FolderTree v-if="tree" :folder="tree" :openFolder="openNewFolder"></FolderTree>
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
              />
            </v-flex>
            <v-flex xs12 sm12 md6 lg4 xl3
              v-for="(file, index) in openFolder.files"
              v-bind:key="`file-${index}`"
            >
              <File
                :file="file"
              />
            </v-flex>
          </v-layout>
        </v-container>
      </div>
    </div>
  </div>
</template>

<script>
import File from '../components/File'
import Folder from '../components/Folder'
import FolderTree from '../components/FolderTree'
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
    sidebarOpen: true
  }),

  components: { File, Folder, FolderTree },

  computed: {
    ...driveComputed,
    ...userComputed
  },

  methods: {
    ...driveMethods,

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

    upFolder: function () {
      if (this.openFolder.parent_id) {
        this.openNewFolder(this.openFolder.parent_id)
      }
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

  .sidebar {
    transition: left 0.3s ease-in-out;
    width: 300px;
    left: -100%;
    padding: 8px;
    overflow: auto;
    height: calc(100vh - 164px);
    position: absolute;
    background: #fafafa;
    // border-right: 1px solid #e0e0e0;

    > .folder-tree {
      margin-left: 0;
      padding-left: 0;
    }
  }

  .explorer {
    transition: left 0.3s ease-in-out;
    width: 100%;
    position: absolute;
    overflow: auto;
    left: 0;
    height: 100%;

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
    // border-right: 1px solid #595959;
  }
}

@media (max-width: 959px) and (min-width: 600px) {
  .drive-container {
    .sidebar {
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
      height: calc(100vh - 148px);
      width: 100%;
      z-index: 2;
    }
  }
}
</style>
