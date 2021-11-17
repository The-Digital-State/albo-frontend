import dayjs from '@/plugins/dayjs';

export default {
  validate(value, { max, format = null, locale = null }) {
    if (!max) {
      return true;
    }

    let maxDate = dayjs(max);
    const date = dayjs(value, format, locale);

    if (!maxDate.isValid()) {
      maxDate = dayjs(max, format, locale);
    }

    return date.isBefore(maxDate);
  },
  params: ['max', 'format', 'locale', 'strict'],
};
