<template>
  <div class="profile">
    <v-container grid-list-xl>
      <v-layout row wrap>
        <v-flex xs12 sm6>
          <v-card dark color="accent">
            <v-card-text>xs10 offset-xs1</v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs100 sm6>
          <v-card dark color="secondary">
            <v-card-text>xs7 offset-(xs5 | md2 | lg5)</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'Profile',

  metaInfo: {
    title: 'Profile',
    meta: [
      {
        name: 'description',
        content: 'Profile.'
      }
    ]
  }
};
</script>

<style scoped>

</style>
