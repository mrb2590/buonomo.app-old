<template>
  <v-speed-dial class="explorer-speed-dial"
    v-model="speedDial"
    :bottom="true"
    :right="true"
    transition="slide-y-reverse-transition"
    absolute
  >
    <v-btn
      slot="activator"
      v-model="speedDial"
      color="accent"
      dark
      fab
      title="Folder Options"
    >
      <v-icon medium>folder_open</v-icon>
      <v-icon medium>close</v-icon>
    </v-btn>

    <v-btn
      fab
      dark
      small
      color="teal"
      @click="$store.commit('drive/SET_SHOW_DROPZONE', true)"
      title="Upload Files"
    >
      <v-icon>cloud_upload</v-icon>
    </v-btn>

    <v-btn
      fab
      dark
      small
      color="cyan"
      @click="$emit('showDialogRenameFolder', true)"
      title="Rename Folder"
    >
      <v-icon>create</v-icon>
    </v-btn>

    <v-btn
      fab
      dark
      small
      color="green"
      @click="$emit('showDialogCreateFolder', true)"
      title="Create Folder"
    >
      <v-icon>create_new_folder</v-icon>
    </v-btn>

    <v-btn
      fab
      dark
      small
      color="indigo"
      @click="$emit('downloadFolder')"
      title="Download Folder"
    >
      <v-icon>cloud_download</v-icon>
    </v-btn>

    <v-btn
      fab
      dark
      small
      color="purple"
      @click="$emit('showDialogFolderInfo')"
      title="Folder Info"
    >
      <v-icon>info</v-icon>
    </v-btn>

    <v-btn
      fab
      dark
      small
      color="red"
      @click="$emit('trashFolder')"
      title="Trash Folder"
    >
      <v-icon>delete</v-icon>
    </v-btn>
  </v-speed-dial>
</template>

<script>
export default {
  name: 'ExplorerSpeedDial',

  props: [ 'folder' ],

  data () {
    return {
      speedDial: false
    };
  }
};
</script>

<style lang="scss" scoped>
  .v-speed-dial {
    bottom: -16px;
    transform: none;
    right: 16px;

    .v-btn__content > i {
      top: -14px !important;
    }
  }
</style>
