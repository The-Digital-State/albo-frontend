/**
 * Lodash functions
 * @see https://lodash.com/docs
 */
import _omit from 'lodash/omit';

import BaseHttp, { supportStaticRequests } from '@/models/BaseHttp';
import paginatedArray from '@/utils/paginatedArray';

class EmailsList extends BaseHttp {
  static defaults() {
    return {
      id: null,
      title: '',
      emails: [],
    };
  }

  static options() {
    return {
      http: {

        // Basic http settings that apply to all methods
        base: {
          route: `${process.env.VUE_APP_API_URL}`,
          // headers: {
          //  Authorization: `Bearer ${store.state.auth.token}`,
          // },
        },

        staticMethods: {
          get: {
            route: '/emails-lists/{id}',
            method: 'GET',
            static: true,
            props: true,
            returns({ response: { data: { data = {} } } }) {
              return new EmailsList(data);
            },
          },
          list: {
            route: '/emails-lists',
            method: 'GET',
            static: true,
            returns({ response: { data: { data = [], pagination = {} } } }) {
              return paginatedArray(data.map((v) => new EmailsList(v)), pagination);
            },
          },
          delete: {
            route: '/emails-lists/{id}',
            method: 'DELETE',
            returns({ response: { status } }) {
              return status === 204;
            },
          },
        },

        methods: {
          create: {
            route: '/emails-lists',
            method: 'POST',
            data() {
              return this.$properties;
            },
            apply({ response: { data: { data = {} } } }) {
              return data;
            },
            sync: true,
          },
          update: {
            route: '/emails-lists/{id}',
            method: 'PUT',
            params() {
              return { id: this.id };
            },
            data() {
              return _omit(this.$properties, ['id']);
            },
            apply({ response: { data: { data = {} } } }) {
              return data;
            },
            sync: true,
            props: true,
          },
          delete: {
            route: '/emails-lists/{id}',
            method: 'DELETE',
            params() {
              return { id: this.id };
            },
            returns({ response: { status } }) {
              return status === 204;
            },
          },
        },
      },
    };
  }

  boot() {
    super.boot();
    this.$_http.save = () => ((this.$isExists) ? this.$http.update() : this.$http.create());
  }

  get $isExists() {
    return !!this.$.id;
  }
}

export default supportStaticRequests(EmailsList);
