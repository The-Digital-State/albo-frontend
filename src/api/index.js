import Vue from 'vue';

import httpApi from '@/axios/api';
import store from '@/store';
import router from '@/router';

import { authAzure, authInvitation, me } from './auth';
import { canVote, statistic } from './voting';

const $api = (http) => ({
  authAzure(...args) {
    return authAzure(http, ...args);
  },
  authInvitation(...args) {
    return authInvitation(http, ...args);
  },
  me(...args) {
    return me(http, ...args);
  },
  canVote(...args) {
    return canVote(http, ...args);
  },
  statistic(...args) {
    return statistic(http, ...args);
  },
});

Vue.use({
  install(V) {
    V.prototype.$api = $api(httpApi(store, router));
  },
});

export default $api;
