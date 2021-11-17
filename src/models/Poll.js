/**
 * Lodash functions
 * @see https://lodash.com/docs
 */
import _omit from 'lodash/omit';

import dayjs from '@/plugins/dayjs';
import BaseHttp, { supportStaticRequests } from '@/models/BaseHttp';
import paginatedArray from '@/utils/paginatedArray';

class Poll extends BaseHttp {
  static defaults() {
    return {
      id: '',
      title: '',
      description: '',
      shortDescription: '',
      start: null,
      end: null,
      question: {
        title: '',
        options: [],
      },
      emailsListId: null,
      publishedAt: null,
      createdAt: null,
      updatedAt: null,
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
            route: '/polls/{id}',
            method: 'GET',
            returns({ response: { data: { data = {} } } }) {
              return new Poll(data);
            },
          },
          view: {
            route: '/polls/{id}/view',
            method: 'GET',
            returns({ response: { data: { data = {} } } }) {
              return new Poll(data);
            },
          },
          list: {
            route: '/polls',
            method: 'GET',
            returns({ response: { data: { data = [], pagination = {} } } }) {
              return paginatedArray(data.map((v) => new Poll(v)), pagination);
            },
          },
          delete: {
            route: '/polls/{id}',
            method: 'DELETE',
            returns({ response: { status } }) {
              return status === 204;
            },
          },
        },

        methods: {
          create: {
            route: '/polls',
            method: 'POST',
            data() {
              return _omit(this.$properties, ['id', 'createdAt', 'updatedAt', 'publishedAt']);
            },
            apply({ response: { data: { data = {} } } }) {
              return data;
            },
            sync: true,
          },
          update: {
            route: '/polls/{id}',
            method: 'PUT',
            params() {
              return { id: this.id };
            },
            data() {
              return _omit(this.$properties, ['id', 'createdAt', 'updatedAt', 'publishedAt']);
            },
            apply({ response: { data: { data = {} } } }) {
              return data;
            },
            sync: true,
          },
          delete: {
            route: '/polls/{id}',
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
    this.$_http.save = (...args) => ((this.$isExists) ? this.$http.update(...args) : this.$http.create(...args));
  }

  get $isExists() {
    return !!this.$.id;
  }

  get $isPublished() {
    return !!this.$.publishedAt;
  }

  get $isFinished() {
    return this.end && dayjs(this.end).isBefore(dayjs());
  }

  get $isActive() {
    const now = dayjs();

    if (!this.start || !this.end) {
      return false;
    }

    const start = dayjs(this.start);
    const end = dayjs(this.end);

    return start.isBefore(now) && end.isAfter(now);
  }
}

export default supportStaticRequests(Poll);
