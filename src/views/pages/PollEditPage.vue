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

    <PollForm :poll="poll"
              @update="onUpdate"
              @publish="onPublish"
              @remove="onRemove"
              @error="onError"/>
  </div>
</template>

<script>
// Components
import PollForm from '@/views/components/Poll/Form';

// Models
import Poll from '@/models/Poll';

let poll = null;

export default {
  /**
   * The name of the page.
   * @see https://vuejs.org/v2/api/#name
   */
  name: 'PollEditPage',

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
      poll,

      breadcrumbs: [
        {
          text: this.$t('DashboardPage.title'),
          disabled: false,
          to: { name: 'DashboardPage' },
        },
      ],
    };
  },

  /**
   * Before route enter hook
   * @see https://router.vuejs.org/guide/advanced/navigation-guards.html#in-component-guards
   */
  async beforeRouteEnter(to, from, next) {
    poll = await Poll.$http.get({ params: { id: to.params.id } });

    next((vm) => {
      vm.poll = poll;
    });
  },

  /**
   * Before route update hook
   * Trigger when route changes and this component is already rendered
   * @see https://router.vuejs.org/guide/advanced/navigation-guards.html#in-component-guards
   */
  async beforeRouteUpdate(to, from, next) {
    this.poll = await Poll.$http.get({ params: { id: to.params.id } });

    next();
  },

  /**
   * Called synchronously after the instance is created
   * @see https://vuejs.org/v2/api/#created
   */
  created() {
    this.breadcrumbs.push({
      text: this.poll.title,
      disabled: true,
    });
  },

  /**
   * The meta data(title, tags, e.t.c).
   * @see https://github.com/declandewet/vue-meta#step-3-start-defining-metainfo
   */
  meta() {
    return {
      title: this.$i18n.t('PollEditPage.title', { title: poll.title }),
    };
  },

  /**
   * The methods the component can use
   * @see https://vuejs.org/v2/api/#methods
   */
  methods: {
    onUpdate() {
      this.$toastr.success(this.$t('PollEditPage.updated'), this.$t('Common.success'));
    },

    onPublish() {
      this.$toastr.success(this.$t('PollEditPage.published'), this.$t('Common.success'));
    },

    onRemove() {
      this.$toastr.success(this.$t('PollEditPage.removed'), this.$t('Common.success'));
      this.$router.push({ name: 'DashboardPage' });
    },

    onError(e) {
      this.$toastr.error(e.message, this.$t('Common.error'));

      // eslint-disable-next-line no-console
      console.error(e);
    },
  },
};
</script>
