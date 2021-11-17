import BaseHttp, { supportStaticRequests } from '@/models/BaseHttp';
import paginatedArray from '@/utils/paginatedArray';

class PollResult extends BaseHttp {
  static defaults() {
    return {
      token: '',
      pollId: '',
      choice: '',
    };
  }

  static options() {
    return {
      http: {

        // Basic http settings that apply to all methods
        base: {
          route: process.env.VUE_APP_API_URL,
        },

        staticMethods: {
          get: {
            route: '/polls/{pollId}/results/{token}',
            method: 'GET',
            returns({ response: { data: { data = {} } } }) {
              return new PollResult(data);
            },
          },
          list: {
            route: '/polls/{pollId}/results',
            method: 'GET',
            returns({ response: { data: { data = [], pagination = {} } } }) {
              return paginatedArray(data.map((v) => new PollResult(v)), pagination);
            },
          },
        },

        methods: {
          vote: {
            route: '/polls/{pollId}/vote',
            method: 'POST',
            params() {
              return { pollId: this.pollId };
            },
            data() {
              return { choice: this.$properties.choice };
            },
            apply({ response: { data: { data = {} } } }) {
              return data;
            },
          },
        },
      },
    };
  }

  get $isExists() {
    return !!this.$.token;
  }
}

export default supportStaticRequests(PollResult);
