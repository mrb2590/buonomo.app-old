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
    >
      <v-icon medium>folder</v-icon>
      <v-icon medium>close</v-icon>
    </v-btn>

    <v-btn
      fab
      dark
      small
      color="accent"
      @click="$emit('downloadFolder')"
    >
      <v-icon>cloud_download</v-icon>
    </v-btn>

    <v-btn fab dark small color="accent">
      <v-icon>cloud_upload</v-icon>
    </v-btn>

    <v-btn
      fab
      dark
      small
      color="accent"
      @click="$emit('showDialogRenameFolder', true)"
    >
      <v-icon>create</v-icon>
    </v-btn>

    <v-btn
      fab
      dark
      small
      color="accent"
      @click="$emit('showDialogCreateFolder', true)"
    >
      <v-icon>create_new_folder</v-icon>
    </v-btn>

    <v-btn
      fab
      dark
      small
      color="accent"
      @click="$emit('showDialogFolderInfo')"
    >
      <v-icon>info</v-icon>
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .v-speed-dial {
    bottom: -16px;
    transform: none;
    right: 24px;

    .v-btn__content > i {
      top: -14px !important;
    }
  }
</style>
