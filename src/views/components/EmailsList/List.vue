<template>
  <VRow>
    <VCol cols="12">
      <template>
        <VDataTable :headers="headers"
                    :items="emailsLists"
                    :loading="loading"
                    :loading-text="$t('Common.loading')"
                    :options.sync="options"
                    :server-items-length="total"
                    :sort-by="sortBy"
                    :sort-desc="sortDesc"
                    :no-data-text="$t('Common.noData')"
                    hide-default-footer>
          <template v-slot:item.icon>
            <VIcon medium
                   color="#FDD835">
              mdi-format-list-bulleted-square
            </VIcon>
          </template>

          <template v-slot:item.description="{ item }">
            {{ $tc('EmailsList.List.emailsCount', item.emails.length, { count: item.emails.length }) }}
          </template>

          <template v-slot:item.actions="{ item }">
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
                    {{ $t('EmailsList.List.edit') }}
                  </VListItemTitle>
                </VListItem>

                <VListItem @click="remove(item)">
                  <VListItemTitle>
                    <VIcon>
                      mdi-delete
                    </VIcon>
                    {{ $t('EmailsList.List.remove') }}
                  </VListItemTitle>
                </VListItem>
              </VList>
            </VMenu>
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
// Models
import EmailsList from '@/models/EmailsList';

export default {
  /**
   * The name of the loaded component.
   * @see https://vuejs.org/v2/api/#name
   */
  name: 'Dashboard.Lists',

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

      emailsLists: [],

      options: {},

      // pagination
      page: 1,
      perPage: 10,
      total: 0,
      lastPage: 1,

      // table
      headers: [
        { value: 'icon', sortable: false, align: 'left' },
        { text: this.$t('EmailsList.List.title'), value: 'title' },
        { text: this.$t('EmailsList.List.description'), value: 'description', sortable: false },
        { value: 'actions', sortable: false, align: 'right' },
      ],

      // sorting
      sortBy: ['title'],
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
        this.fetch();
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
        this.emailsLists = [];

        const { sortBy = this.sortBy, sortDesc = [this.sortDesc] } = this.options;

        const sort = {};

        sortBy.forEach((v, k) => {
          sort[v] = sortDesc[k] ? 'desc' : 'asc';
        });

        this.emailsLists = await EmailsList.$http.list({
          data: { sort, page: this.page, perPage: this.perPage },
        });
        this.total = this.emailsLists.total;
        this.lastPage = this.emailsLists.lastPage;
      } catch (e) {
        this.$emit('error', e);
      }

      this.loading = false;
    },

    async edit(item) {
      item.setMark('loading', true);

      const { id } = item;
      await this.$router.push({ name: 'EmailsListEditPage', params: { id } });
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

          if (await EmailsList.$http.delete({ params: { id } })) {
            this.emailsLists.splice(this.emailsLists.indexOf(item), 1);
            this.$emit('remove', item);
          }
        }
      } catch (e) {
        e.message = (e.response) ? e.response.data : e.message;
        this.$emit('error', e);
      }

      item.setMark('loading', false);
    },
  },
};
</script>
