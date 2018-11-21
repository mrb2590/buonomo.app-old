<template>
  <div class="loading center-align-outer">
    <div class="center-align-inner">
      <v-progress-circular indeterminate :size="50" :width="5" color="secondary"></v-progress-circular>
    </div>
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
};
</script>

<style lang="scss" scoped>

</style>
