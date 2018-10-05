<template>
  <ul class="folder-tree">
    <li v-if="folder">
      <v-btn class="expand-btn" small icon @click="expandFolder">
        <v-icon :class="{ expanded: isExpanded }">chevron_right</v-icon>
      </v-btn>

      <div @click="open(folder.id)">
        <v-icon v-if="$store.state.drive.openFolder.id === folder.id">folder_open</v-icon>
        <v-icon v-if="$store.state.drive.openFolder.id !== folder.id">folder</v-icon>
        {{ folder.name }}
      </div>

      <FolderTree
        v-for="(childFolder, index) in folder.children"
        :folder="childFolder"
        :openFolder="openFolder"
        v-bind:key="index"
        v-show="isExpanded"
      >
      </FolderTree>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'FolderTree',

  props: [ 'folder', 'openFolder' ],

  data () {
    return {
      isExpanded: false
    }
  },

  methods: {
    open (folderId) {
      this.isExpanded = true
      this.openFolder(folderId)
    },

    expandFolder () {
      this.$store.dispatch('drive/fetchFolder', {
        folderId: this.folder.id,
        setCurrent: false
      })
      this.isExpanded = !this.isExpanded
    }
  }
}
</script>

<style lang="scss" scoped>
ul {
  list-style: none;

  > li {
    white-space: nowrap;

    > div {
      display: inline;
      cursor: pointer;
    }
  }
}
.v-icon.expanded {
  transform: rotate(90deg);
}
</style>
