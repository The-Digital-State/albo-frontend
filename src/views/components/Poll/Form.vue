<template>
  <!-- eslint-disable max-len -->
  <VCol cols="8" offset="2">
    <VAlert text
            color="info"
            type="info"
            :icon=false
            v-model="infoMessage">
      <div class="d-flex align-start pa-2">
        <VIcon class="grey--text text--darken-4 mr-5 mt-1">mdi-information-outline</VIcon>
        <div>
          <h6 class="text-h6 font-weight-medium text--darken-4 grey--text mb-3">
            {{ $t('Poll.Form.infoTitle') }}
          </h6>

          <p class="grey--text text--darken-3">{{ $t('Poll.Form.infoParagraph1') }}</p>
          <p class="grey--text text--darken-3">{{ $t('Poll.Form.infoParagraph2') }}</p>
          <p class="grey--text text--darken-3">{{ $t('Poll.Form.infoParagraph3') }}</p>

          <VRow>
            <VCol class="shrink">
              <VBtn outlined
                    class="text-uppercase primary"
                    v-if="infoMessage"
                    @click="hideInfoMessage">
                {{ $t('Common.gotIt') }}
              </VBtn>
            </VCol>
          </VRow>
        </div>
      </div>
    </VAlert>
    <ValidationObserver ref="pollVObserver"
                        tag="div"
                        v-slot="{valid: pollValid, invalid: pollInvalid}">

      <!--Title-->
      <ValidationProvider ref="titleVProvider"
                          rules="required|max:200"
                          :name="$t('Poll.Form.title')"
                          tag="div"
                          v-slot="{ errors }">
        <VTextField v-model="entity.title"
                    :error-messages="errors"
                    :label="$t('Poll.Form.title')"
                    :readonly="entity.$isPublished"
                    background-color="white"
                    class="poll-title"
                    height="78"
                    solo
                    @input="$emit('update:title', $event)"/>
        <div class="vertical-line mt-n1"></div>
      </ValidationProvider>

      <VExpansionPanels v-model="panel"
                        :readonly="false"
                        multiple>

        <!--Description, Short Description , Start Date, End Date-->
        <VExpansionPanel>
          <ValidationObserver tag="div"
                              v-slot="{ valid, invalid }">
            <VExpansionPanelHeader class="panel_header">
              <div class="d-flex">
                <VIcon v-show="valid"
                       class="mr-3"
                       color="green">
                  mdi-check-circle
                </VIcon>
                <VIcon v-show="invalid"
                       class="mr-3">
                  mdi-checkbox-blank-circle-outline
                </VIcon>
                <div>
                  <div class="font-weight-bold heading-panel">
                    {{ $t('Poll.Form.description') }}
                  </div>
                  <div class="heading-description mt-2 text--darken-1 grey--text">
                    {{ $t('Poll.Form.descriptionSubtitle') }}
                  </div>
                </div>
              </div>
            </VExpansionPanelHeader>
            <VExpansionPanelContent>
              <VForm>
                <VContainer>
                  <VRow>
                    <VCol cols="12">
                      <ValidationProvider rules="required|max:1500"
                                          :name="$t('Poll.Form.description')"
                                          tag="div">
                        <VTextarea v-model="entity.description"
                                   :counter="1500"
                                   :label="$t('Poll.Form.description')"
                                   :readonly="entity.$isPublished"
                                   auto-grow
                                   background-color="grey lighten-5"
                                   filled/>
                      </ValidationProvider>
                    </VCol>

                    <VCol cols="12">
                      <ValidationProvider rules="required|max:350"
                                          :name="$t('Poll.Form.shortDescription')"
                                          tag="div"
                                          v-slot="{ failedRules }">
                        <VTextarea v-model="entity.shortDescription"
                                   :counter="350"
                                   :label="$t('Poll.Form.shortDescription')"
                                   :messages="$t('Poll.Form.shortDescriptionHint')"
                                   :error-messages="getVErrors(failedRules)"
                                   auto-grow
                                   background-color="grey lighten-5"
                                   filled
                                   required/>
                      </ValidationProvider>
                    </VCol>
                    <VCol cols="6"
                          class="d-inline-flex">
                      <ValidationProvider :rules="startRules"
                                          :name="$t('Poll.Form.start')"
                                          tag="div"
                                          class="d-flex flex-grow-1"
                                          v-slot="{ failedRules }">
                        <VTextField v-model="start"
                                    :label="$t('Poll.Form.start')"
                                    :messages="$t('Poll.Form.startHint', { date: $dayjs('2021-01-01 08:08').format($options.DATE_FORMAT) })"
                                    :error-messages="getVErrors(failedRules)"
                                    append-icon="mdi-calendar-week"
                                    background-color="grey lighten-5"
                                    filled
                                    required
                                    @click:append="$refs.startPicker.opened = true">
                        </VTextField>
                      </ValidationProvider>

                      <DateTimePicker ref="startPicker"
                                      v-model="start"
                                      type="datetime"
                                      :format="$options.DATE_FORMAT"
                                      :parser="(date)=>($dayjs(date, $options.DATE_FORMAT, $i18n.locale ) )"
                                      :max-datetime="startMaxDate"/>
                    </VCol>
                    <VCol cols="6"
                          class="d-inline-flex">
                      <ValidationProvider :rules="endRules"
                                          :name="$t('Poll.Form.start')"
                                          tag="div"
                                          class="d-flex flex-grow-1"
                                          v-slot="{ failedRules }">
                        <VTextField v-model="end"
                                    :label="$t('Poll.Form.end')"
                                    :messages="$t('Poll.Form.endHint', { date: $dayjs('2021-01-02 08:08').format($options.DATE_FORMAT) })"
                                    :error-messages="getVErrors(failedRules)"
                                    append-icon="mdi-calendar-week"
                                    background-color="grey lighten-5"
                                    filled
                                    required
                                    @click:append="$refs.endPicker.opened = true">
                        </VTextField>
                        <DateTimePicker ref="endPicker"
                                        v-model="end"
                                        type="datetime"
                                        :format="$options.DATE_FORMAT"
                                        :parser="(date)=>($dayjs(date, $options.DATE_FORMAT, $i18n.locale ) )"
                                        :min-datetime="endMinDate"/>
                      </ValidationProvider>
                    </VCol>
                  </VRow>
                  <p class="hint-message mb-0 mt-1">
                    {{ $t('Poll.Form.dateHint') }}
                  </p>
                </VContainer>
              </VForm>
            </VExpansionPanelContent>
          </ValidationObserver>
        </VExpansionPanel>

        <!--Question & options-->
        <VExpansionPanel class="mt-4">
          <div class="vertical-line mt-n3"></div>
          <ValidationObserver tag="div"
                              v-slot="{ valid: questionValid, invalid: questionInvalid }">
            <VExpansionPanelHeader class="panel_header">
              <div class="d-flex">
                <VIcon v-show="questionValid"
                       class="mr-3"
                       color="green">
                  mdi-check-circle
                </VIcon>
                <VIcon v-show="questionInvalid"
                       class="mr-3">
                  mdi-checkbox-blank-circle-outline
                </VIcon>
                <div>
                  <div class="font-weight-bold heading-panel">
                    {{ $t('Poll.Form.questions') }}
                  </div>
                  <div class="heading-description mt-2 text--darken-1 grey--text">
                    {{ $t('Poll.Form.questionsSubtitle') }}
                  </div>
                </div>
              </div>
            </VExpansionPanelHeader>
            <VExpansionPanelContent>
              <VForm>
                <VContainer>
                  <VRow>
                    <VCol cols="12">
                      <ValidationProvider rules="required|max:500"
                                          :name="$t('Poll.Form.question')"
                                          tag="div"
                                          v-slot="{ failedRules }">
                        <VTextField v-model="entity.question.title"
                                    :label="$t('Poll.Form.question')"
                                    :counter="500"
                                    :error-messages="getVErrors(failedRules)"
                                    background-color="grey lighten-5"
                                    filled/>
                      </ValidationProvider>
                    </VCol>
                    <VCol v-for="(option, i) in entity.question.options" :key="`option-${i}`"
                          cols="12"
                          class="pb-0 pt-0">
                      <ValidationProvider :rules="{ required: true, max:200, excluded: excludedRuleForOption(i) }"
                                          :name="$t('Poll.Form.option', { number: i+1 })"
                                          tag="div"
                                          v-slot="{ failedRules, valid: optionValid }">
                        <div class="d-flex flex-nowrap align-start">
                          <VTextField v-model="entity.question.options[i]"
                                      :label="$t('Poll.Form.option', { number: i+1 })"
                                      :error-messages="getVErrors(failedRules)"
                                      background-color="grey lighten-5"
                                      filled>
                            <template v-slot:append>
                              <VIcon v-if="optionValid && entity.question.options[i]"
                                     slot="append"
                                     color="green">
                                mdi-check
                              </VIcon>
                            </template>
                          </VTextField>
                          <VBtn v-if="entity.question.options.length > 2"
                                icon
                                @click="removeQuestionOption(i)"
                                class="mt-3">
                            <VIcon color="black">
                              mdi-delete-outline
                            </VIcon>
                          </VBtn>
                        </div>
                      </ValidationProvider>
                    </VCol>
                    <VCol cols="12">
                      <VBtn @click="addQuestionOption()"
                            color="primary">
                        {{ $t('Poll.Form.optionAdd') }}
                      </VBtn>
                    </VCol>
                  </VRow>
                </VContainer>
              </VForm>
            </VExpansionPanelContent>
          </ValidationObserver>

        </VExpansionPanel>

        <!--Settings-->
        <VExpansionPanel class="mt-4">
          <div class="vertical-line mt-n3"></div>
          <ValidationObserver tag="div"
                              v-slot="{ valid, invalid }">
            <VExpansionPanelHeader class="panel_header">
              <div class="d-flex">
                <VIcon v-show="valid"
                       class="mr-3"
                       color="green">
                  mdi-check-circle
                </VIcon>
                <VIcon v-show="invalid"
                       class="mr-3">
                  mdi-checkbox-blank-circle-outline
                </VIcon>
                <div>
                  <div class="font-weight-bold heading-panel">
                    {{ $t('Poll.Form.settingsTitle') }}
                  </div>
                  <div class="heading-description mt-2 text--darken-1 grey--text">
                    {{ $t('Poll.Form.settingsSubtitle') }}
                  </div>
                </div>
              </div>
            </VExpansionPanelHeader>
            <VExpansionPanelContent>
              <VForm>
                <VContainer>
                  <!--                  <VRow v-if="false">-->
                  <!--                    <VCol cols="12">-->
                  <!--                      <VRadioGroup v-model="pollType"-->
                  <!--                                   active-class="selected_r"-->
                  <!--                                   class="radios__wr mt-0"-->
                  <!--                                   mandatory>-->
                  <!--                        <VRow>-->
                  <!--                          <VCol cols="6">-->
                  <!--                            <VRadio value="list">-->
                  <!--                              <template v-slot:label>-->
                  <!--                                <div>-->
                  <!--                                  <strong class="radio_t">-->
                  <!--                                    {{ $t('Poll.Form.votingOnLists ') }}-->
                  <!--                                  </strong>-->
                  <!--                                  <div class="radio_desc">-->
                  <!--                                    {{ $t('Poll.Form.votingOnListsHint') }}-->
                  <!--                                  </div>-->
                  <!--                                </div>-->
                  <!--                              </template>-->
                  <!--                            </VRadio>-->
                  <!--                          </VCol>-->
                  <!--                          <VCol cols="6">-->
                  <!--                            <VRadio value="free">-->
                  <!--                              <template v-slot:label>-->
                  <!--                                <div>-->
                  <!--                                  <strong class="radio_t">-->
                  <!--                                    {{ $t('Poll.Form.freeVoting') }}-->
                  <!--                                  </strong>-->
                  <!--                                  <div class="radio_desc">-->
                  <!--                                    {{ $t('Poll.Form.freeVotingHint') }}-->
                  <!--                                  </div>-->
                  <!--                                </div>-->
                  <!--                              </template>-->
                  <!--                            </VRadio>-->
                  <!--                          </VCol>-->
                  <!--                        </VRow>-->
                  <!--                      </VRadioGroup>-->
                  <!--                    </VCol>-->
                  <!--                  </VRow>-->
                  <VRow>
                    <VCol>
                      <div v-if="pollType === 'list'"
                           class="voting_lists">
                        <div v-if="!entity.$isPublished"
                             class="voting_lists__h">
                          <div class="subtitle-cond">
                            {{ $t('Poll.Form.chooseList') }}
                          </div>
                          <div class="voting_lists__btns">
                            <VBtn color="primary"
                                  class="mr-3"
                                  :loading="loading.emailsLists"
                                  @click="fetchEmailLists">
                              {{ $t('Poll.Form.updateList') }}
                            </VBtn>
                            <RouterLink :to="{ name: 'EmailsListCreatePage' }"
                                        v-slot="{ href, navigate }"
                                        custom>
                              <VBtn :href="href"
                                    target="_blank"
                                    @click="navigate"
                                    color="primary">
                                {{ $t('Poll.Form.newList') }}
                              </VBtn>
                            </RouterLink>

                          </div>
                        </div>
                        <div class="voting_lists__b grey lighten-4">
                          <div v-if="!loading.emailsLists && !emailsLists.length">
                            <p class="pt-4 pl-5">{{ $t('Poll.Form.noList') }}</p>
                          </div>

                          <ValidationProvider rules="required"
                                              :name="$t('Poll.Form.list')"
                                              tag="div"
                                              v-slot="{ failedRules }">
                            <VRadioGroup v-model="entity.emailsListId"
                                         :readonly="entity.$isPublished"
                                         :error-messages="getVErrors(failedRules)">
                              <VRadio v-for="emailsList in emailsLists" :key="`list-${emailsList.id}`"
                                      :value="emailsList.id"
                                      class="mb-0">
                                <template v-slot:label>
                                  <VContainer>
                                    <VRow class="align-center">
                                      <VCol cols="1">
                                        <VIcon class="yellow--text text--darken-1">mdi-view-list</VIcon>
                                      </VCol>
                                      <VCol cols="3">
                                        <strong class="list-title grey--text text--darken-4">
                                          {{ emailsList.title }}
                                        </strong>
                                      </VCol>
                                      <VCol cols="7">
                                        {{
                                          $tc('Poll.Form.listUserCount', emailsList.emails.length, { count: emailsList.emails.length })
                                        }}
                                      </VCol>
                                    </VRow>
                                  </VContainer>
                                </template>
                              </VRadio>
                            </VRadioGroup>
                          </ValidationProvider>
                        </div>
                      </div>
                      <!--                      <div v-else>-->
                      <!--                        <VAlert class="alert-info alert-custom pa-8"-->
                      <!--                                icon="mdi-information">-->
                      <!--                          <p>Если вы хотите ограничить круг людей доступных для голосования, создайте “Голосование по-->
                      <!--                            спискам” и-->
                      <!--                            импортируйте список в голосование.</p>-->
                      <!--                          <VBtn color="primary">Мои списки</VBtn>-->
                      <!--                        </VAlert>-->
                      <!--                      </div>-->
                    </VCol>
                  </VRow>
                </VContainer>
              </VForm>
            </VExpansionPanelContent>
          </ValidationObserver>
        </VExpansionPanel>

        <template v-if="!entity.$isPublished">
          <div class="vertical-line mt-n3"></div>
          <div class="save-voting__wr v-expansion-panel pa-5 mt-5">
            <div class="panel_header align-center justify-md-space-between d-flex flex-grow-1">
              <VBtn text
                    color="primary"
                    @click="save(false)"
                    :loading="loading.init || loading.save">
                {{ $t('Poll.Form.save') }}
              </VBtn>
              <div class="d-flex align-center">
                <div v-if="entity.updatedAt">
                  {{ $t('Poll.Form.lastSave') }}
                  <span>{{ $dayjs(entity.updatedAt).format($options.DATE_FORMAT) }}</span>
                </div>
                <div class="ml-10">
                  <VTooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <VIcon
                        class="grey--text text--darken-3"
                        v-bind="attrs"
                        v-on="on">
                        mdi-help-circle-outline
                      </VIcon>
                    </template>
                    <span>{{ $t('Poll.Form.saveHint') }}</span>
                  </VTooltip>
                </div>
              </div>
            </div>
          </div>

          <VExpansionPanel class="mt-0"
                           :disabled="pollInvalid">
            <VExpansionPanelHeader>
              <div class="d-flex justify-space-between align-center pt-3 pb-3">
                <div class="d-inline-flex align-center">
                  <VIcon v-show="entity.$isPublished"
                         class="mr-3"
                         color="green">
                    mdi-check-circle
                  </VIcon>
                  <VIcon v-show="!entity.$isPublished"
                         class="mr-3">
                    mdi-checkbox-blank-circle-outline
                  </VIcon>
                  <div class="font-weight-bold heading-panel">
                    {{ $t('Poll.Form.publication') }}
                  </div>
                </div>
                <div class="d-inline-flex align-center validation_passed">
                  <div v-if="pollValid"
                       class="heading-description text--darken-1 green--text">
                    {{ $t('Poll.Form.publicationAllowed') }}
                  </div>
                  <template v-else>
                    <div class="heading-description text--darken-1 grey--text">
                      {{ $t('Poll.Form.fillRequirements') }}
                    </div>
                    <VIcon class="ml-10">
                      mdi-lock-outline
                    </VIcon>
                  </template>
                </div>
              </div>
            </VExpansionPanelHeader>
            <VExpansionPanelContent>
              <VContainer>
                <VRow>
                  <VCol cols="12">
                    <div class="orange lighten-5 pa-6">
                      <VIcon color="#FB8C00"
                             class="pr-1">mdi-alert
                      </VIcon>
                      <strong>Важно!</strong>
                      <p>Вы не сможете изменить или удалить голосование после публикации. Пожалуйста проверьте все на
                        правильность
                        еще раз.</p>
                    </div>
                    <div class="pt-4">
                      <VBtn color="info"
                            class="text-uppercase"
                            :loading="loading.init || loading.save"
                            @click="save(true)">
                        {{ $t('Poll.Form.publishBtn') }}
                      </VBtn>
                    </div>
                  </VCol>
                </VRow>
              </VContainer>
            </VExpansionPanelContent>
          </VExpansionPanel>
        </template>

        <div v-if="entity.$isPublished"
             class="save-voting__wr v-expansion-panel mt-5">
          <div class="vertical-line mt-n3 hidden-line"></div>
          <div class="panel_header align-center justify-md-space-between d-flex flex-grow-1">
            <div class="d-flex flex-grow-1 justify-space-between align-center v-expansion-panel-header">
              <div class="d-inline-flex">
                <VIcon class="mr-3"
                       color="green">
                  mdi-check-circle
                </VIcon>
                <div>
                  <div class="font-weight-bold heading-panel">
                    {{ $t('Poll.Form.published') }}
                  </div>

                  <div class="heading-description mt-2 text--darken-1 grey--text">
                    {{ $t('Poll.Form.publishedAt', { date: $dayjs(entity.publishedAt).format($options.DATE_FORMAT) }) }}
                  </div>
                </div>
              </div>

              <RouterLink :to="{ name: 'PollPreviewPage', params: { id: entity.id } }"
                          class="text-right">
                <VIcon class="grey--text text--darken-3">
                  mdi-open-in-new
                </VIcon>
              </RouterLink>
            </div>
          </div>
        </div>

        <VExpansionPanel class="mt-0"
                         :disabled="!entity.$isPublished">
          <VExpansionPanelHeader :hide-actions="true">
            <div class="d-flex justify-space-between align-center pt-3 pb-3">
              <div class="d-inline-flex align-center">
                <VIcon class="mr-3">mdi-alert-circle-outline</VIcon>
                <div class="font-weight-bold heading-panel">
                  {{ $t('Poll.Form.instructions') }}
                </div>
              </div>
              <div v-if="!entity.$isPublished"
                   class="d-inline-flex align-center">
                <div class="heading-description text--darken-1 grey--text">
                  {{ $t('Poll.Form.publish') }}
                </div>
                <VIcon class="ml-10">
                  mdi-lock-outline
                </VIcon>
              </div>

              <VTooltip v-else
                        bottom>
                <template v-slot:activator="{ on, attrs }">
                  <VIcon
                    class="grey--text text--darken-3"
                    v-bind="attrs"
                    v-on="on">
                    mdi-help-circle-outline
                  </VIcon>
                </template>
                <span>{{ $t('Poll.Form.instructionsHint') }}</span>
              </VTooltip>
            </div>
          </VExpansionPanelHeader>
          <VExpansionPanelContent>
            <VRow>
              <VCol cols="12">
                <h2 class="text-h6">{{ $t('Poll.Form.whatNext') }}</h2>
                <p v-html="$t('Poll.Form.whatNextDescription')"></p>
                <RouterLink :to="{ name: 'PollPreviewPage', params: { id: entity.id } }"
                            class="copy-link--b grey lighten-4 d-flex justify-space-between pa-5 mb-10"
                            v-slot="{ href, navigate }"
                            custom>
                  <a :href="href"
                     target="_blank"
                     @click="navigate">{{ host }}{{ href }}</a>
                  <span @click="copy(`${host}${href}`)">
                    {{ $t('Common.copy') }}
                  </span>
                </RouterLink>
              </VCol>
            </VRow>
          </VExpansionPanelContent>
        </VExpansionPanel>
      </VExpansionPanels>
      <VBtn v-if="entity.$isExists && !entity.$isPublished"
            :loading="loading.remove"
            text
            color="primary"
            class="float-right mt-4 mb-4"
            @click="remove">
        {{ $t('Poll.Form.remove') }}
      </VBtn>
      <VTooltip v-else
                bottom>
        <template v-slot:activator="{ on, attrs }">
          <VBtn text
                class="float-right mt-4 mb-4"
                disabled
                v-bind="attrs"
                v-on="on">
            {{ $t('Poll.Form.remove') }}
          </VBtn>
        </template>
        <span>{{ $t('Poll.Form.disabledRemove') }}</span>
      </VTooltip>
    </ValidationObserver>
  </VCol>
</template>

<script>
import copy from 'copy-to-clipboard';

/**
 * Lodash functions
 * @see https://lodash.com/docs
 */
import _omit from 'lodash/omit';
import _get from 'lodash/get';
import _toArray from 'lodash/toArray';

// Models
import Poll from '@/models/Poll';
import EmailsList from '@/models/EmailsList';

// Components
import DateTimePicker from '@/views/components/DateTimePicker';

export default {
  /**
   * The name of the loaded component
   * @see https://vuejs.org/v2/api/#name
   */
  name: 'Poll.Form',

  /**
   * The components that the component can use
   * @see https://vuejs.org/v2/guide/components-registration.html
   */
  components: {
    DateTimePicker,
  },

  /**
   * The input properties(HTML attributes)
   * @see https://vuejs.org/v2/guide/components-props.html
   */
  props: {
    poll: {
      type: Poll,
      default() {
        return null;
      },
    },
  },

  /**
   * The options that can be used by the component
   * @see https://ru.vuejs.org/v2/api/index.html#vm-options
   * @returns {Object} The view-model options.
   */
  DATE_FORMAT: process.env.VUE_APP_DATE_FORMAT,

  /**
   * The data that can be used by the component
   * @returns {Object} The view-model data.
   */
  data() {
    return {
      loading: {
        init: false,
        save: false,
        publish: false,
        emailsLists: false,
        remove: false,
      },

      entity: new Poll(),

      pollType: 'list',

      validationStrict: false,

      emailsLists: [],

      infoMessage: true,

      panel: [],

      host: window.location.origin,
    };
  },

  /**
   * Computed Properties
   * @see https://vuejs.org/v2/guide/computed.html#Computed-Properties
   */
  computed: {
    start: {
      get() {
        const date = this.$dayjs(this.entity.start);
        return (date.isValid()) ? date.format(process.env.VUE_APP_DATE_FORMAT) : this.entity.start;
      },
      set(value) {
        const date = this.$dayjs(value, process.env.VUE_APP_DATE_FORMAT, this.$i18n.locale, true);
        this.entity.start = (date.isValid()) ? this.$dayjs(date).toJSON() : value;
      },
    },

    startRules() {
      const format = process.env.VUE_APP_DATE_FORMAT;
      const { locale } = this.$i18n;
      const min = this.$dayjs().format(format);

      const rules = {
        required: true,
        date: { format, locale },
        dateMax: { min, format, locale },
      };

      if (this.entity.end) {
        const end = this.$dayjs(this.entity.end);

        if (end.isValid()) {
          rules.dateMax = { max: this.end, format, locale };
        }
      }

      return rules;
    },

    startMaxDate() {
      const date = this.$dayjs(this.entity.end);
      return (date.isValid()) ? date.subtract(1, 'hour') : null;
    },

    end: {
      get() {
        const date = this.$dayjs(this.entity.end);
        return (date.isValid()) ? date.format(process.env.VUE_APP_DATE_FORMAT) : this.entity.end;
      },
      set(value) {
        const date = this.$dayjs(value, process.env.VUE_APP_DATE_FORMAT, this.$i18n.locale, true);
        this.entity.end = (date.isValid()) ? this.$dayjs(date).toJSON() : value;
      },
    },

    endRules() {
      const format = process.env.VUE_APP_DATE_FORMAT;
      const { locale } = this.$i18n;

      const rules = {
        required: true,
        date: { format, locale },
      };

      if (this.entity.start) {
        const start = this.$dayjs(this.entity.start);

        if (start.isValid()) {
          rules.dateMin = { min: this.start, format, locale };
        }
      }

      return rules;
    },

    endMinDate() {
      const date = this.$dayjs(this.entity.start);
      return (date.isValid()) ? date.add(1, 'hour') : null;
    },
  },

  /**
   * Used when a custom watchers is needed for a properties
   * @see https://vuejs.org/v2/api/#watch
   */
  watch: {
    poll: {
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
    copy,

    async init() {
      try {
        this.loading.init = true;

        this.infoMessage = localStorage.getItem('polls.infoMessage') !== 'false';

        this.entity = (this.poll) ? this.poll.clone() : new Poll();

        this.panel = this.entity.$isPublished ? [3] : [0, 1, 2];

        if (!this.entity.question.options.length) {
          this.entity.question.options.push('', '');
        }

        await this.fetchEmailLists();
      } catch (e) {
        this.$emit('error', e);
      }

      this.loading.init = false;
    },

    async fetchEmailLists() {
      this.loading.emailsLists = true;

      try {
        this.emailsLists = await EmailsList.$http.list();
      } catch (e) {
        this.$emit('error', e);
      }

      this.loading.emailsLists = false;
    },

    addQuestionOption() {
      this.entity.question.options.push('');
    },

    excludedRuleForOption(index) {
      const options = _get(this.entity, 'question.options', []);
      return [...options.slice(0, index), ...options.slice(index + 1)];
    },

    removeQuestionOption(index) {
      this.entity.question.options.splice(index, 1);
    },

    hideInfoMessage() {
      this.infoMessage = false;
      localStorage.setItem('polls.infoMessage', 'false');
    },

    async save(publish = false) {
      // published poll cannot be changed
      if (this.entity.$isPublished) {
        return;
      }

      this.loading.save = true;

      try {
        const valid = (publish)
          ? await this.$refs.pollVObserver.validate()
          : (await this.$refs.titleVProvider.validate()).valid;

        if (valid) {
          const isExists = this.entity.$isExists;

          await this.entity.$http.save({ data: { publish } });

          if (publish) {
            this.panel.push(3);
            this.$emit('publish', this.entity);
          }

          this.$emit((isExists) ? 'update' : 'create', this.entity);
          this.$emit('save', this.entity);
        } else {
          this.$toastr.error(this.$t('Common.fillRequiredFields'), this.$t('Common.error'));
        }
      } catch (e) {
        this.$emit('error', e);
      }

      this.loading.save = false;
    },

    async remove() {
      this.loading.save = true;
      this.loading.publish = true;
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
          if (await Poll.$http.delete({ params: { id: this.entity.id } })) {
            this.$emit('remove', this.entity);
          }
        }
      } catch (e) {
        this.$emit('error', e);
      }

      this.loading.save = false;
      this.loading.publish = false;
      this.loading.remove = false;
    },

    getVErrors(failedRules) {
      return _toArray(_omit(failedRules, this.validationStrict ? '' : 'required'));
    },
  },
};
</script>

<style lang="scss">

.vertical-line {
  background: $light-grey-c-5;
  border-radius: size(4);
  height: size(8);
  margin: 0 0 size(3) size(35);
  width: size(2);
}

.v-alert .v-alert__icon {
  color: $light-grey-c;
}

.poll-title.v-input {
  font-size: size(24);

  &.error--text {
    .v-text-field__details {
      display: flex;
    }
  }

  .v-text-field__details {
    display: none;
  }

  .v-label {
    font-size: size(24);
    color: $light-grey-c-2;
  }
}

.heading-description {
  font-size: size(14);
}

.heading-panel {
  letter-spacing: size(.05);
  line-height: size(24);
}

.panel_header.v-expansion-panel-header {
  padding: size(18) size(28);
}

.save-voting__wr {
  border-bottom: 1px solid $light-grey-c-5;
  font-size: $sm-font-size;
}

.subtitle-cond {
  font-family: $font-family-condensed;
  font-size: size(20);
  font-weight: 700;
  text-transform: uppercase;
}

.radios__wr {
  .v-radio {
    align-items: flex-start;
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

    .radio_t {
      color: $blue-c;
    }
  }
}

.radio_t {
  display: block;
  padding-bottom: size(5);
}

.radio_desc {
  font-size: $sm-font-size;
  line-height: size(24);
}

.voting_lists {
  border: 1px solid $light-grey-c-5;
  border-radius: $border-radius;
}

.voting_lists__h {
  display: flex;
  justify-content: space-between;
  padding: size(22) size(24);
}

.voting_lists__b {
  .v-radio {
    flex-direction: row-reverse;
    border-top: 1px solid $light-grey-c-5;
    padding-right: size(12);
  }

  .v-input {
    margin-top: 0;
    padding-top: 0;

    .v-label {
      color: $secondary-c;
      font-size: $sm-font-size;
    }
  }

  .v-messages {
    display: none;
  }

  .v-input__slot {
    margin-bottom: 0;
  }
}

.alert-info.alert-custom {
  background-color: $light-yellow-c;
  border-radius: $border-radius;

  .v-alert__icon {
    color: #FDD835;
  }
}

.hint-message {
  color: $secondary-c;
  font-size: $sm-font-size;
}
</style>
