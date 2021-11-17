/* ============
 * Vue i18n
 * ============
 *
 * Internationalization plugin of Vue.js.
 *
 * https://kazupon.github.io/vue-i18n/
 */
import Vue from 'vue';
import VueI18n from 'vue-i18n';

// dayjs
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import 'dayjs/locale/be';

// VeeValidate
import { localize as veeValidateLocalize } from 'vee-validate';
import veeValidateMessages from '@/plugins/veeValidate/lang';

import messages from './lang';

// rules
import slavic from './pluralization/slavic';

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE,

  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE,

  pluralizationRules: {
    ru: slavic,
    be: slavic,
  },

  messages,
});

// VeeValidate
veeValidateLocalize(veeValidateMessages);
veeValidateLocalize(i18n.locale);

// dayjs
dayjs.locale(i18n.locale);

export const setLanguage = (lang) => {
  i18n.locale = lang;
  veeValidateLocalize(lang);
  dayjs.locale(lang);
};

export default i18n;
