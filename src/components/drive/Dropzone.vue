<template>
  <div class="dropzone-wrapper" v-show="$store.state.drive.show.dropzone">
    <v-btn fab medium top right fixed @click="$store.commit('drive/SET_SHOW_DROPZONE', false)">
      <v-icon dark>close</v-icon>
    </v-btn>
    <vue-dropzone
      ref="mainDropzone"
      id="dropzone"
      :options="dropzoneOptions"
      @vdropzone-queue-complete="queueComplete"
      @vdropzone-success="uploadSuccess"
    ></vue-dropzone>
  </div>
</template>

<script>
import { driveMethods } from '../../state/helpers';
import vue2Dropzone from 'vue2-dropzone';
import 'vue2-dropzone/dist/vue2Dropzone.min.css';

export default {
  name: 'Dropzone',

  data () {
    return {
      dropzoneOptions: {
        url: `${process.env.VUE_APP_API_URL}/v1/drive/files`,
        thumbnailWidth: 150,
        addRemoveLinks: true,
        maxFilesize: 107374, // 100 GB
        maxFiles: 50,
        filesizeBase: 1024,
        parallelUploads: 1,
        timeout: 0,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token.access_token}`,
          Accept: 'application/json'
        },
        params: () => {
          return {
            folder_id: this.$store.state.drive.openFolder.id
          };
        }
      }
    };
  },

  components: {
    vueDropzone: vue2Dropzone
  },

  methods: {
    ...driveMethods,

    dragenter: function (e) {
      e.preventDefault();
      this.$store.commit('drive/SET_SHOW_DROPZONE', true);
    },

    queueComplete: function (file, response) {
      this.$refs.mainDropzone.removeAllFiles();
      this.$store.commit('drive/SET_SHOW_DROPZONE', false);
      this.$store.dispatch('user/fetchUser', true);
    },

    uploadSuccess: function (file, response) {
      this.$store.commit('drive/ADD_CHILD_FILE', response.data);
    }
  },

  mounted () {
    window.addEventListener('dragenter', this.dragenter);
  },

  destroyed () {
    window.removeEventListener('dragenter', this.dragenter);
  }
};
</script>

<style lang="scss">
.dropzone-wrapper {
  background: rgba(0, 0, 0, 0.6);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1000;

  .dropzone {
    background: rgba(0, 0, 0, 0);
    height: 100%;
    width: 100%;
    border: none;

    > .dz-message {
      font-size: 24px;
      color: #000;
      display: block;
      position: absolute;
      left: 0;
      top: 50%;
      width: 100%;
      transform: translateY(-50%);
      color: #fff;
      font-weight: 100;
      margin: 0;
    }

     .dz-preview .dz-details {
       color: #000;
       background: none;
     }
  }
}
</style>
