<template>
  <div class="signin center-align-outer">
    <div class="center-align-inner">
      <v-card>
        <v-form novalidate @submit.prevent="validate">
          <v-card-title primary-title>
            <h1 class="headline mb-0">Sign in</h1>
          </v-card-title>

          <v-card-text>
            <v-text-field
              :autofocus="true"
              v-model="form.email"
              :error-messages="emailErrors"
              :disabled="sending"
              name="email"
              label="Email"
              required
              @input="$v.form.email.$touch()"
              @blur="$v.form.email.$touch()"
              @keyup="checkFormClear"
            ></v-text-field>
            <v-text-field
              v-model="form.password"
              :error-messages="passwordErrors"
              :append-icon="showPassword ? 'visibility_off' : 'visibility'"
              :type="showPassword ? 'text' : 'password'"
              :disabled="sending"
              namme="password"
              label="Password"
              required
              @click:append="showPassword = !showPassword"
              @input="$v.form.password.$touch()"
              @blur="$v.form.password.$touch()"
              @keyup="checkFormClear"
            ></v-text-field>
            <v-switch
              v-model="remember"
              label="Remember me"
              color="primary"
              :disabled="sending"
            ></v-switch>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <transition name="fade">
              <v-btn v-show="!form.isClear" flat :disabled="sending" @click="clear">clear</v-btn>
            </transition>
            <v-btn color="primary" :disabled="sending" type="submit">Sign In</v-btn>
          </v-card-actions>
        </v-form>
        <v-progress-linear v-if="sending" color="primary" :indeterminate="true"></v-progress-linear>
      </v-card>
    </div>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import { authMethods, authComputed } from '../state/helpers'

export default {
  name: 'SignIn',

  metaInfo: {
    title: 'Sign In',
    meta: [
      {
        name: 'description',
        content: 'Sign in.'
      }
    ]
  },

  data: () => ({
    showPassword: false,
    form: {
      email: '',
      password: '',
      isClear: true
    },
    sending: false
  }),

  mixins: [validationMixin],

  validations: {
    form: {
      email: {
        required,
        email
      },
      password: {
        required
      }
    }
  },

  computed: {
    ...authComputed,

    remember: {
      get () {
        return this.$store.state.auth.remember
      },
      set (newValue) {
        this.$store.commit('auth/SET_REMEMBER', newValue)
      }
    },

    emailErrors () {
      const errors = []
      if (!this.$v.form.email.$dirty) return errors
      !this.$v.form.email.email && errors.push('Must be a valid email')
      !this.$v.form.email.required && errors.push('Email is required')
      return errors
    },

    passwordErrors () {
      const errors = []
      if (!this.$v.form.password.$dirty) return errors
      !this.$v.form.password.required && errors.push('Password is required')
      return errors
    }
  },

  methods: {
    ...authMethods,

    validate () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.submit()
      }
    },

    submit () {
      this.sending = true

      return this.signIn({
        email: this.form.email,
        password: this.form.password,
        remember: this.remember
      })
        .then(token => {
          this.sending = false
          this.clear()
          // Redirect to the originally requested page, or to the home page
          this.$router.push(this.$route.query.redirectFrom || { name: 'profile' })
        })
        .catch(error => {
          this.sending = false
          if (error.response.status === 401) {
            this.$store.commit('app/SET_SNACKBAR', {
              show: true,
              text: 'Access denied.'
            })
          } else {
            this.$store.commit('app/SET_SNACKBAR', {
              show: true,
              color: 'error',
              closeColor: 'white',
              text: 'Failed to authenticate!'
            })
          }
        })
    },

    clear () {
      this.$v.$reset()
      this.form.email = ''
      this.form.password = ''
      this.form.isClear = true
    },

    checkFormClear () {
      if (this.form.email === '' && this.form.password === '') {
        this.form.isClear = true
      } else {
        this.form.isClear = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.v-card {
  width: 100%;
  max-width: 350px;

  .headline {
    text-align: center;
    width: 100%;
  }
}

@media (max-width: 599px) {
  .v-card {
    max-width: 100%;
    height: 100%;
  }
}
</style>
