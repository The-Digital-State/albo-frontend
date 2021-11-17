<template>
  <VRow>
    <VCol cols="8"
          offset="2"
          class="pb-0">
      <VBreadcrumbs :items="breadcrumbs">
        <template v-slot:divider>
          <VIcon>mdi-chevron-right</VIcon>
        </template>
      </VBreadcrumbs>
    </VCol>

    <EmailsListForm @create="onCreate"
                    @error="onError"/>
  </VRow>
</template>
<script>
// Components
import EmailsListForm from '@/views/components/EmailsList/Form';

// Utils
import errorMessageFromResponse from '@/utils/errorMessageFromResponse';

export default {
  /**
   * The name of the page.
   * @see https://vuejs.org/v2/api/#name
   */
  name: 'EmailsListCreatePage',

  /**
   * The components that the page can use.
   * @see https://vuejs.org/v2/guide/components-registration.html
   */
  components: {
    EmailsListForm,
  },

  /**
   * The data that can be used by the component.
   * @returns {Object} The view-model data.
   */
  data() {
    return {
      breadcrumbs: [
        {
          text: this.$t('DashboardPage.title'),
          disabled: false,
          to: { name: 'DashboardPage', query: { tab: 'emails-lists' } },
        },
        {
          text: this.$t('EmailsListCreatePage.title'),
          disabled: true,
        },
      ],
    };
  },

  /**
   * The meta data(title, tags, e.t.c).
   * @see https://github.com/declandewet/vue-meta#step-3-start-defining-metainfo
   */
  meta() {
    return {
      title: this.$i18n.t('EmailsListCreatePage.title'),
    };
  },

  /**
   * The methods the component can use
   * @see https://vuejs.org/v2/api/#methods
   */
  methods: {
    onCreate(emailsList) {
      this.$toastr.success(this.$t('EmailsListCreatePage.created'), this.$t('Common.success'));
      this.$router.push({ name: 'EmailsListEditPage', params: { id: emailsList.id } });
    },

    onError(e) {
      this.$toastr.error(errorMessageFromResponse(e), this.$t('Common.error'));

      // eslint-disable-next-line no-console
      console.error(e);
    },
  },
};
</script>

<style scoped lang="scss">
</style>
