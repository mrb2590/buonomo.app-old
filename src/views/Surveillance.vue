<template>
  <div class="surveillance center-align-outer">
    <div class="center-align-inner">
      <div class="text-sm-center">
        <div>
          <img src="https://dev.api.buonomo.app/v1/surveillance/cameras/camera01">
          <br>
          <v-select
            v-model="speed"
            :items="['50', '100', '250', '500', '1000']"
            label="Speed"
            required
          ></v-select>
          <v-select
            v-model="iterations"
            :items="['8', '16', '32', '64', '128']"
            label="Iterations"
            required
          ></v-select>
          <v-btn color="primary" @click="runLightsProgram()">Run Lights Program</v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Surveillance',

  metaInfo: {
    title: 'Surveillance',
    meta: [
      {
        name: 'description',
        content: 'Video surveillance.'
      }
    ]
  },

  data: () => ({
    speed: '100',
    iterations: '32'
  }),

  methods: {
    runLightsProgram () {
      return axios.post(`https://dev.api.buonomo.app/v1/google/raspberrypi-controller/webhook`, {
        queryResult: {
          parameters: {
            speed: this.speed,
            iterations: this.iterations
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
img {
  width: 100%;
  max-width: 960px;
  height: auto;
}
</style>
