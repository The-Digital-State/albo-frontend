/* ============
 * Mutations for the auth module
 * ============
 *
 * The mutations that are available on the
 * account module.
 *
 * @see https://vuex.vuejs.org/guide/mutations.html
 */

import {
  LOGIN,
  LOGOUT,
  ME,
} from './mutation-types';

export default {
  [LOGIN](state, token) {
    state.token = token;
    localStorage.setItem('AUTH_TOKEN', token);
  },

  [LOGOUT](state) {
    state.token = '';
    localStorage.removeItem('AUTH_TOKEN');
  },

  [ME](state, me) {
    state.me = me;
  },
};
