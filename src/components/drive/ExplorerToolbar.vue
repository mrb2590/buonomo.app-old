<template>
  <div class="explorer-toolbar">
    <v-toolbar flat transparent elevation="0">
      <v-toolbar-title v-if="folder" :title="folder.name">{{ folder.name }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn-toggle class="elevation-2">
        <v-btn flat>
          <v-icon>chevron_left</v-icon>
        </v-btn>
        <v-btn flat>
          <v-icon>chevron_right</v-icon>
        </v-btn>
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
    }
  },

  methods: {
    upFolder: function () {
      if (this.folder.folder_id) {
        this.openNewFolder(this.folder.folder_id)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.v-toolbar {
  background-color: transparent;
}
.theme--dark.v-toolbar {
  background-color: transparent;
}
</style>
