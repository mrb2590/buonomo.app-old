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
            @click="showInfoDialog = true"
          >
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile>
        </v-list>
      </v-menu>
    </div>

    <v-dialog
      v-model="showInfoDialog"
      max-width="290"
      :fullscreen="dialogFullscreen"
    >
      <v-card>
        <v-card-title class="headline">
          <v-avatar
            :size="100"
            color="primary"
          >
            <v-icon :size="80">folder</v-icon>
          </v-avatar>
        </v-card-title>

        <v-card-title class="headline">
        {{ folder.name }}</v-card-title>

        <v-card-text class="folder-info">
          <ul>
            <li>Size: 100 MB</li>
            <li>Owner: {{ folder.owned_by.first_name }} {{ folder.owned_by.last_name }}</li>
          </ul>
          <p>{{ folder.owned_by.first_name }} {{ folder.owned_by.last_name }} creeated this folder on {{ moment(folder.created_at).format('MMMM Do, YYYY') }}</p>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            flat="flat"
            @click="showInfoDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { driveComputed, driveMethods } from '../state/helpers'

export default {
  name: 'Folder',

  props: [ 'folder', 'openNewFolder' ],

  data: () => ({
    showInfoDialog: false,
    dialogFullscreen: false,
    items: [
      { title: 'Info', icon: 'info', click: function () { this.showInfoDialog = true } },
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
    ...driveMethods,
    moment,

    setFullScreenDialogOption () {
      if (window.innerWidth < 600) {
        this.dialogFullscreen = true
      } else {
        this.dialogFullscreen = false
      }
    }
  },

  created () {
    this.setFullScreenDialogOption()

    window.onresize = () => {
      this.setFullScreenDialogOption()
    }
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

    .subheading {
      overflow: hidden;
      text-overflow: ellipsis;
    }
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

.v-dialog {
  .v-avatar {
    margin: 0 auto;
  }

  .v-card__title {
    text-align: center;
  }

  .folder-info {
    ul {
      list-style: none;
      padding-left: 0;

      > li {
        margin-bottom: 8px;
      }
    }
  }
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
