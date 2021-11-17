/* ============
* Vuex Store
* ============
*
* Vuex is a state management pattern + library for Vue.js applications.
* It serves as a centralized store for all the components in an application,
* with rules ensuring that the state can only be mutated in a predictable fashion.
*
* https://vuex.vuejs.org/en/index.html
*/
import Vue from 'vue';
import Vuex from 'vuex';
import logger from 'vuex/dist/logger';

// Modules
import auth from './modules/auth';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const store = new Vuex.Store({
  /**
   * Assign the modules to the store.
   * @see https://vuex.vuejs.org/guide/modules.html#modules
   */
  modules: {
    auth,
  },

  /**
   * If strict mode should be enabled.
   * @see https://vuex.vuejs.org/guide/strict.html
   */
  strict: debug,

  /**
   * Plugins used in the store.
   * @see https://vuex.vuejs.org/guide/plugins.html#plugins
   */
  plugins: debug ? [logger()] : [],
});

export default store;
