import dayjs from '@/plugins/dayjs';

export default {
  validate(value, { format, locale = null, strict = true }) {
    const args = [value, format];

    if (locale) {
      args.push(locale);
    }

    if (strict || strict === 'true') {
      args.push(true);
    }

    return dayjs(...args).isValid();
  },
  params: ['format', 'locale', 'strict'],
};
