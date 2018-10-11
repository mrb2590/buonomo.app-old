<template>
  <v-dialog
    class="dialog-create-folder"
    v-model="$parent.showDialogCreateFolder"
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
          <v-icon :size="60" dark>create_new_folder</v-icon>
        </v-avatar>
      </v-card-title>

      <v-card-title class="headline">Create Folder</v-card-title>

      <v-card-text>
        <v-form novalidate @submit.prevent="validate">
          <v-text-field
            v-if="$parent.showDialogCreateFolder"
            clearable
            :autofocus="true"
            v-model="form.folderName"
            :error-messages="folderNameErrors"
            :disabled="sending"
            name="folderName"
            label="Name"
            required
            @input="$v.form.folderName.$touch()"
            @blur="$v.form.folderName.$touch()"
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat :disabled="sending" @click="closeDialog">Close</v-btn>
        <v-btn color="primary" :disabled="sending" type="button" @click="validate">Create</v-btn>
      </v-card-actions>
      <v-progress-linear v-if="sending" color="primary" :indeterminate="true"></v-progress-linear>
    </v-card>
  </v-dialog>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength } from 'vuelidate/lib/validators'
import { driveMethods } from '../../state/helpers'

export default {
  name: 'DialogCreateFolder',

  data: () => ({
    form: {
      folderName: '',
      isClear: true
    },
    sending: false,
    sendingError: ''
  }),

  props: [ 'showDialogCreateFolder' ],

  mixins: [validationMixin],

  validations: {
    form: {
      folderName: {
        required,
        maxLength: maxLength(255)
      }
    }
  },

  computed: {
    folderNameErrors () {
      const errors = []
      if (!this.$v.form.folderName.$dirty) return errors
      !this.$v.form.folderName.required && errors.push('Folder name is required')
      !this.$v.form.folderName.maxLength &&
        errors.push('Folder name cannot be longer than 255 characters')
      return errors
    }
  },

  methods: {
    ...driveMethods,

    validate () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.submit()
      }
    },

    submit () {
      this.sending = true
      this.sendingError = false

      return this.addFolder({
        name: this.form.folderName,
        parentId: this.$store.state.drive.openFolder.id
      })
        .then(folder => {
          this.sending = false
          this.clear()
          this.closeDialog()
        })
        .catch(() => {
          this.sending = false
          this.sendingError = 'Something went wrong.'
        })
    },

    clear () {
      this.$v.$reset()
      this.form.folderName = ''
    },

    closeDialog () {
      this.$emit('showDialogCreateFolder', false)
      this.clear()
    }
  }
}
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
