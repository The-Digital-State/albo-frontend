import i18n from '@/i18n';

export default (option, cls) => {
  const superLocale = cls.prototype.$locale;

  cls.prototype.$locale = function () {
    this.$L = i18n.locale;
    return superLocale.call(this);
  };
};
