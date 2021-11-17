<template>
  <!-- eslint-disable max-len -->
  <VCol cols="8" offset=2>
    <ValidationObserver ref="mainObs"
                        tag="div">

      <!--Title-->
      <ValidationProvider ref="titleVProvider"
                          rules="required|max:200"
                          :name="$t('EmailsList.Form.title')"
                          tag="div"
                          v-slot="{ errors }">
        <VTextField v-model="entity.title"
                    :label="$t('EmailsList.Form.title')"
                    :error-messages="errors"
                    background-color="white"
                    class="list-title"
                    height="78"
                    solo
                    @input="$emit('update:title', $event)"/>
      </ValidationProvider>

      <VCard>
        <div class="font-weight-bold heading-panel pa-4">
          {{ $t('EmailsList.Form.list') }}
        </div>
        <hr role="separator" aria-orientation="horizontal" class="v-divider theme--light">
        <VContainer>
          <VRow>
            <VCol>
              <VFlex xs12 class="px-8 pt-4 shrink">
                <ValidationProvider ref="inputEmailsVProvider"
                                    rules="emails"
                                    :name="$t('EmailsList.Form.emails')"
                                    tag="div"
                                    v-slot="{ errors }">
                  <VCombobox v-model="inputEmails"
                             multiple
                             :label="$t('EmailsList.Form.inputEmails')"
                             :error-messages="errors"
                             append-icon
                             chips
                             dense
                             filled
                             clearable
                             hide-selected
                             deletable-chips
                             :hint="$t('EmailsList.Form.inputEmailsHint')"
                             class="tag-input">
                  </VCombobox>
                </ValidationProvider>
              </VFlex>
            </VCol>
          </VRow>
          <VRow>
            <VCol>
              <VBtn class="mx-8 blue white--text"
                    :disabled="!inputEmails.length"
                    @click="addEmails">
                {{ $t('EmailsList.Form.add') }}
              </VBtn>
            </VCol>
          </VRow>

          <VRow>
            <VCol>
              <VCard class="mx-8"
                     fill-width>

                <VDataTable v-if="items.length"
                            :headers="headers"
                            :items="items"
                            hide-default-header
                            class="elevation-1 my-4"
                            :search="search">
                  <template v-slot:top>
                    <VRow>
                      <VCol cols="4">
                        <VTextField v-model="search"
                                    :label="$t('EmailsList.Form.search')"
                                    class="mx-4"></VTextField>
                      </VCol>
                      <VCol class="mt-6 mx-n4 text-right"
                            cols="8">
                        {{ $t('EmailsList.Form.count', { count: items.length }) }}
                      </VCol>
                    </VRow>
                  </template>
                  <template v-slot:item.email="{ item }">
                    <div>
                      <VIcon class="mr-4">mdi-at</VIcon>
                      {{ item.email }}
                    </div>
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <VIcon small
                           @click="removeEmail(item)">mdi-delete
                    </VIcon>
                  </template>
                </VDataTable>
                <div v-else
                     class="ma-4 pa-4">
                  <ValidationProvider rules="required"
                                      :name="$t('EmailsList.Form.emails')"
                                      tag="div"
                                      v-slot="{ errors }">
                    <input type="hidden"
                           :value="items">
                    <div :class="{ 'error--text': errors.length }">
                      <VIcon>mdi-at</VIcon>
                      {{ $t('EmailsList.Form.noVotersAdded') }}
                    </div>
                  </ValidationProvider>
                </div>
              </VCard>
            </VCol>
          </VRow>
        </VContainer>
      </VCard>
      <VCard class="mt-8 pa-4">
        <VContainer>
          <VRow>
            <VCol cols="5">
              <VBtn class="blue white--text"
                    :disabled="entity.$isExists && !isChanged"
                    :loading="loading.save"
                    @click="save">
                {{ $t('EmailsList.Form.saveList') }}
              </VBtn>
            </VCol>
            <VCol cols="5"
                  offset="1"
                  class="grey--text">
              <template v-if="entity.$isExists">
                {{ $t('EmailsList.Form.lastSaved', { date: $dayjs(entity.updatedAt).format(DATE_FORMAT) }) }}
              </template>
            </VCol>
            <VCol cols="1">
              <VIcon>mdi-help-circle</VIcon>
            </VCol>
          </VRow>
        </VContainer>
      </VCard>

      <div v-if="entity.$isExists"
           class="text-right ma-8">
        <VBtn class="grey--text"
              :loading="loading.remove"
              @click="remove">
          {{ $t('EmailsList.Form.remove') }}
        </VBtn>
      </div>
    </ValidationObserver>
  </VCol>
</template>

<script>
// models
import EmailsList from '@/models/EmailsList';

export default {
  /**
   * The name of the loaded component
   * @see https://vuejs.org/v2/api/#name
   */
  name: 'EmailsList.Form',

  /**
   * The components that the component can use
   * @see https://vuejs.org/v2/guide/components-registration.html
   */
  components: {},

  /**
   * The input properties(HTML attributes)
   * @see https://vuejs.org/v2/guide/components-props.html
   */
  props: {
    emailsList: {
      type: EmailsList,
      default() {
        return null;
      },
    },
  },

  /**
   * The data that can be used by the component
   * @returns {Object} The view-model data.
   */
  data() {
    return {
      loading: {
        init: false,
        save: false,
        remove: false,
      },

      DATE_FORMAT: process.env.VUE_APP_DATE_FORMAT,

      entity: new EmailsList(),
      inputEmails: [],
      search: '',
      headers: [
        {
          align: 'start',
          sortable: true,
          value: 'email',
        },
        {
          value: 'actions',
          sortable: false,
          align: 'end',
        },
      ],
      items: [],
    };
  },

  /**
   * Computed Properties
   * @see https://vuejs.org/v2/guide/computed.html#Computed-Properties
   */
  computed: {
    isChanged() {
      return this.entity.changed();
    },
  },

  /**
   * Used when a custom watchers is needed for a properties
   * @see https://vuejs.org/v2/api/#watch
   */
  watch: {
    emailsList: {
      deep: true,
      handler() {
        this.init();
      },
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
   * The methods the component can use
   * @see https://vuejs.org/v2/api/#methods
   */
  methods: {
    async init() {
      this.loading.init = true;

      try {
        this.entity = (this.emailsList) ? this.emailsList.clone() : new EmailsList();
        this.items = this.entity.emails.map((email) => ({ email }));
      } catch (e) {
        this.$emit('error', e);
      }

      this.loading.init = false;
    },

    async addEmails() {
      try {
        const { inputEmailsVProvider } = this.$refs;

        const { valid } = await inputEmailsVProvider.validate();

        if (valid) {
          const emails = new Set(this.entity.emails);

          this.inputEmails.forEach((v) => {
            emails.add(v);
          });

          this.entity.emails = [...emails];
          this.items = this.entity.emails.map((email) => ({ email }));

          this.inputEmails = [];
        }
      } catch (e) {
        this.$emit('error', e);
      }
    },

    async save() {
      this.loading.save = true;

      try {
        const valid = await this.$refs.mainObs.validate();

        if (valid) {
          const isExists = this.entity.$isExists;

          await this.entity.$http.save();
          this.$emit((isExists) ? 'update' : 'create', this.entity);
          this.$emit('save', this.entity);
        }
      } catch (e) {
        this.$emit('error', e);
      }

      this.loading.save = false;
    },

    removeEmail(item) {
      this.items.splice(this.items.indexOf(item), 1);
      this.entity.emails = this.items.map(({ email }) => email);
    },

    async remove() {
      this.loading.remove = true;

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
          if (await EmailsList.$http.delete({ params: { id: this.entity.id } })) {
            this.$emit('remove', this.entity);
          }
        }
      } catch (e) {
        this.$emit('error', e);
      }

      this.loading.remove = false;
    },
  },
};
</script>
