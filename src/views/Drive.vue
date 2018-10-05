<template>
  <div class="drive">
    <div class="drive-container">
      <div class="sidebar" :class="{ open: sidebarOpen }">
        <FolderTree v-if="tree" :folder="tree" :openFolder="openNewFolder"></FolderTree>
      </div>
      <div class="explorer">
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
        <v-container>
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
    sidebarOpen: false
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
        //
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

<style lang="scss" scoped>
.drive {
  height: 100%;
}
.drive-container {
  display: flex;
  height: 100%;
  align-items: stretch;
  align-content: stretch;
}
.sidebar {
  width: 300px;
  padding: 8px;
  overflow: auto;
  height: calc(100vh - 100px);

  > .folder-tree {
    padding-left: 0;
  }
}
.explorer {
  width: calc(100% - 300px);

  .container {
    padding: 0 8px 8px;
  }

  .v-toolbar {
    background-color: transparent;
  }
}

@media (max-width: 599px) {
  .sidebar {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    z-index: 10;
    background-color: inherit;
  }
  .sidebar.open {
    left: 0;
  }
  .explorer {
    width: 100%;

    .container {
      padding: 0;
    }
  }
}
</style>
