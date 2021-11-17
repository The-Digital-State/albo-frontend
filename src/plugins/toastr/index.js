/* ============
 * toastr
 * ============
 *
 * Javascript library for non-blocking notifications.
 *
 * https://github.com/CodeSeven/toastr
 */

import Vue from 'vue';
import toastr from 'toastr';
import 'toastr/toastr.scss';
import './style.scss';

// config
toastr.options = {
  debug: process.env.NODE_ENV !== 'production',
  closeButton: true,
  progressBar: true,
  preventDuplicates: true,
  positionClass: 'toast-bottom-right',
};

Vue.use({
  install(V) {
    /**
     * @property {Function} success
     * @property {Function} error
     * @property {Function} remove
     * @property {Function} clear
     * @type {Object}
     */
    V.prototype.$toastr = toastr;
  },
});

export default toastr;
