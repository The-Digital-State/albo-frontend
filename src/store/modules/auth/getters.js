/* ============
 * Getters for the auth module
 * ============
 *
 * The getters that are available on the
 * auth module.
 *
 * @see https://vuex.vuejs.org/guide/getters.html
 */

export default {
  authenticated(state) {
    return !!state.token;
  },
};
