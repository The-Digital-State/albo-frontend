<template>
  <div>
    <div v-for="(option, i) in options" :key="i"
         class="px-2 pb-4">
      <VCard outlined>
        <VContainer>
          <VRow :class="{ 'blue lighten-5': winningOption === option }">
            <VCol cols="8">
              <div class="font-weight-regular pb-1"
                   :class="{'font-weight-bold': winningOption === option }">
                {{ option }}
              </div>
              <div class="blue--text">
                {{ $t('Poll.Options.option', { number: i }) }}
              </div>
            </VCol>
            <VCol v-if="votedByChoice"
                  cols="4"
                  class="text-right options-percents">
              <span :class="{'font-weight-bold': winningOption === option }">
                {{ statisticVotedByChoicePercents(option) }}%
              </span>
              <div v-if="statisticFull"
                   class="grey--text">
                {{ $tc('Poll.Options.statisticByChoice', statistic.votedByChoice[option]) }}
              </div>
            </VCol>
          </VRow>
        </VContainer>
      </VCard>
    </div>
  </div>
</template>

<script>
/**
 * Lodash functions
 * @see https://lodash.com/docs
 */
import _get from 'lodash/get';
import _forEach from 'lodash/forEach';

// models
import Poll from '@/models/Poll';

export default {
  /**
   * The name of the loaded component.
   * @see https://vuejs.org/v2/api/#name
   */
  name: 'Poll.Options',

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

    statistic: {
      type: Object,
      default: null,
    },

    statisticFull: {
      type: Boolean,
      default: true,
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
    return {};
  },

  /**
   * Computed Properties
   * @see https://vuejs.org/v2/guide/computed.html#Computed-Properties
   */
  computed: {
    options() {
      return _get(this.poll, 'question.options', []);
    },

    voted() {
      return _get(this.statistic, 'voted', 0);
    },

    votedByChoice() {
      return _get(this.statistic, 'votedByChoice', null);
    },

    winningOption() {
      let maxVotes = 0;
      let option = null;

      if (this.votedByChoice) {
        _forEach(this.votedByChoice, (v, k) => {
          if (maxVotes < v) {
            maxVotes = v;
            option = k;
          }
        });
      }

      return option;
    },
  },

  /**
   * The methods the page can use.
   * @see https://vuejs.org/v2/api/#methods
   */
  methods: {
    statisticVotedByChoicePercents(choice) {
      let percents = 0;

      if (this.votedByChoice !== null) {
        percents = (this.votedByChoice[choice] / this.voted) * 100;
      }

      return (percents % 1) ? percents.toFixed(2) : percents;
    },
  },
};
</script>
