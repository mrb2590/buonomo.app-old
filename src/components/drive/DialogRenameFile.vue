<template>
  <v-dialog
    class="dialog-rename-file"
    v-model="$store.state.drive.show.dialogRenameFile"
    max-width="290"
    :fullscreen="$store.state.app.dialogFullscreen"
    scrollable
  >
    <v-card>
      <v-card-title class="headline">
        <v-avatar
          :size="100"
          color="primary"
        >
          <v-icon :size="60" dark>create</v-icon>
        </v-avatar>
      </v-card-title>

      <v-card-title class="headline">Rename File</v-card-title>

      <v-card-text>
        <v-form novalidate @submit.prevent="validate">
          <v-text-field
            v-if="$store.state.drive.show.dialogRenameFile && $store.state.drive.dialogRenameFile"
            clearable
            :autofocus="true"
            v-model="form.fileName"
            :error-messages="fileNameErrors"
            :disabled="sending"
            name="fileName"
            label="Name"
            required
            @input="$v.form.fileName.$touch()"
            @blur="$v.form.fileName.$touch()"
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat :disabled="sending" @click="closeDialog">Close</v-btn>
        <v-btn color="primary" :disabled="sending" type="button" @click="validate">Rename</v-btn>
      </v-card-actions>
      <v-progress-linear v-if="sending" color="primary" :indeterminate="true"></v-progress-linear>
    </v-card>
  </v-dialog>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, maxLength } from 'vuelidate/lib/validators';

export default {
  name: 'DialogRenameFile',

  data: () => ({
    showDialog: false,
    form: {
      fileName: '',
      isClear: true
    },
    sending: false,
    sendingError: ''
  }),

  mixins: [ validationMixin ],

  validations: {
    form: {
      fileName: {
        required,
        maxLength: maxLength(255)
      }
    }
  },

  computed: {
    fileNameErrors () {
      const errors = [];
      if (!this.$v.form.fileName.$dirty) return errors;
      !this.$v.form.fileName.required && errors.push('File name is required');
      !this.$v.form.fileName.maxLength &&
        errors.push('File name cannot be longer than 255 characters');
      return errors;
    }
  },

  methods: {
    validate () {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.submit();
      }
    },

    submit () {
      this.sending = true;
      this.sendingError = false;

      return this.$store.dispatch('drive/renameFile', {
        file: this.$store.state.drive.dialogRenameFile,
        name: this.form.fileName
      })
        .then(file => {
          this.sending = false;
          this.clear();
          this.closeDialog();
        })
        .catch(() => {
          this.sending = false;
          this.sendingError = 'Something went wrong.';
        });
    },

    clear () {
      this.$v.$reset();
      this.form.fileName = '';
    },

    closeDialog () {
      this.$store.commit('drive/SET_SHOW_DIALOG_RENAME_FILE', false);
      this.clear();
    }
  },

  beforeUpdate () {
    this.showDialog = this.$store.state.drive.show.dialogRenameFile;
  },

  watch: {
    // Can't watch parent var so copy it to showDialog and watch that
    showDialog: function (val) {
      this.form.fileName = this.$store.state.drive.dialogRenameFile.name;
    }
  }
};
</script>

<style lang="scss" scoped>
.v-dialog {
  .v-avatar {
    margin: 0 auto;
  }

  .v-card__title {
    text-align: center;
    justify-content: center;
  }

  .v-card__text {
    height: 100%;
  }
}
</style>
