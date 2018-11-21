<template>
  <li class="folder-tree-item">
    <v-btn
      class="expand-btn"
      small
      icon
      @click="toggleExpanded"
      :title="folder.name"
      :disabled="$store.state.drive.openFolder.id === folder.id"
    >
      <v-icon :class="{ expanded: isExpanded }">chevron_right</v-icon>
    </v-btn>

    <div
      :class="{ 'no-pointer': $store.state.drive.openFolder.id === folder.id }"
      @click="$store.state.drive.openFolder.id !== folder.id ? open(folder.id) : false"
      :title="folder.name"
    >
      <v-icon v-html="$store.state.drive.openFolder.id === folder.id ? 'folder_open' : 'folder'"></v-icon>

      <span class="folder-name">{{ folder.name }}</span>

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
          v-for="(childFolder, index) in folder.folders"
          :folder="childFolder"
          :openFolder="openFolder"
          v-bind:key="index"
          v-show="checkIfExpanded()"
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
    };
  },

  methods: {
    open (folderId) {
      this.isExpanded = true;
      this.openFolder(folderId);
    },

    toggleExpanded () {
      if (this.isExpanded) {
        this.isExpanded = false;
        return;
      }

      setTimeout(() => {
        this.expanding = true;
      }, 200);

      this.$store.dispatch('drive/fetchFolder', {
        folderId: this.folder.id,
        setCurrent: false,
        expanding: true
      }).then(() => {
        this.expanding = false;
        // Make sure it gets set to false
        setTimeout(() => {
          this.expanding = false;
        }, 200);
      });

      this.isExpanded = true;
    },

    // Check if the folder should be expanded (like when clicking a folder in the explorer)
    checkIfExpanded () {
      if (this.$store.state.drive.openFolder.id === this.folder.id) {
        this.isExpanded = true;
      }

      return this.isExpanded;
    }
  }
};
</script>

<style lang="scss" scoped>
.folder-tree {
  padding-left: 22px;
}

.folder-name {
  padding-left: 10px;
}

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

    > div.no-pointer {
      cursor: default
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
