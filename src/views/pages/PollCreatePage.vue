<template>
  <div>
    <VCol cols="8"
          offset="2"
          class="pb-0">
      <VBreadcrumbs :items="breadcrumbs">
        <template v-slot:divider>
          <VIcon>mdi-chevron-right</VIcon>
        </template>
      </VBreadcrumbs>
    </VCol>

    <PollForm @create="onCreate"
              @error="onError"/>
  </div>
</template>

<script>
// Components
import PollForm from '@/views/components/Poll/Form';

export default {
  /**
   * The name of the page.
   * @see https://vuejs.org/v2/api/#name
   */
  name: 'PollCreatePage',

  /**
   * The components that the page can use.
   * @see https://vuejs.org/v2/guide/components-registration.html
   */
  components: {
    PollForm,
  },

  /**
   * The data that can be used by the component
   * @returns {Object} The view-model data.
   */
  data() {
    return {
      breadcrumbs: [
        {
          text: this.$t('DashboardPage.title'),
          disabled: false,
          to: { name: 'DashboardPage' },
        },
        {
          text: this.$t('PollCreatePage.title'),
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
      title: this.$i18n.t('PollCreatePage.title'),
    };
  },

  /**
   * The methods the component can use
   * @see https://vuejs.org/v2/api/#methods
   */
  methods: {
    onCreate(poll) {
      this.$toastr.success(this.$t('PollCreatePage.created'), this.$t('Common.success'));
      this.$router.push({ name: 'PollEditPage', params: { id: poll.id } });
    },

    onError(e) {
      this.$toastr.error(e.message, this.$t('Common.error'));

      // eslint-disable-next-line no-console
      console.error(e);
    },
  },
};
</script>
