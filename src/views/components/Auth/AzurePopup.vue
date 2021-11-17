<template>
  <div></div>
</template>

<script>
/**
 * MSAL library
 * @see https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser
 */
import { PublicClientApplication } from '@azure/msal-browser';

export default {
  /**
   * The name of the loaded component.
   * @see https://vuejs.org/v2/api/#name
   */
  name: 'Auth.AzurePopup',

  /**
   * The input properties(HTML attributes)
   * @see https://vuejs.org/v2/guide/components-props.html
   */
  props: {
    clientId: {
      type: String,
      default: process.env.VUE_APP_MICROSOFT_CLIENT_ID,
    },

    redirectUri: {
      type: String,
      default: window.location.origin,
    },
  },

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

  /**
   * The methods the page can use.
   * @see https://vuejs.org/v2/api/#methods
   */
  /**
   * The methods the page can use.
   * @see https://vuejs.org/v2/api/#methods
   */
  methods: {
    async login() {
      const msal = new PublicClientApplication({
        auth: { clientId: this.clientId, redirectUri: this.redirectUri },
      });

      const { accessToken } = await msal.loginPopup({ scopes: ['User.read'] });

      return this.$api.authAzure(accessToken);
    },
  },
};
</script>
