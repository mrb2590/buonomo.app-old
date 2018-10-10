<template>
  <li class="folder-tree-item">
    <v-btn class="expand-btn" small icon @click="expandFolder">
      <v-icon :class="{ expanded: isExpanded }">chevron_right</v-icon>
    </v-btn>

    <div @click="open(folder.id)">
      <v-icon v-if="$store.state.drive.openFolder.id === folder.id">folder_open</v-icon>
      <v-icon v-if="$store.state.drive.openFolder.id !== folder.id">folder</v-icon>
      {{ folder.name }}
      <v-progress-circular
        indeterminate
        :size="16"
        :width="2"
        color="primary"
        v-if="expanding"
      ></v-progress-circular>
    </div>

    <ul class="folder-tree">
      <transition-group name="slide-in-out" mode="out-in">
        <FolderTree
          v-for="(childFolder, index) in folder.children"
          :folder="childFolder"
          :openFolder="openFolder"
          v-bind:key="index"
          v-show="isExpanded"
          :startExpanded="false"
        >
        </FolderTree>
      </transition-group>
    </ul>
  </li>
</template>

<script>
export default {
  name: 'FolderTree',

  props: [ 'folder', 'openFolder', 'startExpanded' ],

  data () {
    return {
      expanding: false,
      isExpanded: this.startExpanded
    }
  },

  methods: {
    open (folderId) {
      this.isExpanded = true
      this.openFolder(folderId)
    },

    expandFolder () {
      setTimeout(() => {
        this.expanding = true
      }, 200)
      this.$store.dispatch('drive/fetchFolder', {
        folderId: this.folder.id,
        setCurrent: false
      }).then(() => {
        this.expanding = false
        // Make sure it gets set to false
        setTimeout(() => {
          this.expanding = false
        }, 200)
      })
      this.isExpanded = !this.isExpanded
    }
  }
}
</script>

<style lang="scss" scoped>
ul {
  list-style: none;

  li {
    white-space: nowrap;
    border-left: 1px solid #e0e0e0;

    > div {
      display: inline;
      cursor: pointer;
      vertical-align: sub;

      > .v-progress-circular {
        margin-left: 10px;
        top: -4px;
      }
    }
  }
}
.theme--dark ul > li {
  border-left: 1px solid #595959;
}
.v-icon.expanded {
  transform: rotate(90deg);
}
</style>
