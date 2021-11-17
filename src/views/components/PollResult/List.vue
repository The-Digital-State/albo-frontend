<template>
  <div>
    <VContainer class="light-grey">
      <VRow>
        <VCol cols="6">
          <VTextField v-model="q"
                      :label="$t('PollResult.List.search')"
                      outlined
                      dense
                      prepend-inner-icon="mdi-magnify"
                      @input="debounceSearch">
          </VTextField>
        </VCol>
        <VCol cols="6"
              class="text-right">
          <!--          <VBtn :disabled="true"-->
          <!--                class="blue&#45;&#45;font-text">Скачать XLS-->
          <!--          </VBtn>-->
        </VCol>
      </VRow>
    </VContainer>
    <div class="px-4">
      <VDataTable :headers="headers"
                  :items="items"
                  :loading="loading"
                  :loading-text="$t('Common.loading')"
                  :server-items-length="total"
                  :no-data-text="$t('Common.noData')"
                  item-key="token"
                  hide-default-footer>
      </VDataTable>
      <template v-if="!isLastPage">
        <VDivider></VDivider>
        <div class="d-flex justify-center mt-6">
          <VBtn color="primary"
                @click="showMore">
            {{ $('PollResult.List.showMore') }}
          </VBtn>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
/**
 * Lodash functions
 * @see https://lodash.com/docs
 */
import _debounce from 'lodash/debounce';

// models
import Poll from '@/models/Poll';
import PollResult from '@/models/PollResult';

export default {
  /**
   * The name of the loaded component.
   * @see https://vuejs.org/v2/api/#name
   */
  name: 'PollResult.List',

  /**
   * The input properties(HTML attributes)
   * @see https://vuejs.org/v2/guide/components-props.html
   */
  props: {
    poll: {
      type: Poll,
      validator(v) {
        return !!v.id;
      },
      required: true,
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
    return {
      loading: false,

      q: '',
      results: [],

      // pagination
      page: 1,
      perPage: 10,
      total: 0,
      lastPage: 1,

      // table
      headers: [
        { text: this.$t('PollResult.List.token'), align: 'start', sortable: false, value: 'token' },
        { text: this.$t('PollResult.List.choice'), sortable: false, value: 'choice', align: 'end' },
      ],

      items: [],
    };
  },

  /**
   * Computed Properties
   * @see https://vuejs.org/v2/guide/computed.html#Computed-Properties
   */
  computed: {
    isLastPage() {
      return this.page === this.lastPage;
    },

    choices() {
      const choices = [];

      this.poll.question.options.forEach((option, index) => {
        choices[option] = index + 1;
      });

      return choices;
    },

    debounceSearch() {
      return _debounce(() => this.search(), 500);
    },
  },

  /**
   * Used when a custom watchers is needed for a properties
   * @see https://vuejs.org/v2/api/#watch
   */
  watch: {
    q(v) {
      if (!v) {
        this.items = this.results;
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
   * The methods the page can use.
   * @see https://vuejs.org/v2/api/#methods
   */
  methods: {
    async init() {
      await this.fetch();
    },

    async fetch() {
      this.loading = true;

      try {
        const results = await PollResult.$http.list({
          params: { pollId: this.poll.id },
          data: { page: this.page, perPage: this.perPage },
        });

        this.total = results.total;
        this.lastPage = results.lastPage;

        this.results = [
          ...this.results,
          ...results.map(({ id, token, choice }) => ({ id, token, choice: this.choices[choice] })),
        ];

        this.items = this.results;
      } catch (e) {
        this.$emit('error', e);
      }

      this.loading = false;
    },

    async search() {
      this.loading = true;

      try {
        if (this.q) {
          try {
            const result = await PollResult.$http.get({ params: { pollId: this.poll.id, token: this.q } });
            result.choice = this.choices[result.choice];

            this.items = [result];
          } catch (e) {
            this.items = [];
          }
        }
      } catch (e) {
        this.$emit('error', e);
      }

      this.loading = false;
    },

    showMore() {
      this.page += 1;
      this.fetch();
    },
  },
};
</script>
