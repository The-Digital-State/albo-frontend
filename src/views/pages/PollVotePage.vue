<template>
  <div class="d-flex flex-grow-1 mt-6">
    <LoadingOverlay :active="loading.init"
                    class="primary-loading"/>

    <VCol v-if="poll"
          cols="8"
          offset="2"
          class="pb-0">
      <template v-if="!result.token">
        <div class="d-flex align-center pa-4 grey lighten-5">
          <VIcon class="grey--text text--darken-4 mr-5">mdi-information-outline</VIcon>
          <p class="text--darken-4 grey--text mb-0">
            {{ $t('PollVotePage.cannotChangeChoice') }}
          </p>
        </div>
        <h1 class="text-h4 font-weight-medium mt-6">
          {{ poll.question.title }}
        </h1>
        <VForm>
          <VRadioGroup v-model="result.choice"
                       class="radios__wr"
                       active-class="selected_r">
            <VRadio v-for="(option, index) in  poll.question.options" :key="`option-${index}`"
                    :label="option"
                    :value="option">
              <template v-slot:label>
                <div class="d-flex justify-space-between flex-grow-1">
                  <div>{{ option }}</div>
                  <div class="select_variant text-muted">
                    {{ $t('PollVotePage.variant', { n: index + 1 }) }}
                  </div>
                </div>
              </template>
            </VRadio>
          </VRadioGroup>
          <small v-if="!result.choice">
            {{ $t('PollVotePage.chooseVariant') }}
          </small>
          <small v-else
                 v-html="$t('PollVotePage.choice', { choice: result.choice, n: choiceIndex + 1 })"
                 class="validated_option">
          </small>
          <div class="mt-3">
            <VBtn color="primary"
                  :loading="loading.vote"
                  :disabled="!result.choice"
                  @click="vote">
              {{ $t('PollVotePage.makeChoice') }}
            </VBtn>
          </div>
        </VForm>
      </template>
      <template v-else>
        <h1 class="text-h4 font-weight-medium">
          {{ $t('PollVotePage.thanks') }}
        </h1>
        <h2 class="text-h4 font-weight-medium">
          {{ $t('PollVotePage.successfullyVote') }}
        </h2>
        <div class="d-flex align-center pa-4 blue lighten-5 mt-5 mb-3">
          <VIcon class="blue--text text--darken-1 mr-5">mdi-vote</VIcon>
          <div>
            <small class="text--darken-1 blue--text">
              {{ $t('PollVotePage.choiceHeader') }}
            </small>
            <p class="mb-0"
               v-html="$t('PollVotePage.choice', { choice: result.choice, n: choiceIndex + 1 })">
            </p>
          </div>
        </div>
        <div>
          <h3 class="text-h6 mt-3 mb-1">
            {{ $t('PollVotePage.howCheckMyVoice') }}
          </h3>
          <p v-html="$t('PollVotePage.howCheckMyVoiceDescription')"></p>
          <div class="d-flex align-center justify-space-between
           blue-grey lighten-5 grey--text text--darken-3 mt-6 mb-6 pa-4">
            <div>{{ result.token }}</div>
            <VIcon @click="copy(result.token)">mdi-content-copy</VIcon>
          </div>

          <h3 class="text-h6 mt-3 mb-1 orange--text darken-1">
            {{ $t('PollVotePage.attention') }}
          </h3>
          <p v-html="$t('PollVotePage.attentionDescription')"></p>
        </div>
        <RouterLink :to="{ name: 'PollPreviewPage', params: { id: this.poll.id } }"
                    custom
                    v-slot="{ navigate }">
          <VBtn block
                class="mt-4 mb-5"
                color="primary"
                @click="navigate">
            {{ $t('PollVotePage.backToPoll') }}
          </VBtn>
        </RouterLink>
      </template>
    </VCol>
  </div>
</template>

<script>
import copy from 'copy-to-clipboard';

// components
import LoadingOverlay from 'vue-loading-overlay';

// models
import Poll from '@/models/Poll';
import PollResult from '@/models/PollResult';

export default {
  /**
   * The name of the page.
   * @see https://vuejs.org/v2/api/#name
   */
  name: 'PollVotePage',

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
   * The components that the page can use.
   * @see https://vuejs.org/v2/guide/components-registration.html
   */
  components: {
    LoadingOverlay,
  },

  /**
   * The data that can be used by the component
   * @returns {Object} The view-model data.
   */
  data() {
    return {
      loading: {
        init: false,
        vote: false,
      },

      poll: null,
      result: new PollResult(),
    };
  },

  /**
   * Computed Properties
   * @see https://vuejs.org/v2/guide/computed.html#Computed-Properties
   */
  computed: {
    choiceIndex() {
      const { question: { options = [] } = {} } = this.poll || {};
      return options.indexOf(this.result.choice);
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
   * The meta data(title, tags, e.t.c).
   * @see https://github.com/declandewet/vue-meta#step-3-start-defining-metainfo
   */
  meta() {
    const { title } = this.poll || {};

    return {
      title: this.$i18n.t('PollVotePage.title', { title }),
    };
  },

  /**
   * The methods the component can use
   * @see https://vuejs.org/v2/api/#methods
   */
  methods: {
    async init() {
      this.loading.init = true;

      try {
        this.poll = await Poll.$http.view({ params: { id: this.id } });
        this.result.pollId = this.poll.id;
      } catch (e) {
        this.$toastr.error(e.message, this.$t('Common.error'));
      }

      this.loading.init = false;
    },

    async vote() {
      this.loading.vote = true;

      try {
        if (this.result.$isExists || !this.result.choice) {
          return;
        }

        await this.result.$http.vote();
      } catch (e) {
        const { data: { message = e.message } = {} } = e.response || {};
        this.$toastr.error(message, this.$t('Common.error'));
      }

      this.loading.vote = false;
    },

    copy(value) {
      copy(value);
      this.$toastr.success(this.$t('Common.copied'));
    },
  },
};
</script>

<style lang="scss">
.radios__wr {
  .v-radio {
    align-items: center;
    border-radius: $border-radius;
    border: 1px solid $light-grey-c-5;
    padding: size(16);

    .v-label {
      color: $secondary-c;
      margin-left: size(20);
    }
  }

  .selected_r {
    background-color: $light-blue-c;
    border-color: transparent;

    .select_variant {
      color: $blue-c;
    }
  }
}

.select_variant {
  font-size: size(12);
  color: #BDBDBD;
}

.validated_option {
  color: #43A047;
}
</style>
