/* ============
 * VeeValidate
 * ============
 *
 * VeeValidate is a validation library for Vue.js.
 * It has plenty of validation rules out of the box and support for custom ones as well.
 * It is template based so it is similar and familiar with the HTML5 validation API.
 *
 * https://baianat.github.io/vee-validate
 */

import Vue from 'vue';
import { ValidationProvider, ValidationObserver, configure, extend } from 'vee-validate';

// rules
import {
  required,
  max,
  excluded,
} from 'vee-validate/dist/rules';

import date from '@/plugins/veeValidate/rules/date';
import dateMin from '@/plugins/veeValidate/rules/dateMin';
import dateMax from '@/plugins/veeValidate/rules/dateMax';
import emails from '@/plugins/veeValidate/rules/emails';

configure({});

// turn on rules
extend('required', required);
extend('max', max);
extend('date', date);
extend('dateMin', dateMin);
extend('dateMax', dateMax);
extend('emails', emails);
extend('excluded', excluded);

// define validation components globally
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
