/* ============
 * NProgress
 * ============
 *
 * Slim progress bars for Ajax'y applications. Inspired by Google, YouTube, and Medium.
 *
 * https://github.com/rstacruz/nprogress
 */

import Vue from 'vue';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

Vue.use({
  install(V) {
    NProgress.configure({ showSpinner: false });

    V.$nprogress = NProgress;
    V.prototype.$nprogress = NProgress;
  },
});

export default NProgress;
