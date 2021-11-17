import axios from 'axios';
import qs from 'qs';

export default (store, router) => {
  const api = axios.create({
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
  });

  api.interceptors.request.use((config) => {
    if (store.getters['auth/authenticated']) {
      config.headers.Authorization = `Bearer ${store.state.auth.token}`;
    }

    return config;
  });

  api.interceptors.response.use((response) => response, async (e) => {
    const { response: { status } = {} } = e;

    if (status === 401) {
      store.dispatch('auth/logout');
      router.push({ name: 'LoginPage' })
        .catch(() => {
        });

      throw e;
    }

    throw e;
  });

  return api;
};
