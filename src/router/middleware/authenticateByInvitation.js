import httpApi from '@/axios/api';
import { authInvitation } from '@/api/auth';

export default async function (to, from, next) {
  const { $store, $router } = this;
  const { query: { invitation } } = to;

  if (invitation) {
    // if ($store.getters['auth/authenticated']) {
    //   $store.dispatch('auth/logout');
    // }

    const http = httpApi($store, $router);
    $store.dispatch('auth/login', await authInvitation(http, invitation));
  }

  return next();
}
