/* ============
 * Dayjs
 * ============
 *
 * Day.js is a minimalist JavaScript library that parses, validates, manipulates, and displays dates and times for
 * modern browsers with a largely Moment.js-compatible API.
 *
 * https://github.com/iamkun/dayjs
 */

import Vue from 'vue';
import dayjs from 'dayjs';

// plugins
import utc from 'dayjs/plugin/utc';
import weekday from 'dayjs/plugin/weekday';
import timeZone from 'dayjs-ext/plugin/timeZone';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import i18n from './plugins/i18n';

dayjs.extend(utc);
dayjs.extend(weekday);
dayjs.extend(timeZone);
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);
dayjs.extend(i18n);
dayjs.extend((options, cls) => {
  cls.prototype.toAppFormat = function () {
    return cls.prototype.format.call(this, process.env.VUE_APP_DATE_FORMAT);
  };
});

Vue.use({
  install(V) {
    V.prototype.$dayjs = dayjs;
  },
});

export default dayjs;
