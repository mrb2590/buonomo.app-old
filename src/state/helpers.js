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
    user: state => state.user
  }),
  ...mapGetters('user', ['fullName', 'initials', 'formatDate'])
}

export const userMethods = mapActions('user', ['fetchUser'])

// Drive
export const driveComputed = {
  ...mapState('drive', {
    openFolder: state => state.openFolder,
    tree: state => state.tree
  }),
  ...mapGetters('drive', ['formatDate'])
}

export const driveMethods = mapActions('drive', [
  'updateTree', 'fetchFolder', 'downloadFolder', 'downloadFile', 'addFolder'
])
