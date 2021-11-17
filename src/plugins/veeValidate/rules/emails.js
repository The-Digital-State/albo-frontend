// rules
import { email } from 'vee-validate/dist/rules';

/**
 * Lodash functions
 * @see https://lodash.com/docs
 */
import _castArray from 'lodash/castArray';

export default {
  validate(value, ...args) {
    const emails = _castArray(value);

    return emails.every((v) => email.validate(v, ...args));
  },
};
