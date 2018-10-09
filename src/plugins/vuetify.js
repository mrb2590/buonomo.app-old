import Vue from 'vue'
import colors from 'vuetify/es5/util/colors'
import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  transitions,
  VDivider,
  VProgressCircular,
  VProgressLinear,
  VCard,
  VImg,
  VForm,
  VTextField,
  VSwitch,
  VOverflowBtn,
  VBtnToggle,
  VAvatar,
  VSpeedDial,
  VMenu,
  VDialog
} from 'vuetify'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    transitions,
    VDivider,
    VProgressCircular,
    VProgressLinear,
    VCard,
    VImg,
    VForm,
    VTextField,
    VSwitch,
    VOverflowBtn,
    VBtnToggle,
    VAvatar,
    VSpeedDial,
    VMenu,
    VDialog
  },
  theme: {
    primary: colors.green.base,
    secondary: colors.green.lighten2,
    accent: colors.indigo.base,
    error: colors.red.base,
    warning: colors.yellow.base,
    info: colors.blue.base,
    success: colors.green.base
  },
  customProperties: true,
  iconfont: 'md'
})
