<template>
  <v-dialog
    class="info-dialog"
    v-model="$parent.showDialogFolderInfo"
    max-width="350"
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
        <div class="subheading font-weight-bold">Type</div>
        <div class="body-1">folder</div>

        <div class="subheading font-weight-bold">Size</div>
        <div class="body-1">{{ folder.formatted_size }}</div>

        <div class="subheading font-weight-bold">Path</div>
        <div class="body-1">{{ folder.path }}</div>

        <div class="subheading font-weight-bold">Owned by</div>
        <div class="body-1">{{ folder.owned_by.first_name }} {{ folder.owned_by.last_name }}</div>

        <div class="subheading font-weight-bold">Created by</div>
        <div class="body-1">{{ folder.created_by.first_name }} {{ folder.created_by.last_name }}</div>

        <div class="subheading font-weight-bold">Created on</div>
        <div class="body-1">{{ moment(folder.created_at*1000).format('MMMM Do, YYYY h:m a') }}</div>

        <div class="subheading font-weight-bold">Last updated by</div>
        <div class="body-1">{{ folder.updated_by.first_name }} {{ folder.updated_by.last_name }}</div>

        <div class="subheading font-weight-bold">Last updated on</div>
        <div class="body-1">{{ moment(folder.updated_at*1000).format('MMMM Do, YYYY h:m a') }}</div>
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
    max-height: 200px;

    > .subheading {
      margin-bottom: 2px;
    }

    > .body-1:not(:last-child) {
      margin-bottom: 14px;
      word-break: break-all;
    }

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
  .v-dialog {
    .folder-info {
      max-height: 100%;
    }
  }
}
</style>
