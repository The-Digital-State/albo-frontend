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

    <EmailsListForm :emailsList="emailsList"
                    @update="onUpdate"
                    @remove="onRemove"
                    @error="onError"/>
  </VRow>
</template>
<script>
// Components
import EmailsListForm from '@/views/components/EmailsList/Form';

// Models
import EmailsList from '@/models/EmailsList';

// Utils
import errorMessageFromResponse from '@/utils/errorMessageFromResponse';

let emailsList = null;

export default {
  /**
   * The name of the page.
   * @see https://vuejs.org/v2/api/#name
   */
  name: 'EmailsListEditPage',

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
      emailsList,

      breadcrumbs: [
        {
          text: this.$t('DashboardPage.title'),
          disabled: false,
          to: { name: 'DashboardPage', query: { tab: 'emails-lists' } },
        },
      ],
    };
  },

  /**
   * Before route enter hook
   * @see https://router.vuejs.org/guide/advanced/navigation-guards.html#in-component-guards
   */
  async beforeRouteEnter(to, from, next) {
    emailsList = await EmailsList.$http.get({ params: { id: to.params.id } });

    next((vm) => {
      vm.emailsList = emailsList;
    });
  },

  /**
   * Before route update hook
   * Trigger when route changes and this component is already rendered
   * @see https://router.vuejs.org/guide/advanced/navigation-guards.html#in-component-guards
   */
  async beforeRouteUpdate(to, from, next) {
    this.emailsList = await EmailsList.$http.get({ params: { id: to.params.id } });

    next();
  },

  /**
   * Called synchronously after the instance is created
   * @see https://vuejs.org/v2/api/#created
   */
  created() {
    this.breadcrumbs.push({
      text: this.emailsList.title,
      disabled: true,
    });
  },

  /**
   * The meta data(title, tags, e.t.c).
   * @see https://github.com/declandewet/vue-meta#step-3-start-defining-metainfo
   */
  meta() {
    return {
      title: this.$i18n.t('EmailsListEditPage.title', { title: emailsList.title }),
    };
  },

  /**
   * The methods the component can use
   * @see https://vuejs.org/v2/api/#methods
   */
  methods: {
    onUpdate() {
      this.$toastr.success(this.$t('EmailsListEditPage.updated'), this.$t('Common.success'));
    },

    onRemove() {
      this.$toastr.success(this.$t('EmailsListEditPage.removed'), this.$t('Common.success'));
      this.$router.push({ name: 'DashboardPage', query: { tab: 'emails-lists' } });
    },

    onError(e) {
      this.$toastr.error(errorMessageFromResponse(e), this.$t('Common.error'));

      // eslint-disable-next-line no-console
      console.error(e);
    },
  },
};
</script>
