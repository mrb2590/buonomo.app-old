<template>
  <v-dialog
    class="info-dialog"
    v-model="$parent.showDialogFolderInfo"
    max-width="290"
    :fullscreen="$store.state.app.dialogFullscreen"
    scrollable
  >
    <v-card>
      <v-card-title class="headline">
        <v-avatar
          :size="100"
          color="primary"
        >
          <v-icon :size="60" dark>folder</v-icon>
        </v-avatar>
      </v-card-title>

      <v-card-title class="headline" v-if="folder">{{ folder.name }}</v-card-title>

      <v-card-text class="folder-info" v-if="folder">
        <ul>
          <li>Size: {{ folder.formatted_size }}</li>
          <li>Owner: {{ folder.owned_by.first_name }} {{ folder.owned_by.last_name }}</li>
        </ul>
        <div>
          {{ folder.owned_by.first_name }} {{ folder.owned_by.last_name }} created this folder on {{ moment(folder.created_at).format('MMMM Do, YYYY') }}
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          flat="flat"
          @click="$emit('showDialogFolderInfo', false)"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from 'moment'

export default {
  name: 'DialogFolderInfo',

  props: [ 'folder', 'showDialogFolderInfo' ],

  methods: {
    moment
  }
}
</script>

<style lang="scss" >
.v-dialog {
  .v-avatar {
    margin: 0 auto;
  }

  .v-card__title {
    text-align: center;
    justify-content: center;
    word-break: break-all;
  }

  .folder-info {
    height: 100%;

    ul {
      list-style: none;
      padding-left: 0;

      > li {
        margin-bottom: 8px;
      }
    }
  }
}
</style>
