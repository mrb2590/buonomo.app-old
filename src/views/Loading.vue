<template>
  <div class="loading">
    <v-progress-circular
      indeterminate
      color="secondary"
    ></v-progress-circular>
  </div>
</template>

<script>
export default {
  name: 'Loading',

  metaInfo: {
    title: 'Loading',
    meta: [
      {
        name: 'description',
        content: 'Loading page.'
      }
    ]
  }
}
</script>

<style scoped>

</style>
