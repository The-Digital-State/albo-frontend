/* ============
 * VueMeta
 * ============
 *
 * Manage page meta info in Vue 2.0 components.
 * SSR + Streaming supported. Inspired by react-helmet.
 *
 * https://github.com/declandewet/vue-meta
 */

import Vue from 'vue';
import Meta from 'vue-meta';

/**
 * Meta options
 * @see https://github.com/declandewet/vue-meta#step-1-preparing-the-plugin
 */
Vue.use(Meta, {
  // the component option name that vue-meta looks for meta info on.
  keyName: 'meta',

  // the attribute name vue-meta adds to the tags it observes
  attribute: 'data-vue-meta',

  // the attribute name that lets vue-meta know that meta info has already been server-rendered
  ssrAttribute: 'data-vue-meta-server-rendered',

  // the property name that vue-meta uses to determine whether to overwrite or append a tag
  tagIDKeyName: 'vmid',
});
