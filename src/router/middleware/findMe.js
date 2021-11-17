/**
 * Lodash functions
 * @see https://lodash.com/docs
 */
import _isEmpty from 'lodash/isEmpty';

import { me } from '@/api/auth';
import httpApi from '@/axios/api';

export default async function (to, from, next) {
  const { $store, $router } = this;

  // check if user is authenticated
  if ($store.getters['auth/authenticated']) {
    if (_isEmpty($store.state.auth.me)) {
      await $store.dispatch('auth/me', await me(httpApi($store, $router)));
    }
  }

  return next();
}
