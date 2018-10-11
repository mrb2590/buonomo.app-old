<template>
  <v-dialog
    class="dialog-rename-folder"
    v-model="$parent.showDialogRenameFolder"
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

      <v-card-title class="headline">Rename Folder</v-card-title>

      <v-card-text>
        <v-form novalidate @submit.prevent="validate">
          <v-text-field
            v-if="$parent.showDialogRenameFolder && folder"
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
        <v-btn color="primary" :disabled="sending" type="button" @click="validate">Rename</v-btn>
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
  name: 'DialogRenameFolder',

  data: () => ({
    showDialog: false,
    form: {
      folderName: '',
      isClear: true
    },
    sending: false,
    sendingError: ''
  }),

  props: [ 'folder', 'showDialogRenameFolder' ],

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

      return this.renameFolder({
        folder: this.folder,
        name: this.form.folderName
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
      this.$emit('showDialogRenameFolder', false)
      this.clear()
    }
  },

  beforeUpdate () {
    this.showDialog = this.$parent.showDialogRenameFolder
  },

  watch: {
    // Can't watch parent var so copy it to showDialog and watch that
    showDialog: function (val) {
      console.log(val)
      this.form.folderName = this.folder.name
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
