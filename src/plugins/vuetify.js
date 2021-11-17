/* ============
 * Vuetify
 * ============
 *
 * Vuetify is a complete UI framework built on top of Vue.js.
 *
 * https://github.com/declandewet/vue-meta
 */

import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

import '@mdi/font/css/materialdesignicons.css';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
  },
});
