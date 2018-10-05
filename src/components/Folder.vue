<template>
  <div class="folder" @dblclick="openNewFolder(folder.id, true, true)">
    <div class="ficon">
      <v-avatar color="primary">
        <v-icon dark>folder</v-icon>
      </v-avatar>
    </div>
    <div class="ftext">
      <div class="subheading">{{ folder.name }}</div>
      <div class="caption">100 MB</div>
    </div>
    <div class="fbtn">
      <v-menu
        bottom
        left
        origin="top right"
        transition="scale-transition"
        min-width="150"
      >
        <v-btn
          slot="activator"
          icon
        >
          <v-icon>more_vert</v-icon>
        </v-btn>

        <v-list>
          <v-list-tile
            v-for="(item, i) in items"
            :key="i"
            @click="() => {}"
          >
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<script>
import { driveComputed, driveMethods } from '../state/helpers'

export default {
  name: 'Folder',

  props: [ 'folder', 'openNewFolder' ],

  data: () => ({
    items: [
      { title: 'Download', icon: 'cloud_download' },
      { title: 'Move to', icon: 'folder_open' },
      { title: 'Share', icon: 'share' },
      { title: 'Trash', icon: 'delete' }
    ]
  }),

  computed: {
    ...driveComputed
  },

  methods: {
    ...driveMethods
  }
}
</script>

<style lang="scss" scoped>
.folder {
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  width: calc(100% - 12px);
  margin: 6px;
  padding: 6px;
  border-radius: 30px;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  overflow: hidden;

  .ficon {
    height: 100%;
    width: 48px;
  }
  .ftext {
    height: 100%;
    width: calc(100% - 84px);
    overflow: hidden;
    padding-left: 8px;
    padding-right: 4px;
  }
  .fbtn {
    height: 100%;
    width: 36px;

    .v-btn {
      margin-left: 0;
      margin-right: 0;
    }
  }
}
.theme--dark .folder {
  border: 1px solid #595959;
}

@media (max-width: 599px) {
  .folder {
    width: 100%;
    margin: 0;
    border-left: none !important;
    border-right: none !important;
    border-bottom: none !important;
    padding-top: 12px;
    padding-bottom: 12px;
    padding-left: 16px;
    padding-right: 16px;
    border-radius: 0;
  }
}
</style>
