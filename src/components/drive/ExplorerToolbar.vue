<template>
  <div class="explorer-toolbar">
    <v-toolbar flat transparent elevation="0">
      <v-toolbar-title v-if="folder" :title="folder.name">{{ folder.name }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn-toggle class="elevation-2">
        <v-btn
          flat
          v-if="folder"
          @click="upFolder()"
          :disabled="!folder.folder_id"
        >
          <v-icon>expand_less</v-icon>
        </v-btn>
        <v-btn
          flat
          v-if="folder"
          @click="openNewFolder(folder.id, true)"
        >
          <v-icon>refresh</v-icon>
        </v-btn>
        <v-btn
          flat
          @click="$emit('toggleSidebar')"
        >
          <v-icon>list</v-icon>
        </v-btn>

        <v-menu
          bottom
          left
          origin="top right"
          transition="scale-transition"
          min-width="150"
          @click.native.stop
        >
          <v-btn flat slot="activator">
            <v-icon>more_vert</v-icon>
          </v-btn>

          <v-list>
            <v-list-tile @click="$store.commit('drive/SET_SHOW_DROPZONE', true)">
              <v-list-tile-title>Upload</v-list-tile-title>
              <v-icon>cloud_upload</v-icon>
            </v-list-tile>

            <v-list-tile @click="$emit('showDialogCreateFolder', true)">
              <v-list-tile-title>New</v-list-tile-title>
              <v-icon>create_new_folder</v-icon>
            </v-list-tile>

            <v-list-tile @click="$emit('showDialogFolderInfo')">
              <v-list-tile-title>Info</v-list-tile-title>
              <v-icon>info</v-icon>
            </v-list-tile>

            <v-list-tile @click="$emit('downloadFolder')">
              <v-list-tile-title>Download</v-list-tile-title>
              <v-icon>cloud_download</v-icon>
            </v-list-tile>

            <v-list-tile @click="$emit('showDialogRenameFolder', true)">
              <v-list-tile-title>Rename</v-list-tile-title>
              <v-icon>create</v-icon>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-title>Move</v-list-tile-title>
              <v-icon>trending_flat</v-icon>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-title>Share</v-list-tile-title>
              <v-icon>share</v-icon>
            </v-list-tile>

            <v-list-tile @click="$emit('trashFolder')">
              <v-list-tile-title>Trash</v-list-tile-title>
              <v-icon>delete</v-icon>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-btn-toggle>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  name: 'ExplorerToolbar',

  props: [ 'folder', 'openNewFolder', 'sidebarOpen' ],

  data () {
    return {
      breadcrumb: []
    };
  },

  methods: {
    upFolder: function () {
      if (this.folder.folder_id) {
        this.openNewFolder(this.folder.folder_id);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.v-toolbar {
  background-color: transparent;
}
.theme--dark.v-toolbar {
  background-color: transparent;
}
</style>
