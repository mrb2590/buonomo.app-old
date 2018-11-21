<template>
  <v-dialog
    class="dialog-file-info"
    v-model="$parent.showDialogFileInfo"
    max-width="350"
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

      <v-card-title class="headline" v-if="file">{{ file.name }}</v-card-title>

      <v-card-text class="file-info" v-if="file">
        <div class="subheading font-weight-bold">Type</div>
        <div class="body-1">{{ file.extension }}</div>

        <div class="subheading font-weight-bold">Size</div>
        <div class="body-1">{{ file.formatted_size }}</div>

        <div class="subheading font-weight-bold">Path</div>
        <div class="body-1">{{ file.path }}</div>

        <div class="subheading font-weight-bold">Owned by</div>
        <div class="body-1">{{ file.owned_by.first_name }} {{ file.owned_by.last_name }}</div>

        <div class="subheading font-weight-bold">Uploaded by</div>
        <div class="body-1">{{ file.created_by.first_name }} {{ file.created_by.last_name }}</div>

        <div class="subheading font-weight-bold">Uploaded on</div>
        <div class="body-1">{{ moment(file.created_at*1000).format('MMMM Do, YYYY h:M A') }}</div>

        <div class="subheading font-weight-bold">Last updated by</div>
        <div class="body-1">{{ file.updated_by.first_name }} {{ file.updated_by.last_name }}</div>

        <div class="subheading font-weight-bold">Last updated on</div>
        <div class="body-1">{{ moment(file.updated_at*1000).format('MMMM Do, YYYY h:M A') }}</div>
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
import moment from 'moment';

export default {
  name: 'DialogFileInfo',

  props: [ 'file', 'showDialogFileInfo' ],

  methods: {
    moment
  }
};
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

  .file-info {
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
    .file-info {
      max-height: 100%;
    }
  }
}
</style>
