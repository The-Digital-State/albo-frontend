<template>
  <VCol class="d-flex justify-center flex-column align-center"
        cols="4"
        offset="4">
    <div class="white pa-10 mb-4 text-center login_container">
      <h1 class="text-h5 text-center font-weight-medium mb-9">{{ $t('LoginPage.authorization') }}</h1>
      <VBtn color="grey darken-3"
            class="text-none pa-md-6 white--text"
            :loading="loading"
            @click="loginByAzure">
        <VIcon class="px-2">mdi-microsoft</VIcon>
        {{ $t('LoginPage.azureSignIn') }}
      </VBtn>
    </div>
    <div class="login_info__b white--text pa-6">
      <p class="mb-0">
        На время тестирования доступна авторизация только через сервисы Microsoft.
        Позже будут добавлены и другие способы авторизации.
      </p>
    </div>
    <AzurePopup ref="azurePopup" />
  </VCol>
</template>

<script>
// components
import AzurePopup from '@/views/components/Auth/AzurePopup';

export default {
  /**
   * The name of the loaded component.
   * @see https://vuejs.org/v2/api/#name
   */
  name: 'LoginPage',

  /**
   * The components that the component can use.
   * @see https://vuejs.org/v2/guide/components-registration.html
   */
  components: {
    AzurePopup,
  },

  /**
   * The data that can be used by the component.
   * @returns {Object} The view-model data.
   */
  data() {
    return {
      loading: false,
    };
  },

  /**
   * The methods the page can use.
   * @see https://vuejs.org/v2/api/#methods
   */
  methods: {
    async loginByAzure() {
      this.loading = true;

      try {
        await this.$store.dispatch('auth/login', await this.$refs.azurePopup.login());

        const redirectTo = (localStorage.getItem('AUTH_REDIRECT_TO'))
          ? JSON.parse(localStorage.getItem('AUTH_REDIRECT_TO'))
          : { name: 'HomePage' };

        localStorage.removeItem('AUTH_REDIRECT_TO');

        await this.$router.push(redirectTo);
      } catch (e) {
        this.$toastr.error(e.message, this.$t('Common.error'));
      }

      this.loading = false;
    },
  },
};
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  border-radius: 4px;
}

.login_info__b {
  background: rgba(0, 0, 0, .06);
  border-radius: 4px;
}
</style>
