import { mapState, mapGetters, mapActions } from 'vuex'

// Preferences
export const preferencesComputed = {
  ...mapState('preferences', {
    preferences: state => state
  }),
  ...mapGetters('preferences', [])
}

export const preferencesMethods = mapActions('preferences', [])

// Auth
export const authComputed = {
  ...mapState('auth', {
    token: state => state.token
  }),
  ...mapGetters('auth', ['signedIn'])
}

export const authMethods = mapActions('auth', ['signIn', 'signOut'])

// User
export const userComputed = {
  ...mapState('user', {
    userProfile: state => state.user
  }),
  ...mapGetters('user', ['fullName', 'initials', 'formattedDates'])
}

export const userMethods = mapActions('user', ['fetchUser'])
