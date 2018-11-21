<template>
  <v-app :dark="darkMode" :class="{ 'dropzone-open': $store.state.drive.show.dropzone }">
    <v-navigation-drawer
      persistent
      :mini-variant="miniDrawer"
      v-model="drawer"
      enable-resize-watcher
      fixed
      app
    >
      <v-toolbar
        flat
        class="transparent"
        v-if="signedIn"
      >
        <v-list>
          <v-list-tile avatar to="/profile">
            <v-list-tile-avatar>
              <img src="https://randomuser.me/api/portraits/men/85.jpg">
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{ fullName }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon ripple>
                <v-icon color="grey lighten-1">notifications</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-list>
        <v-list-tile
          value="true"
          to="/signin"
          v-if="!signedIn"
        >
          <v-list-tile-action>
            <v-icon>account_circle</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Sign In</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile
          value="true"
          to="/signout"
          v-if="signedIn"
        >
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Sign Out</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider></v-divider>

        <v-list-tile
          value="true"
          to="/"
        >
          <v-list-tile-action>
            <v-icon>dashboard</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile
          value="true"
          to="/about"
        >
          <v-list-tile-action>
            <v-icon>info</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>About</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile
          value="true"
          to="/drive"
        >
          <v-list-tile-action>
            <v-icon>folder_special</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Drive</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar app color="primary">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-btn icon @click.stop="miniDrawer = !miniDrawer">
        <v-icon v-html="miniDrawer ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn>
      <v-toolbar-title v-text="$route.meta.displayName"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="darkMode = !darkMode">
        <v-icon>invert_colors</v-icon>
      </v-btn>
    </v-toolbar>

    <v-content class="main-content">
      <transition name="slide-fade">
        <router-view/>
      </transition>
    </v-content>

    <v-footer class="pa-2" fixed app inset>
      <div>&copy; {{ new Date().getFullYear() }}</div>
    </v-footer>

    <v-snackbar
      v-model="snackbar.show"
      :bottom="true"
      :color="snackbar.color"
      :multi-line="snackbar.multiline"
      :timeout="snackbar.timeout"
      :vertical="snackbar.vertical"
    >
      {{ snackbar.text }}
      <v-btn
        dark
        flat
        :color="snackbar.closeColor"
        @click="resetSnackbar"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import appConfig from './app.config';
import { authComputed, userComputed } from './state/helpers';

export default {
  name: 'App',

  page: {
    // All subcomponent titles will be injected into this template.
    titleTemplate (title) {
      title = typeof title === 'function' ? title(this.$store) : title;
      this.title = title;
      return title ? `${title} | ${appConfig.title}` : appConfig.title;
    }
  },

  data: () => ({
    drawer: window.innerWidth >= 1264,
    miniDrawer: false,
    title: appConfig.title
  }),

  computed: {
    ...authComputed,
    ...userComputed,

    darkMode: {
      get () {
        return this.$store.state.preferences.darkMode;
      },
      set (newValue) {
        this.$store.commit('preferences/SET_DARK_MODE', newValue);
      }
    },

    snackbar: {
      get () {
        return this.$store.state.app.snackbar;
      },
      set (newValue) {
        this.$store.commit('app/SET_SNACKBAR', newValue);
      }
    }
  },

  methods: {
    resetSnackbar () {
      this.$store.commit('app/RESET_SNACKBAR');
    }
  }
};
</script>

<style lang="scss">
@import './design/index';

html {
  overflow: auto;
}
a {
  text-decoration: none;
}
a[class=""]:hover {
  text-decoration: underline;
}

.main-content {
  overflow: hidden;
}
</style>
