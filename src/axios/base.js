import axios from 'axios';
import qs from 'qs';

export default () => axios.create({
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
});
