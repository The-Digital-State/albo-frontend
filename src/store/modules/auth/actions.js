/* ============
 * Actions for the auth module
 * ============
 *
 * The actions that are available on the
 * auth module.
 *
 * @see https://vuex.vuejs.org/guide/actions.html
 */
import { LOGIN, LOGOUT, ME } from './mutation-types';

export const login = async ({ commit }, token) => {
  // login mutation
  commit(LOGIN, token);
};

export const logout = async ({ commit }) => {
  // logout mutation
  commit(LOGOUT);
};

export const me = async ({ commit }, user) => {
  commit(ME, user);
};

export default {
  login,
  logout,
  me,
};
