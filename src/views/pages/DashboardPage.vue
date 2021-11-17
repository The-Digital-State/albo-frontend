<template>
  <VContainer fill-width
              fluid
              class="pa-0">
    <div class="d-flex flex-column flex-grow-1">
      <div class="tabs-wr">
        <VTabs v-model="tabIndex"
               centered
               @change="onTabChange">
          <VTab>
            <span>{{ $t('DashboardPage.voting') }}</span>
          </VTab>
          <VTab>{{ $t('DashboardPage.lists') }}</VTab>
        </VTabs>
        <VCol cols="10"
              offset="1"
              class="position-relative">
          <VBtn v-show="tabIndex === 0"
                :to="{name: 'PollCreatePage'}"
                class="v-btn--absolute"
                color="primary"
                rounded>
            {{ $t('DashboardPage.addPoll') }}
          </VBtn>

          <VBtn v-show="tabIndex === 1"
                :to="{name: 'EmailsListCreatePage'}"
                class="v-btn--absolute"
                color="primary"
                rounded>
            {{ $t('DashboardPage.addEmailsList') }}
          </VBtn>
        </VCol>
      </div>
      <VCol cols="10" offset="1">
        <VTabsItems v-model="tabIndex">
          <VTabItem>
            <PollList @remove="onPollRemove"
                      @error="onError"/>
          </VTabItem>
          <VTabItem>
            <EmailsListList @remove="onEmailsListRemove"
                            @error="onError"/>
          </VTabItem>
        </VTabsItems>
      </VCol>
    </div>
  </VContainer>
</template>

<script>
// Components
import PollList from '@/views/components/Poll/List';
import EmailsListList from '@/views/components/EmailsList/List';

export default {
  /**
   * The name of the page.
   * @see https://vuejs.org/v2/api/#name
   */
  name: 'DashboardPage',

  /**
   * The components that the page can use.
   * @see https://vuejs.org/v2/guide/components-registration.html
   */
  components: {
    PollList,
    EmailsListList,
  },

  /**
   * The data that can be used by the component.
   * @returns {Object} The view-model data.
   */
  data() {
    return {
      tabIndex: 0,
    };
  },

  /**
   * Computed Properties
   * @see https://vuejs.org/v2/guide/computed.html#Computed-Properties
   */
  computed: {
  },

  /**
   * The meta data(title, tags, e.t.c).
   * @see https://github.com/declandewet/vue-meta#step-3-start-defining-metainfo
   */
  meta() {
    return {
      title: this.$i18n.t('DashboardPage.title'),
    };
  },

  /**
   * Used when a custom watchers is needed for a properties
   * @see https://vuejs.org/v2/api/#watch
   */
  watch: {
    '$route.query': {
      immediate: true,
      handler(newValue, oldValue) {
        const { tab: newTab } = newValue || {};
        const { tab: oldTab } = oldValue || {};

        if (newTab !== oldTab) {
          this.tabIndex = (newTab === 'polls') ? 0 : 1;
        }
      },
    },
  },

  /**
   * Called synchronously after the instance is created
   * @see https://vuejs.org/v2/api/#created
   */
  created() {
    const { query: { tab } = {} } = this.$route;

    if (tab) {
      this.tabIndex = (tab === 'polls') ? 0 : 1;
    }
  },

  /**
   * The methods the page can use.
   * @see https://vuejs.org/v2/api/#methods
   */
  methods: {
    onTabChange(index) {
      const tab = (index === 0) ? 'polls' : 'emails-lists';
      this.$router.replace({ query: { tab } });
    },

    onPollRemove() {
      this.$toastr.success(
        this.$t('DashboardPage.pollRemoved'),
        this.$t('Common.success'),
      );
    },

    onEmailsListRemove() {
      this.$toastr.success(
        this.$t('DashboardPage.emailsListRemoved'),
        this.$t('Common.success'),
      );
    },

    onError(e) {
      this.$toastr.error(e.message, this.$t('Common.error'));

      // eslint-disable-next-line no-console
      console.error(e);
    },
  },
};
</script>

<style scoped lang="scss">
.tabs-wr {
  position: relative;

  .v-btn--absolute {
    left: 0;
    top: size(-19);
  }
}
</style>
