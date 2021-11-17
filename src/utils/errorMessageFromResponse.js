/**
 * Lodash functions
 * @see https://lodash.com/docs
 */
import _isString from 'lodash/isString';
import _isArray from 'lodash/isArray';
import _isObject from 'lodash/isObject';

export default (e) => {
  let { message } = e;
  const { response: { data } = {} } = e;

  if (data) {
    if (_isString(data)) {
      message = data;
    } else if (_isArray(data)) {
      [message] = data;
    } else if (_isObject(data)) {
      message = data[Object.keys(data)[0]];
    }
  }

  return message;
};
