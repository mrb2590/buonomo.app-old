<template>
  <div class="file">
    <div class="ficon">
      <v-avatar color="accent">
        <v-icon dark>insert_drive_file</v-icon>
      </v-avatar>
    </div>
    <div class="ftext">
      <div class="subheading" :title="file.display_filename">{{ file.display_filename }}</div>
      <div class="caption">{{ file.size_readable }}</div>
    </div>
    <div class="fbtn">
      <v-menu
        bottom
        left
        origin="top right"
        transition="scale-transition"
        min-width="150"
        @click.native.stop
      >
        <v-btn
          slot="activator"
          icon
        >
          <v-icon>more_vert</v-icon>
        </v-btn>

        <v-list>
          <v-list-tile @click="setShowDialogFileInfo">
            <v-list-tile-title>Info</v-list-tile-title>
            <v-icon>info</v-icon>
          </v-list-tile>

          <v-list-tile @click="downloadFile(file)">
            <v-list-tile-title>Download</v-list-tile-title>
            <v-icon>cloud_download</v-icon>
          </v-list-tile>

          <v-list-tile>
            <v-list-tile-title>Move to</v-list-tile-title>
            <v-icon>folder_open</v-icon>
          </v-list-tile>

          <v-list-tile>
            <v-list-tile-title>Share</v-list-tile-title>
            <v-icon>share</v-icon>
          </v-list-tile>

          <v-list-tile>
            <v-list-tile-title>Trash</v-list-tile-title>
            <v-icon>delete</v-icon>
          </v-list-tile>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<script>
import { driveMethods } from '../../state/helpers'

export default {
  name: 'Folder',

  props: [ 'file' ],

  data () {
    return {
      showDialogFileInfo: false
    }
  },

  methods: {
    ...driveMethods,

    setShowDialogFileInfo () {
      this.$emit('showInfoFile', this.file)
      this.$emit('showDialogFileInfo', true)
    }
  }
}
</script>

<style lang="scss" scoped>
.file {
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  width: calc(100% - 12px);
  margin: 6px;
  padding: 6px;
  border-radius: 30px;
  border: 1px solid #e0e0e0;
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
      white-space: nowrap;
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

.theme--dark .file {
  border: 1px solid #595959;
}

@media (max-width: 599px) {
  .file {
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
