/* ============
 * Main File
 * ============
 *
 * Will initialize the application.
 */
import Vue from 'vue';

/* ============
 * Plugins
 * ============
 *
 * Import the plugins.
 */
import store from '@/store';
import router from '@/router';
import i18n from '@/i18n';
import vuetify from '@/plugins/vuetify';
import '@/plugins/nprogress';
import '@/plugins/veeValidate';
import '@/plugins/dayjs';
import '@/plugins/sweetAlert2';
import '@/plugins/toastr';
import '@/plugins/meta';
import '@/plugins/loading';

/* ============
 * API
 * ============
 *
 * Import the api methods.
 */
import '@/api';

/* ============
 * Styling
 * ============
 *
 * Import the application styling.
 */
import '@/scss/main.scss';

/* ============
 * Main App
 * ============
 *
 * Import the main application.
 */
import App from '@/views/App';

// config
Vue.config.productionTip = process.env.NODE_ENV !== 'production';

new Vue({
  /**
   * The localization plugin.
   */
  i18n,

  /**
   * The router.
   */
  router,

  /**
   * The Vuex store.
   */
  store,

  /**
   * Vuetify.
   */
  vuetify,

  /**
   * The Vue meta.
   */
  meta: {
    titleTemplate: '%s | Альбо',
  },

  /**
   * Will render the application.
   *
   * @param {Function} h Will create an element.
   */
  render: (h) => h(App),
}).$mount('#app');
