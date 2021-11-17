<template>
  <VRow>
    <VCol>
      <template>
        <VDataTable :headers="headers"
                    :items="polls"
                    :loading="loading"
                    :loading-text="$t('Common.loading')"
                    :options.sync="options"
                    :server-items-length="total"
                    :sort-by="sortBy"
                    :sort-desc="sortDesc"
                    :no-data-text="$t('Common.noData')"
                    hide-default-footer>

          <template v-slot:item.icon="{ item }">
            <template v-if="item.$isPublished">
              <template v-if="item.$isActive">
                <VIcon medium
                       color="#42A5F5">
                  mdi-chart-box
                </VIcon>
              </template>

              <template v-else-if="item.$isFinished">
                <VIcon medium
                       color="#66BB6A">
                  mdi-chart-box
                </VIcon>
              </template>

              <template v-else>
                <VIcon medium
                       color="#FFA726">
                  mdi-chart-box
                </VIcon>
              </template>
            </template>

            <template v-else>
              <VIcon medium
                     color="#78909C">
                mdi-chart-box
              </VIcon>
            </template>
          </template>

          <template v-slot:item.start="{ item }">
            <template v-if="item.start">
              {{ $dayjs(item.start).format('DD.MM.YYYY') }}
            </template>
          </template>

          <template v-slot:item.end="{ item }">
            <template v-if="item.end">
              {{ $dayjs(item.end).format('DD.MM.YYYY') }}
            </template>
          </template>

          <template v-slot:item.emailsList="{ item }">
            <template v-if="item.emailsList">
              {{ item.emailsList.title }}
            </template>
          </template>

          <template v-slot:item.status="{ item }">
            <template v-if="item.$isPublished">
              <template v-if="item.$isActive">
                {{ $t('Poll.List.active') }}
              </template>

              <template v-else-if="item.$isFinished">
                {{ $t('Poll.List.finished') }}
              </template>

              <template v-else>
                {{ $t('Poll.List.published') }}
              </template>
            </template>

            <template v-else>
              {{ $t('Poll.List.draft') }}
            </template>
          </template>

          <template v-slot:item.actions="{ item }">
            <template v-if="item.$isPublished">
              <RouterLink :to="{ name: 'PollPreviewPage', params: { id: item.id } }">
                <VIcon class="ml-1">
                  mdi-poll
                </VIcon>
              </RouterLink>
            </template>

            <template v-else>
              <VMenu>
                <template v-slot:activator="{ on, attrs }">
                  <VBtn icon
                        :loading="item.$marks.loading">
                    <VIcon v-bind="attrs"
                           v-on="on">
                      mdi-dots-vertical
                    </VIcon>
                  </VBtn>
                </template>

                <VList>
                  <VListItem @click="edit(item)">
                    <VListItemTitle>
                      <VIcon>
                        mdi-pencil
                      </VIcon>
                      {{ $t('Poll.List.edit') }}
                    </VListItemTitle>
                  </VListItem>

                  <VListItem @click="remove(item)">
                    <VListItemTitle>
                      <VIcon>
                        mdi-delete
                      </VIcon>
                      {{ $t('Poll.List.remove') }}
                    </VListItemTitle>
                  </VListItem>
                </VList>
              </VMenu>
            </template>
          </template>
        </VDataTable>
        <div class="text-center pt-2">
          <VPagination v-show="!loading"
                       v-model="page"
                       :length="lastPage"
                       @input="fetch"/>
        </div>
      </template>
    </VCol>
  </VRow>
</template>

<script>

// models
import Poll from '@/models/Poll';

export default {
  /**
   * The name of the loaded component.
   * @see https://vuejs.org/v2/api/#name
   */
  name: 'Poll.List',

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

      polls: [],

      options: {},

      // pagination
      page: 1,
      perPage: 10,
      total: 0,
      lastPage: 1,

      // table
      headers: [
        { value: 'icon', sortable: false, align: 'left' },
        { text: this.$t('Poll.List.title'), value: 'title' },
        { text: this.$t('Poll.List.start'), value: 'start' },
        { text: this.$t('Poll.List.end'), value: 'end' },
        { text: this.$t('Poll.List.emailsList'), value: 'emailsList', sortable: false },
        { text: this.$t('Poll.List.status'), value: 'status', sortable: false },
        { value: 'actions', sortable: false, align: 'right' },
      ],

      // sorting
      sortBy: ['start'],
      sortDesc: true,
    };
  },

  /**
   * Used when a custom watchers is needed for a properties
   * @see https://vuejs.org/v2/api/#watch
   */
  watch: {
    options: {
      async handler() {
        await this.fetch();
      },
      deep: true,
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
        this.polls = [];

        const { sortBy = this.sortBy, sortDesc = [this.sortDesc] } = this.options;

        const sort = {};

        sortBy.forEach((v, k) => {
          sort[v] = sortDesc[k] ? 'desc' : 'asc';
        });

        this.polls = await Poll.$http.list({
          data: { sort, page: this.page, perPage: this.perPage, with: ['emailsList'] },
        });
        this.total = this.polls.total;
        this.lastPage = this.polls.lastPage;
      } catch (e) {
        this.$emit('error', e);
      }

      this.loading = false;
    },

    async edit(item) {
      item.setMark('loading', true);

      const { id } = item;
      await this.$router.push({ name: 'PollEditPage', params: { id } });
      item.setMark('loading', false);
    },

    async remove(item) {
      const { id } = item;

      try {
        // ask confirmation
        const { value: answer } = await this.$swal.fire({
          title: this.$t('Common.removeConfirmationTitle'),
          html: this.$t('Common.removeConfirmationDescription'),
          confirmButtonText: this.$t('Common.removeConfirmationAccept'),
          cancelButtonText: this.$t('Common.removeConfirmationCancel'),
          icon: 'warning',
          showCancelButton: true,
        });

        if (answer) {
          item.setMark('loading', true);

          if (await Poll.$http.delete({ params: { id } })) {
            this.polls.splice(this.polls.indexOf(item), 1);
            this.$emit('remove', item);
          }
        }
      } catch (e) {
        this.$emit('error', e);
      }

      item.setMark('loading', false);
    },
  },
};
</script>
