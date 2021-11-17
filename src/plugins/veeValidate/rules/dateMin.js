import dayjs from '@/plugins/dayjs';

export default {
  validate(value, { min, format = null, locale = null }) {
    if (!min) {
      return true;
    }

    let minDate = dayjs(min);
    const date = dayjs(value, format, locale);

    if (!minDate.isValid()) {
      minDate = dayjs(min, format, locale);
    }

    return date.isAfter(minDate);
  },
  params: ['min', 'format', 'locale', 'strict'],
};
