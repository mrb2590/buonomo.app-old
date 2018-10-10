<template>
  <v-dialog
    class="info-dialog"
    v-model="$parent.showDialogFileInfo"
    max-width="290"
    :fullscreen="$store.state.app.dialogFullscreen"
    scrollable
  >
    <v-card>
      <v-card-title class="headline">
        <v-avatar
          :size="100"
          color="accent"
        >
          <v-icon :size="60" dark>insert_drive_file</v-icon>
        </v-avatar>
      </v-card-title>

      <v-card-title class="headline" v-if="file">{{ file.display_filename }}</v-card-title>

      <v-card-text class="file-info" v-if="file">
        <ul>
          <li>Size: {{ file.size_readable }}</li>
          <li>Owner: {{ file.owned_by.first_name }} {{ file.owned_by.last_name }}</li>
        </ul>
        <div>
          {{ file.owned_by.first_name }} {{ file.owned_by.last_name }} created this file on {{ moment(file.created_at).format('MMMM Do, YYYY') }}
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          flat="flat"
          @click="$emit('showDialogFileInfo', false)"
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
  name: 'DialogFileInfo',

  props: [ 'file', 'showDialogFileInfo' ],

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
  }

  .file-info {
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
