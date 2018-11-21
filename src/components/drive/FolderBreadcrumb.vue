<template>
  <div class="folder-breadcrumb">
    <v-container fluid>
      <v-layout row wrap>
        <v-flex>
          <h1 class="title" v-if="folder">{{ folder.name }}</h1>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'FolderBreadcrumb',

  props: [ 'folder' ],

  data () {
    return {
      breadcrumb: []
    };
  },

  methods: {
  }
};
</script>

<style lang="scss" scoped>

</style>
