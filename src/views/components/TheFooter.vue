<template>
  <footer class="d-flex justify-space-between align-center grey lighten-5 pl-6 pr-6 pt-2 pb-2">
    <RouterLink :to="{name: 'HomePage'}"
                class="d-inline-flex ml-0">
      <img alt="Vue logo"
           class="footer_logo"
           src="@/images/logo.svg"/>
    </RouterLink>
    <nav class="nav_wr">
      <ul class="d-flex align-center">
        <li>
          <RouterLink :to="{name: 'About'}">
            {{ $t('TheFooter.about') }}
          </RouterLink>
        </li>
        <li>
          <RouterLink :to="{name: 'Feedback'}">
            {{ $t('TheFooter.feedback') }}
          </RouterLink>
        </li>
        <li>
          <RouterLink :to="{name: 'Privacy'}">
            {{ $t('TheFooter.rules') }}
          </RouterLink>
        </li>
        <li>
          <RouterLink :to="{name: 'Security'}">
            {{ $t('TheFooter.security') }}
          </RouterLink>
        </li>
        <li>
          <RouterLink :to="{name: 'Contacts'}">
            {{ $t('TheFooter.contacts') }}
          </RouterLink>
        </li>
        <li>
          <RouterLink :to="{name: 'AuthAbout'}">
            {{ $t('TheFooter.authorization') }}
          </RouterLink>
        </li>
      </ul>
    </nav>
    <!--    TODO: take current year-->
    <div class="copyright">
      &copy; {{ $dayjs().format('YYYY') }}
    </div>
  </footer>
</template>

<script>

export default {
  /**
   * The name of the loaded component.
   * @see https://vuejs.org/v2/api/#name
   */
  name: 'TheFooter',

  /**
   * The components that the component can use.
   * @see https://vuejs.org/v2/guide/components-registration.html
   */
  components: {},

  /**
   * The data that can be used by the component.
   * @returns {Object} The view-model data.
   */
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.footer_logo {
  max-width: size(35);
}

.nav_wr {
  a {
    color: $secondary-c;
    font-size: size(12);
    margin-left: size(32);
  }

  ul {
    padding-left: 0;
  }
}

.copyright {
  font-size: size(12);
  color: $secondary-c;
}
</style>
