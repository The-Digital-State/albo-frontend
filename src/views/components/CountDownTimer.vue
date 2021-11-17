<template>
  <div v-if="isNotTheEnd" :key="`count-down-timer-${nowEndDiff}`">
    <div class="font-weight-medium text-h6">
      {{ timer }}
    </div>
    <div>{{ label }}</div>
  </div>
</template>

<script>
import dayjs from 'dayjs';

// utils
import convertMiliseconds from '@/utils/convertMiliseconds';

export default {
  /**
   * The name of the page.
   * @see https://vuejs.org/v2/api/#name
   */
  name: 'CountDownTimer',

  /**
   * The input properties(HTML attributes)
   * @see https://vuejs.org/v2/guide/components-props.html
   */
  props: {
    start: {
      type: [String, Date, dayjs],
      required: true,
    },

    end: {
      type: [String, Date, dayjs],
      required: true,
    },

    labelToStart: {
      type: String,
      default() {
        return this.$t('CountDownTimer.labelToStart');
      },
    },

    labelToEnd: {
      type: String,
      default() {
        return this.$t('CountDownTimer.labelToEnd');
      },
    },

    interval: {
      type: Number,
      default: 1000,
    },
  },

  /**
   * The input properties(HTML attributes)
   * @see https://vuejs.org/v2/guide/components-props.html
   */
  components: {},

  /**
   * The data that can be used by the component.
   * @returns {Object} The view-model data.
   */
  data() {
    return {
      nowEndDiff: 0,
      timer: '',
    };
  },

  /**
   * Computed Properties
   * @see https://vuejs.org/v2/guide/computed.html#Computed-Properties
   */
  computed: {
    isNotTheEnd() {
      const end = this.$dayjs(this.end);
      const now = this.$dayjs();

      return now.isBefore(end);
    },

    startDayjs() {
      return this.$dayjs(this.start);
    },

    endDayjs() {
      return this.$dayjs(this.end);
    },

    label() {
      return (this.$dayjs().isBefore(this.startDayjs)) ? this.labelToStart : this.labelToEnd;
    },
  },

  /**
   * Used when a custom watchers is needed for a properties
   * @see https://vuejs.org/v2/api/#watch
   */
  watch: {
    nowEndDiff(newValue, oldValue) {
      const oldDate = this.endDayjs.subtract(oldValue, 'milliseconds');
      const newDate = this.endDayjs.subtract(newValue, 'milliseconds');

      if (oldDate.isBefore(this.startDayjs) && newDate.isAfter(this.startDayjs)) {
        this.$emit('started');
      }
    },
  },

  /**
   * The options that can be used by the component
   * @see https://ru.vuejs.org/v2/api/index.html#vm-options
   * @returns {Object} The view-model options.
   */
  interval: null,

  /**
   * Fires when the app has been created.
   * @see https://vuejs.org/v2/api/#mounted
   */
  created() {
    this.$options.interval = setInterval(() => {
      const now = this.$dayjs();

      this.nowEndDiff = now.diff(this.endDayjs);

      if (now.isBefore(this.startDayjs)) {
        this.setTimer(convertMiliseconds(this.startDayjs.diff(now)));
      } else if (now.isBefore(this.endDayjs)) {
        this.setTimer(convertMiliseconds(this.endDayjs.diff(now)));
      } else {
        this.$emit('ended');
        clearInterval(this.$options.interval);
      }
    }, this.interval);
  },

  /**
   * Fires when the app has been destroyed.
   * @see https://vuejs.org/v2/api/#beforeDestroy
   */
  beforeDestroy() {
    clearInterval(this.$options.interval);
  },

  /**
   * The methods the component can use.
   * @see https://vuejs.org/v2/api/#methods
   */
  methods: {
    setTimer({ days, hours, minutes, seconds }) {
      this.timer = '';

      if (days) {
        this.timer = `${this.$tc('CountDownTimer.days', days)}`;

        if (hours) {
          this.timer += ` ${this.$tc('CountDownTimer.hours', hours)}`;
        }
      } else if (hours) {
        this.timer = `${this.$tc('CountDownTimer.hours', hours)}`;

        if (minutes) {
          this.timer += ` ${this.$tc('CountDownTimer.minutes', minutes)}`;
        }
      } else if (minutes) {
        this.timer = `${this.$tc('CountDownTimer.minutes', minutes)}`;

        if (seconds) {
          this.timer += ` ${this.$tc('CountDownTimer.seconds', seconds)}`;
        }
      } else if (seconds) {
        this.timer += ` ${this.$tc('CountDownTimer.seconds', seconds)}`;
      }
    },
  },
};
</script>
