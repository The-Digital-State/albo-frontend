/* ============
 * State of the auth module
 * ============
 *
 * The initial state of the auth module.
 *
 * @see https://vuex.vuejs.org/guide/state.html
 */

export default {
  token: localStorage.getItem('AUTH_TOKEN') || '',
  me: {},
};
