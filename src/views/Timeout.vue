<template>
  <div class="timeout center-align-outer">
    <div class="center-align-inner">
      <div class="text-sm-center">
        <div>
          <v-icon :size="50" color="error">sentiment_very_dissatisfied</v-icon>
        </div>
        <div class="headline">
          The page timed out
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Timeout',

  metaInfo: {
    title: 'Timeout',
    meta: [
      {
        name: 'description',
        content: 'The page timed out.'
      }
    ]
  }
}
</script>

<style lang="scss" scoped>
.headline {
  margin-top: 20px;
}
</style>
