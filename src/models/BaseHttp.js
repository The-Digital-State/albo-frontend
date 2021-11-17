import Vue from 'vue';

/**
 * Lodash functions
 * @see https://lodash.com/docs
 */
import _forEach from 'lodash/forEach';
import _has from 'lodash/has';
import _get from 'lodash/get';
import _pick from 'lodash/pick';
import _isFunction from 'lodash/isFunction';
import _defaultsDeep from 'lodash/defaultsDeep';
import _cloneDeep from 'lodash/cloneDeep';

import api from '@/axios/api';
import store from '@/store';
import router from '@/router';

import BaseModel from '@/models/Base';

const httpApi = api(store, router);

const getHttpURL = async function (httpOptions, definition) {
  const { base: { route: baseRoute = '' }, patterns: { params: pattern } } = httpOptions;
  const { route = '', params = {} } = definition;
  const { params: aParams = {} } = definition.additional || {};

  let url = `${baseRoute.replace(/\/+$/, '')}/${route.replace(/^\/+/, '')}`;
  let data = {};

  if (params) {
    data = { ...data, ..._isFunction(params) ? await params.call(this, { httpOptions, definition }) : params };
  }

  if (aParams) {
    data = { ...data, ..._isFunction(aParams) ? await aParams.call(this, { httpOptions, definition }) : aParams };
  }

  let match = url.match(pattern);

  while (match) {
    const [, key] = match;

    if (!_has(data, key)) {
      // eslint-disable-next-line no-console
      console.warn(`[${this.constructor.name}] Missing param "${key}" in route "${route}`);
    }

    const regex = new RegExp(`{${key}}`, 'g');
    url = url.replace(regex, _get(data, key, ''));

    match = url.match(pattern);
  }

  return url;
};

const getHttpHeaders = async function (httpOptions, definition) {
  const { base: { headers: baseHeaders = {} } } = httpOptions;
  const { headers = {}, additional: { headers: aHeaders = {} } = {} } = definition;

  return {
    ..._isFunction(baseHeaders) ? await baseHeaders.call(this, { httpOptions, definition }) : baseHeaders,
    ..._isFunction(headers) ? await headers.call(this, { httpOptions, definition }) : headers,
    ..._isFunction(aHeaders) ? await aHeaders.call(this, { httpOptions, definition }) : aHeaders,
  };
};

const getHttpData = async function (httpOptions, definition) {
  const { data = {}, additional: { data: aData = {} } = {} } = definition;

  return {
    ..._isFunction(data) ? await data.call(this, { httpOptions, definition }) : data,
    ..._isFunction(aData) ? await aData.call(this, { httpOptions, definition }) : aData,
  };
};

const getHttpConfig = async function (httpOptions, definition) {
  const { options = {} } = definition;

  const data = ['PUT', 'POST', 'PATCH'].includes(definition.method) ? 'data' : 'params';

  return {
    url: await getHttpURL.call(this, httpOptions, definition),
    headers: await getHttpHeaders.call(this, httpOptions, definition),
    [data]: await getHttpData.call(this, httpOptions, definition),
    method: definition.method || 'GET',
    ...options,
  };
};

const sendRequest = async function (httpOptions, definition) {
  const { onBefore, onAfter, onError, apply, sync, returns } = definition;

  try {
    // If any of listeners return false, stop the request
    if (_isFunction(onBefore) && await onBefore.call(this, definition) === false) {
      return false;
    }

    const httpClient = _get(httpOptions, 'client');
    const httpConfig = await getHttpConfig.call(this, httpOptions, definition);

    const response = await httpClient.request(httpConfig);

    if (apply) {
      if (apply === true) {
        this.set(response.data);
      } else {
        this.set(_isFunction(apply) ? await apply.call(this, { response, definition }) : _pick(response.data, apply));
      }
    }

    if (sync) {
      if (sync === true) {
        this.sync();
      } else {
        this.sync(_isFunction(sync) ? await sync.call(this, { response, definition }) : sync);
      }
    }

    if (_isFunction(onAfter)) {
      onAfter.call(this, { definition, response });
    }

    return (returns) ? await returns.call(this, { definition, response }) : true;
  } catch (e) {
    if (_isFunction(onError)) {
      await onError.call(this, definition);
      return null;
    }

    throw e;
  }
};

export const supportStaticRequests = (cls) => {
  const { http } = _defaultsDeep({}, cls.options(), cls.defaultOptions());

  if (http) {
    const { staticMethods = {} } = http;

    cls.$http = cls.$http || {};

    _forEach(staticMethods, (definition, methodName) => {
      if (definition) {
        Object.defineProperty(cls.$http, methodName, {
          enumerable: false,
          configurable: false,
          writable: false,
          value: async (config = {}) => {
            const def = _cloneDeep(definition);
            def.additional = config;

            return sendRequest.call({ constructor: { name: cls.name } }, http, def);
          },
        });
      }
    });
  }

  return cls;
};

export default class BaseHttp extends BaseModel {
  /**
   * @returns {Object} This class' default options.
   */
  static defaultOptions() {
    return {
      ...BaseModel.defaultOptions(),
      ...{
        // Default HTTP requests methods
        http: {
          // HTTP client for requests
          client: httpApi,

          patterns: {
            // Replacement patterns for properties in a route
            params: /{([\s\S]+?)}/,
          },

          // Basic http settings that apply to all methods
          base: {
            route: '',
            headers: {},
          },

          // static methods definition
          staticMethods: {},

          // methods definition
          methods: {
            // Http method configuration example
            // get: {
            //   // http client options for fine tuning
            //   options: {},
            //
            //   // route path. Example: 'user' or with dynamic params 'user/{id}'
            //   route: '',
            //   method: 'GET',
            //   headers: {},
            //   // participates in the replacement of the dynamic parts of the route path
            //   // could be object or function that return {key: value} object
            //   params: {},
            //   // Modify what data we should send to the server
            //   // could be object or function that return {key: value} object
            //   data: {},
            //
            //   // Apply the response data to the model,
            //   // can be boolean, object {key: value} or function returned object {key: value}
            //   apply: false,
            //   // sync model properties after request
            //   // an be boolean, object {key: value} or function returned object {key: value}
            //   sync: false,
            //   // what the method returns, if not defined, returns true or false
            //   returns({ response: { data } }) {
            //     return new this.$class(data);
            //   },
            //   // callbacks to run before and after the request
            //   onBefore: false,
            //   onAfter: false,
            // },
          },
        },
      },
    };
  }

  boot() {
    Vue.set(this, '$_http', {});
    this.assignHttp(this.getOption('http.methods', {}));
  }

  /**
   * @returns {Object} This model's $http.
   */
  get $http() {
    return this.$_http;
  }

  /**
   * Define http methods
   * @returns {BaseHttp}
   */
  assignHttp(methods) {
    // only non-static methods
    _forEach(methods, (definition, methodName) => {
      if (definition && !_get(definition, 'static', false)) {
        Object.defineProperty(this.$_http, methodName, {
          enumerable: false,
          configurable: false,
          writable: false,
          value: async (config = {}) => {
            const def = _cloneDeep(definition);
            def.additional = config;

            return sendRequest.call(this, this.getOption('http'), def);
          },
        });
      }
    });

    return this;
  }
}
