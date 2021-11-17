<template>
  <VMain>
    <LoadingOverlay :active="loading.init"
                    class="primary-loading"/>

    <template v-if="poll">
      <VContainer fluid
                  class="px-0 pt-0 pb-8 ma-0 white"
                  fill-width>
        <VRow>
          <VCol cols="8"
                offset="2">
            <div>
              <VContainer justify="space-between">
                <VRow>
                  <VCol>
                    <div class="mt-8 mb-4 mx-lg-auto">
                      <h1 class="font-weight-regular">
                        {{ poll.title }}
                      </h1>
                    </div>
                  </VCol>
                </VRow>
                <VRow>
                  <VCol v-if="isActive"
                        cols="3">
                    <div class="blue lighten-5 text-center rounded py-2">
                    <span class="blue--text darken-1">
                      {{ $t('PollPreviewPage.votingInProcess') }}
                    </span>
                    </div>
                  </VCol>
                  <VCol v-else-if="isFinished"
                        cols="3">
                    <div class="green lighten-5 text-center rounded py-2">
                    <span class="green--text darken-1">
                      {{ $t('PollPreviewPage.votingFinished') }}
                    </span>
                    </div>
                  </VCol>
                  <VCol v-else
                        cols="3">
                    <div class="orange lighten-5 text-center rounded py-2">
                    <span class="orange--text darken-1">
                      {{ $t('PollPreviewPage.votingWillStartSoon') }}
                    </span>
                    </div>
                  </VCol>
                </VRow>
                <VRow>
                  <VCol cols="3">
                    <div class="font-weight-medium">
                      {{ start }}
                    </div>
                    <div>{{ $t('PollPreviewPage.start') }}</div>
                  </VCol>
                  <VCol cols="3"
                        class="mr-10">
                    <div class="font-weight-medium">
                      {{ end }}
                    </div>
                    <div>{{ $t('PollPreviewPage.end') }}</div>
                  </VCol>
                  <!--                <VCol cols="1"-->
                  <!--                      align="right">-->
                  <!--                  <VBtn icon>-->
                  <!--                    <VIcon>mdi-share-variant-outline</VIcon>-->
                  <!--                  </VBtn>-->
                  <!--                </VCol>-->
                  <!--                <VCol cols="1"-->
                  <!--                      align="right">-->
                  <!--                  <VBtn icon>-->
                  <!--                    <VIcon>mdi-dots-vertical</VIcon>-->
                  <!--                  </VBtn>-->
                  <!--                </VCol>-->
                </VRow>
              </VContainer>
            </div>
          </VCol>
        </VRow>
      </VContainer>
      <VContainer fluid
                  fill-width
                  class="pa-0 ma-0 white">
        <VRow>
          <VCol cols="8"
                offset="2">
            <VTabs v-model="tab"
                   grow
                   class="pa-4">
              <VTab ripple
                    href="#description"
                    class="text-h6">
                {{ $t('PollPreviewPage.description') }}
              </VTab>
              <VTab ripple
                    href="#results"
                    class="text-h6">
                {{ $t('PollPreviewPage.results') }}
              </VTab>
            </VTabs>
            <VTabsItems v-model="tab">
              <VTabItem key="tab-description"
                        value="description"
                        class="pt-9">
                <VCard class="mx-auto rounded-lg"
                       justify="space-between"
                       outlined>

                  <template v-if="isAuthenticated">
                    <template v-if="!isFinished && voter.invited && !voter.voted">
                      <VRow class="px-6 py-5 orange lighten-5 mb-0">
                        <VCol cols="8">
                          <div class="d-flex">
                            <VIcon class="pr-4"
                                   color="#FB8C00">mdi-message-alert
                            </VIcon>
                            {{ $t('PollPreviewPage.weNeedYourVote') }}
                          </div>
                        </VCol>
                      </VRow>

                      <VDivider class="pb-4"></VDivider>
                    </template>

                    <template v-if="!voter.invited">
                      <VRow class="px-6 py-5">
                        <VCol cols="8"
                              align="left">
                          <div>
                            <VIcon color="blue"
                                   class="px-4">mdi-lock
                            </VIcon>
                            {{ $t('PollPreviewPage.yourAreNotInvited') }}
                          </div>
                        </VCol>
                      </VRow>
                      <VDivider class="pb-4"></VDivider>
                    </template>
                  </template>

                  <template v-else-if="!isFinished">
                    <VRow class="px-6 py-5">
                      <VCol cols="8"
                            align="left">
                        <div>
                          <VIcon color="blue"
                                 class="pr-4">mdi-account
                          </VIcon>
                          {{ $t('PollPreviewPage.signIn') }}
                        </div>
                      </VCol>
                      <VCol cols="4"
                            class="text-right">
                        <VBtn ref="loginBtn"
                              @click="login"
                              color="grey darken-3"
                              class="text-none pa-md-6 white--text">
                          <VIcon class="px-2">mdi-microsoft</VIcon>
                          {{ $t('PollPreviewPage.signInMicrosoft') }}
                        </VBtn>
                        <AzurePopup ref="azurePopup"/>
                      </VCol>
                    </VRow>

                    <VDivider></VDivider>
                  </template>

                  <VRow class="px-6 py-5">
                    <VCol>
                      <div class="font-weight-medium text-h6">
                        {{ statistic.voted }}
                      </div>
                      <div>{{ $t('PollPreviewPage.statisticVoted') }}</div>
                    </VCol>

                    <VCol v-if="!isFinished">
                      <CountDownTimer :start="poll.start"
                                      :end="poll.end"
                                      :label-to-start="$t('PollPreviewPage.timeToStart')"
                                      :label-to-end="$t('PollPreviewPage.timeToEnd')"
                                      @started="onPollStarted"
                                      @ended="onPollFinished"></CountDownTimer>
                    </VCol>

                    <VCol v-if="isAuthenticated && voter.invited && !voter.voted"
                          class="text-right">
                      <RouterLink :to="{ name: 'PollVotePage', params: { id: poll.id } }"
                                  :disabled="!isActive"
                                  custom
                                  v-slot="{ navigate }">
                        <VBtn color="primary"
                              :disabled="!isActive"
                              class="text-uppercase pa-md-6"
                              @click="navigate">
                          {{ $t('PollPreviewPage.vote') }}
                        </VBtn>
                      </RouterLink>
                    </VCol>

                    <VCol v-else
                          class="text-right">
                      <VBtn color="primary"
                            outlined
                            class="text-uppercase pa-md-6"
                            @click="tab = 'results'">
                        {{ $t('PollPreviewPage.results') }}
                      </VBtn>
                    </VCol>
                  </VRow>

                  <template v-if="isAuthenticated && voter.voted">
                    <VDivider></VDivider>

                    <VRow class="px-6 py-5 green lighten-5 rounded-b">
                      <VCol cols="12">
                        <div class="d-flex">
                          <VIcon class="pr-4"
                                 color="#43A047">mdi-vote
                          </VIcon>
                          {{ $t('PollPreviewPage.voted') }}
                        </div>
                      </VCol>
                    </VRow>
                  </template>
                </VCard>

                <div class="py-9">
                  <h2 class="font-weight-regular">
                    {{ $t('PollPreviewPage.description') }}
                  </h2>
                  <div class="pt-4"
                       v-html="poll.description">
                  </div>
                </div>

                <VDivider></VDivider>

                <div class="py-9">
                  <h2 class="font-weight-regular">
                    {{ $t('PollPreviewPage.condition') }}
                  </h2>
                  <div class="pt-4"
                       v-html="$t('PollPreviewPage.conditionDescription')">
                  </div>
                </div>

                <VCard outlined>
                  <VContainer class="pa-4">
                    <VRow class="pa-4">
                      <div>{{ $t('PollPreviewPage.voting') }}</div>
                    </VRow>
                    <VRow class="pa-4">
                      <h1 class="font-weight-regular">
                        {{ poll.question.title }}
                      </h1>
                    </VRow>
                    <VRow>
                      <VCol cols="12">
                        <PollOptions :poll="poll"
                                     :statistic="statistic"
                                     :statistic-full="false"></PollOptions>
                      </VCol>
                    </VRow>
                  </VContainer>
                </VCard>
              </VTabItem>

              <VTabItem key="tab-results"
                        value="results">
                <div class="pa-4 ma-4">
                  <VCard outlined
                         class="pa-4">
                    <VContainer class="pa-4">
                      <VRow class="pa-4">
                        <h1 class="font-weight-regular">
                          {{ poll.question.title }}
                        </h1>
                      </VRow>
                      <VRow class="px-4">
                        <div v-if="!isFinished">
                          <VAlert
                            dense
                            text
                            type="info">
                            {{ $t('PollPreviewPage.resultsAfterFinished') }}
                          </VAlert>
                        </div>
                      </VRow>
                      <VRow v-if="isFinished">
                        <VCol cols="12">
                          <PollOptions :poll="poll"
                                       :statistic="statistic"
                                       :statistic-full="true"></PollOptions>
                        </VCol>
                      </VRow>
                    </VContainer>
                  </VCard>
                  <VCard class="pa-4 mt-8">
                    <VCardTitle>
                      <h3 class="font-weight-regular">
                        {{ $t('PollPreviewPage.statistic') }}
                      </h3>
                    </VCardTitle>
                    <VContainer>
                      <VRow v-if="isFinished">
                        <VCol cols="4">
                          <div class="grey--text">
                            {{ $t('PollPreviewPage.statisticVoted') }}
                          </div>
                          <h3 class="font-weight-regular">
                            {{ statistic.voted }}
                          </h3>
                        </VCol>
                        <VCol cols="4">
                          <div class="grey--text">
                            {{ $t('PollPreviewPage.statisticAll') }}
                          </div>
                          <h3 class="font-weight-regular">
                            {{ statistic.all }}
                          </h3>
                        </VCol>
                        <VCol cols="4">
                          <div class="grey--text">
                            {{ $t('PollPreviewPage.statisticNotVoted') }}
                          </div>
                          <h3 class="font-weight-regular">
                            {{ statistic.all - statistic.voted }}
                          </h3>
                        </VCol>
                      </VRow>
                      <VRow v-if="!isFinished">
                        <VCol>
                          <VIcon>mdi-chart-bar</VIcon>
                          {{ $t('PollPreviewPage.statisticAfterFinished') }}
                        </VCol>
                      </VRow>
                    </VContainer>
                  </VCard>
                  <VCard class="pa-4 mt-8"
                         outlined>
                    <VCardTitle>
                      <h3 class="font-weight-regular">
                        {{ $t('PollPreviewPage.historyResults') }}
                      </h3>
                    </VCardTitle>
                    <VContainer class="light-grey">
                      <PollResultList v-if="isFinished"
                                      :poll="poll"/>
                      <div v-else>
                        <VIcon>mdi-file-chart</VIcon>
                        {{ $t('PollPreviewPage.historyResultsAfterFinished') }}
                      </div>
                    </VContainer>
                  </VCard>
                </div>
              </VTabItem>
            </VTabsItems>
          </VCol>
        </VRow>
      </VContainer>
    </template>
  </VMain>
</template>

<script>
/**
 * The mapState helper
 * @see https://vuex.vuejs.org/guide/state.html#the-mapstate-helper
 */
import { mapGetters } from 'vuex';

// components
import LoadingOverlay from 'vue-loading-overlay';
import CountDownTimer from '@/views/components/CountDownTimer';
import AzurePopup from '@/views/components/Auth/AzurePopup';
import PollResultList from '@/views/components/PollResult/List';
import PollOptions from '@/views/components/Poll/Options';

// models
import Poll from '@/models/Poll';

export default {
  /**
   * The name of the page.
   * @see https://vuejs.org/v2/api/#name
   */
  name: 'PollPreviewPage',

  /**
   * The input properties(HTML attributes)
   * @see https://vuejs.org/v2/guide/components-props.html
   */
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
  },

  /**
   * The input properties(HTML attributes)
   * @see https://vuejs.org/v2/guide/components-props.html
   */
  components: {
    AzurePopup,
    CountDownTimer,
    PollResultList,
    PollOptions,
    LoadingOverlay,
  },

  /**
   * The data that can be used by the component.
   * @returns {Object} The view-model data.
   */
  data() {
    return {
      loading: {
        init: false,
        auth: false,
      },

      poll: null,
      voter: { invited: false, canVote: false, voted: false },
      statistic: {
        all: null,
        voted: 0,
        votedByChoice: null,
      },

      isActive: false,
      isFinished: false,

      tab: 'description',
    };
  },

  /**
   * Computed Properties
   * @see https://vuejs.org/v2/guide/computed.html#Computed-Properties
   */
  computed: {
    ...mapGetters({
      isAuthenticated: 'auth/authenticated',
    }),

    start() {
      const start = this.$dayjs(this.poll.start);
      return start.isValid() ? start.format(process.env.VUE_APP_DATE_FORMAT) : '';
    },

    end() {
      const end = this.$dayjs(this.poll.end);
      return end.isValid() ? end.format(process.env.VUE_APP_DATE_FORMAT) : '';
    },
  },

  /**
   * The meta data(title, tags, e.t.c).
   * @see https://github.com/declandewet/vue-meta#step-3-start-defining-metainfo
   */
  meta() {
    const { title } = this.poll || {};

    return {
      title: this.$i18n.t('PollPreviewPage.title', { title }),
    };
  },

  /**
   * Used when a custom watchers is needed for a properties
   * @see https://vuejs.org/v2/api/#watch
   */
  watch: {
    isActive(v) {
      if (v) {
        this.isFinished = false;
      }
    },

    async isFinished(v) {
      if (v) {
        this.isActive = false;
      }
    },
  },

  /**
   * Called synchronously after the instance is created
   * @see https://vuejs.org/v2/api/#created
   */
  created() {
    this.init();
  },

  /**
   * The methods the component can use.
   * @see https://vuejs.org/v2/api/#methods
   */
  methods: {
    async init() {
      this.loading.init = true;

      try {
        this.poll = await Poll.$http.view({ params: { id: this.id } });

        this.isActive = this.poll.$isActive;
        this.isFinished = this.poll.$isFinished;

        if (this.isAuthenticated) {
          this.voter = await this.$api.canVote(this.poll.id);
        }

        this.statistic = await this.$api.statistic(this.poll.id);
      } catch (e) {
        this.$toastr.error(e.message, this.$t('Common.error'));
      }

      this.loading.init = false;
    },

    async login() {
      const { loginBtn } = this.$refs;

      loginBtn.loading = true;

      try {
        await this.$store.dispatch('auth/login', await this.$refs.azurePopup.login());
        await this.init();
      } catch (e) {
        this.$toastr.error(e.message, this.$t('Common.error'));
      }

      loginBtn.loading = false;
    },

    async onPollStarted() {
      this.isActive = true;
      this.voter = await this.$api.canVote(this.poll.id);
    },

    onPollFinished() {
      this.isFinished = true;
    },
  },
};
</script>
