/* eslint-disable no-await-in-loop */
/* ============
 * Vue Router
 * ============
 *
 * The official Router for Vue.js. It deeply integrates with Vue.js core
 * to make building Single Page Applications with Vue.js a breeze.
 *
 * @see https://router.vuejs.org/en/index.html
 */
import Vue from 'vue';
import VueRouter from 'vue-router';

/**
 * Lodash functions
 * @see https://lodash.com/docs
 */
import _has from 'lodash/has';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _isString from 'lodash/isString';
import _castArray from 'lodash/castArray';

import i18n from '@/i18n';
import store from '@/store';

import middleware from './middleware';
import routes from './routes';

Vue.use(VueRouter);

const router = new VueRouter({ routes, mode: 'history' });

router.beforeEach((to, from, next) => {
  // start progressbar
  Vue.$nprogress.start();

  const routeMiddleware = [];

  // route meta middlleware
  to.matched.forEach((matched) => {
    const { middleware: middlewareMeta } = matched.meta;

    if (!_isEmpty(middlewareMeta)) {
      middlewareMeta.forEach((m) => {
        let mid = {};

        if (_isString(m)) {
          const [name, args] = m.split(':');
          mid = { name, args };
        }

        if (_has(mid, 'name')) {
          const { name } = mid;
          const args = _has(mid, 'args') ? _castArray(mid.args) : [];

          // check if name is group middleware name
          if (_has(middleware.group, name)) {
            /** @type {Array} */
            const group = _get(middleware.group, name);

            group.forEach((g) => {
              routeMiddleware.push([g, ...args]);
            });
          } else {
            routeMiddleware.push([_get(middleware.route, name), ...args]);
          }
        } else {
          // eslint-disable-next-line no-console
          console.warn('Please check the middleware object, the object must have "name" property');
        }
      });
    }
  });

  // join all(global, route) middleware
  const beforeMiddleware = middleware.global.before.map((m) => _castArray(m));
  const afterMiddleware = middleware.global.after.map((m) => _castArray(m));
  const allMiddleware = [...beforeMiddleware, ...routeMiddleware, ...afterMiddleware];

  if (!allMiddleware.length) return next();

  let index = 0;

  const guard = (m) => {
    if (!m) return next;
    return (...args) => {
      if (args.length) {
        return next(...args);
      }

      const [mFunc, ...mArgs] = m;
      const nextGuard = guard(allMiddleware[index += 1]);

      return mFunc.apply({ $router: router, $store: store, $i18n: i18n }, [to, from, nextGuard, ...mArgs]);
    };
  };

  return guard(allMiddleware[0])();
});

router.afterEach(() => {
  // end progressbar
  Vue.$nprogress.done();
});

export default router;
