<template>
  <!-- eslint-disable max-len -->
  <div @click.self="cancel"
       v-show="opened"
       class="datetime-overlay">
    <div class="datetime-popup">
      <div class="datetime-popup-header">
        <div v-show="title"
             class="datetime-popup-title">
          {{ title }}
        </div>

        <div v-show="type !== 'time'"
             @click="showYear"
             class="datetime-popup-year">
          {{ year }}
        </div>

        <div v-show="type !== 'time'"
             class="datetime-popup-date">
          <span @click="showDate">{{ dateTime.format('DD') }}</span>
          <span @click="showMonth"> {{ dateTime.format('MMMM') }}</span>
        </div>
      </div>

      <div class="datetime-popup-body">
        <div v-show="step === 'year'"
             class="datetime-year-picker">
          <div ref="yearList"
               class="datetime-year-picker-list"
               @scroll="onYearsScroll">
            <div v-for="year in years" :key="year.year"
                 @click="selectYear(year)"
                 class="datetime-year-picker-item"
                 :class="{'selected': year.selected, 'disabled': year.disabled}">
              {{ year.number }}
            </div>
          </div>
        </div>

        <div v-show="step === 'month'"
             class="datetime-month-picker">
          <div ref="monthList"
               class="datetime-month-picker-list">
            <div v-for="month in months" :key="month.month"
                 @click="selectMonth(month)"
                 class="datetime-month-picker-item"
                 :class="{'selected': month.selected, 'disabled': month.disabled}">
              {{ month.label }}
            </div>
          </div>
        </div>

        <div v-show="step === 'date'"
             class="datetime-calendar">
          <div class="datetime-calendar-navigation">
            <div @click="previousMonth"
                 class="datetime-calendar-navigation-previous">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 61.3 102.8">
                <path fill="none" stroke="#444" stroke-width="14" stroke-miterlimit="10"
                      d="M56.3 97.8L9.9 51.4 56.3 5"></path>
              </svg>
            </div>
            <div class="datetime-calendar-current-month">
              {{ calendar.format('MMMM YYYY') }}
            </div>
            <div @click="nextMonth"
                 class="datetime-calendar-navigation-next">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 61.3 102.8">
                <path fill="none" stroke="#444" stroke-width="14" stroke-miterlimit="10"
                      d="M56.3 97.8L9.9 51.4 56.3 5"></path>
              </svg>
            </div>
          </div>
          <div class="datetime-calendar-month">
            <div v-for="weekday in weekdays" :key="weekday"
                 class="datetime-calendar-month-weekday">
              {{ weekday }}
            </div>
            <div v-for="(day, index) in days" :key="index"
                 @click="selectDay(day)"
                 class="datetime-calendar-month-day"
                 :class="{'selected': day.selected, 'disabled': day.disabled, 'inactive': day.inactive}">
              <span><span>{{ day.day.format('D') }}</span></span>
            </div>
          </div>
        </div>

        <div ref="time"
             v-show="step === 'time'"
             :class="{'datetime-time-picker': true, 'datetime-time-picker-with-suffix': use12Hour}">
          <div ref="hourList"
               class="datetime-time-picker-list datetime-time-picker-list-hours">
            <div v-for="hour in hours" :key="hour.hour"
                 @click="selectHour(hour)"
                 class="datetime-time-picker-item"
                 :class="{'selected': hour.selected, 'disabled': hour.disabled}">
              {{ to24or12Clock(hour.number) }}
            </div>
          </div>
          <div ref="minuteList"
               class="datetime-time-picker-list datetime-time-picker-list-minutes">
            <div v-for="minute in minutes" :key="minute.minute"
                 @click="selectMinute(minute)"
                 class="datetime-time-picker-item"
                 :class="{'selected': minute.selected, 'disabled': minute.disabled}">
              {{ minute.number }}
            </div>
          </div>

          <div class="datetime-time-picker-list datetime-time-picker-list-suffix"
               v-if="use12Hour">
            <div @click="selectSuffix('am')"
                 class="datetime-time-picker-item"
                 :class="{'selected': hour < 12}">am
            </div>
            <div @click="selectSuffix('pm')"
                 class="datetime-time-picker-item"
                 :class="{'selected': hour >= 12}">pm
            </div>
          </div>
        </div>
      </div>
      <div class="datetime-popup-actions">
        <div @click="cancel"
             class="datetime-popup-actions-button datetime-popup-actions-button-cancel">
          <slot name="button-cancel"
                :step="step">
            {{ $t('DateTimePicker.cancel') }}
          </slot>
        </div>
        <div class="datetime-popup-actions-button datetime-popup-actions-button-confirm"
             @click="confirm">
          <slot :step="step"
                name="button-confirm">
            {{ $t('DateTimePicker.confirm') }}
          </slot>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import dayjs from 'dayjs';

/**
 * Lodash functions
 * @see https://lodash.com/docs
 */
import _omit from 'lodash/omit';
import _get from 'lodash/get';
import _fill from 'lodash/fill';

// utils
import scrollTo from '@/utils/scrollTo';

export default {
  /**
   * The name of component
   * @see https://vuejs.org/v2/api/#name
   * @see https://github.com/xiaokaike/vue-color
   */
  name: 'DateTimePicker',

  /**
   * The v-model settings
   * @see https://vuejs.org/v2/guide/forms.html#v-model-with-Components
   */
  model: {
    prop: 'modelValue',
    event: 'change',
  },

  /**
   * The input properties(HTML attributes)
   * @see https://vuejs.org/v2/guide/components-props.html
   */
  props: {
    modelValue: null,

    /**
     * Popup title
     */
    title: {
      type: String,
      default: '',
    },

    /**
     * Current datetime
     */
    datetime: {
      type: [String, Date, dayjs],
      default() {
        return null;
      },
    },

    /**
     * Picker type: date, datetime or time
     */
    type: {
      type: String,
      default: 'date',
      validator(v) {
        return ['datetime', 'date', 'time'].indexOf(v) > -1;
      },
    },

    /**
     * Picker type: date, datetime or time
     */
    format: {
      type: String,
      default: null,
    },

    /**
     * Display 12 hour (AM/PM) mode
     */
    use12Hour: {
      type: Boolean,
      default: false,
    },

    /**
     * Hour step
     */
    hourStep: {
      type: Number,
      default: 1,
    },

    /**
     * Minute step
     */
    minuteStep: {
      type: Number,
      default: 1,
    },

    /**
     * Minimum datetime
     */
    minDatetime: {
      type: [String, Date, dayjs],
      default: null,
    },

    /**
     * Maximum datetime
     */
    maxDatetime: {
      type: [String, Date, dayjs],
      default: null,
    },

    /**
     * Auto continue/close on select.
     */
    auto: {
      type: Boolean,
      default: false,
    },

    /**
     * First day of the week. 1 is Monday and 7 is Sunday.
     */
    weekStart: {
      type: Number,
      default: 1,
    },

    /**
     * Customize steps flow, steps available: time, date, month, year. Example: ['year', 'date', 'time']
     */
    flow: {
      type: Array,
      default: null,
      validator(v) {
        return _omit(v, ['year', 'date', 'time']).length > 0;
      },
    },

    open: {
      type: Boolean,
      default: false,
    },
  },

  /**
   * The data that can be used by the component.
   * @returns {Object} The view-model data.
   */
  data() {
    return {
      opened: this.open,

      step: null,
      stepIndex: 0,
      steps: [],

      dateTime: this.$dayjs(),
      calendar: this.$dayjs(),

      upperYearsBound: this.$dayjs().year() + 100,
      bottomYearsBound: this.$dayjs().year() - 100,

      timePartsTouched: {
        hour: false,
        minute: false,
        suffix: !this.use12Hour,
      },
    };
  },

  /**
   * Computed Properties
   * @see https://vuejs.org/v2/guide/computed.html#Computed-Properties
   */
  computed: {
    minDateTime() {
      return this.$dayjs(this.minDatetime);
    },

    maxDateTime() {
      return this.$dayjs(this.maxDatetime);
    },

    year() {
      return this.dateTime.year();
    },

    years() {
      let year = this.bottomYearsBound;

      const years = [];

      do {
        let isYearBeforeMinDate = false;
        let isYearAfterMaxDate = false;

        if (this.minDateTime.isValid()) {
          isYearBeforeMinDate = this.dateTime.year(year).isBefore(this.minDateTime, 'date');
        }

        if (this.maxDateTime.isValid()) {
          isYearAfterMaxDate = this.dateTime.year(year).isAfter(this.maxDateTime, 'date');
        }

        years.push({
          number: year,
          selected: (year === this.year),
          disabled: (isYearBeforeMinDate || isYearAfterMaxDate),
        });

        year += 1;
      } while (this.upperYearsBound >= year);

      return years;
    },

    month() {
      return this.dateTime.month();
    },

    months() {
      return _fill(Array(12), null).map((v, i) => {
        let isMonthBeforeMinDate = false;
        let isMonthAfterMaxDate = false;

        if (this.minDateTime.isValid()) {
          isMonthBeforeMinDate = this.dateTime.month(i).isBefore(this.minDateTime, 'date');
        }

        if (this.maxDateTime.isValid()) {
          isMonthAfterMaxDate = this.dateTime.month(i).isAfter(this.maxDateTime, 'date');
        }

        return {
          number: i,
          label: this.$dayjs().month(i).startOf('month').format('MMMM'),
          selected: i === this.month,
          disabled: (isMonthBeforeMinDate || isMonthAfterMaxDate),
        };
      });
    },

    weekdays() {
      const weekdays = [];

      let weekday = (this.weekStart)
        ? this.$dayjs().weekday(this.weekStart)
        : this.$dayjs().startOf('week');

      for (let i = 0; i < 7; i++) {
        weekdays.push(weekday.format('ddd'));
        weekday = weekday.add(1, 'day');
      }

      return weekdays;
    },

    day() {
      return this.dateTime.date();
    },

    days() {
      const weekday = (this.weekStart)
        ? this.calendar.weekday(this.weekStart)
        : this.calendar.startOf('week');

      const dateOfMonth = this.calendar.startOf('month');
      const dateOfMonthWeekday = dateOfMonth.weekday();
      const daysInMonth = dateOfMonth.daysInMonth();
      const weekStart = weekday.weekday();

      const datePrevMonth = this.calendar.subtract(1, 'month');
      const daysInPrevMonth = datePrevMonth.daysInMonth();
      const dateNextMonth = this.calendar.add(1, 'month');

      let emptyDaysOnStart = dateOfMonthWeekday - weekStart;
      let emptyDaysOnEnd = (weekStart - dateOfMonthWeekday - daysInMonth) % 7;

      if (emptyDaysOnStart < 0) {
        emptyDaysOnStart += 7;
      }

      if (emptyDaysOnEnd < 0) {
        emptyDaysOnEnd += 7;
      }

      const minDateTime = this.$dayjs(this.minDatetime);
      const maxDateTime = this.$dayjs(this.maxDatetime);

      return _fill(Array(42), null)
        .map((v, i) => {
          let inactive = false;
          let day = dateOfMonth.date((i + 1 - emptyDaysOnStart));

          if (i < emptyDaysOnStart) {
            day = datePrevMonth.date(daysInPrevMonth - (emptyDaysOnStart - (i + 1)));
            inactive = true;
          }

          if (i >= emptyDaysOnStart + daysInMonth) {
            day = dateNextMonth.date((i + 1) - (emptyDaysOnStart + daysInMonth));
            inactive = true;
          }

          let isDayBeforeMinDate = false;
          let isDayAfterMaxDate = false;

          if (minDateTime.isValid()) {
            isDayBeforeMinDate = day.isBefore(minDateTime, 'date');
          }

          if (maxDateTime.isValid()) {
            isDayAfterMaxDate = day.isAfter(maxDateTime, 'date');
          }

          return {
            day,
            inactive,
            selected: day.isSame(this.dateTime, 'date'),
            disabled: ((isDayBeforeMinDate || isDayAfterMaxDate)),
          };
        });
    },

    hour() {
      return this.dateTime.hour();
    },

    hours() {
      return _fill(Array(Math.ceil(24 / this.hourStep)), null)
        .map((v, i) => i * this.hourStep)
        .filter((hour) => {
          if (!this.use12Hour) {
            return true;
          }

          if (this.hour < 12) {
            return hour < 12;
          }

          return hour >= 12;
        })
        .map((hour) => {
          let isHourBeforeMinDate = false;
          let isHourAfterMaxDate = false;

          if (this.minDateTime.isValid()) {
            isHourBeforeMinDate = this.$dayjs(this.dateTime).hour(hour).isBefore(this.minDateTime, 'hour');
          }

          if (this.maxDateTime.isValid()) {
            isHourAfterMaxDate = this.$dayjs(this.dateTime).hour(hour).isAfter(this.maxDateTime, 'hour');
          }

          return {
            number: hour < 10 ? `0${hour}` : hour,
            selected: hour === this.hour,
            disabled: (isHourBeforeMinDate || isHourAfterMaxDate),
          };
        });
    },

    minute() {
      return this.dateTime.minute();
    },

    minutes() {
      return _fill(Array(Math.ceil(60 / this.hourStep)), null)
        .map((v, i) => {
          const minute = i * this.hourStep;

          let isMinuteBeforeMinDate = false;
          let isMinuteAfterMaxDate = false;

          if (this.minDateTime.isValid()) {
            isMinuteBeforeMinDate = this.$dayjs(this.dateTime).minute(minute)
              .isBefore(this.minDateTime, 'minute');
          }

          if (this.maxDateTime.isValid()) {
            isMinuteAfterMaxDate = this.$dayjs(this.dateTime).minute(minute)
              .isAfter(this.maxDateTime, 'minute');
          }

          return {
            number: minute < 10 ? `0${minute}` : minute,
            selected: minute === this.minute,
            disabled: (isMinuteBeforeMinDate || isMinuteAfterMaxDate),
          };
        });
    },
  },

  /**
   * Used when a custom watchers is needed for a properties
   * @see https://vuejs.org/v2/api/#watch
   */
  watch: {
    modelValue(v) {
      this.setDateTime(v);
    },

    datetime(v) {
      this.setDateTime(v);
    },

    minDatetime() {
      this.init();
    },

    maxDatetime() {
      this.init();
    },
  },

  /**
   * Fires when the app has been created.
   * @see https://vuejs.org/v2/api/#mounted
   */
  created() {
    document.addEventListener('keydown', this.onKeyDown);
    this.init();
  },

  /**
   * Fires when the app has been destroyed.
   * @see https://vuejs.org/v2/api/#beforeDestroy
   */
  beforeDestroy() {
    document.removeEventListener('keydown', this.onKeyDown);
  },

  /**
   * The methods the component can use.
   * @see https://vuejs.org/v2/api/#methods
   */
  methods: {
    init() {
      const getSteps = () => {
        if (this.flow) {
          return this.flow;
        }

        if (this.type === 'datetime') {
          return ['date', 'time'];
        }

        if (this.type === 'time') {
          return ['time'];
        }

        return ['date'];
      };

      this.steps = getSteps();
      [this.step] = this.steps;

      this.setDateTime(this.modelValue ? this.modelValue : this.datetime);
    },

    setDateTime(date) {
      let dateTime = this.$dayjs(date);

      if (!dateTime.isValid()) {
        const now = this.$dayjs();
        if (this.minDateTime.isValid() && now.isBefore(this.minDateTime)) {
          dateTime = this.minDateTime.clone();
        } else if (this.maxDateTime.isValid() && now.isAfter(this.maxDateTime)) {
          dateTime = this.maxDateTime.clone();
        } else {
          dateTime = now;
        }
      }

      this.dateTime = dateTime;
      this.calendar = this.dateTime.clone();

      this.upperYearsBound = this.dateTime.year() + 100;
      this.bottomYearsBound = this.dateTime.year() - 100;

      if (this.maxDateTime.isValid()) {
        this.upperYearsBound = this.maxDateTime.year();

        const diffYears = this.maxDateTime.year() - this.dateTime.year();

        if (diffYears < 4) {
          this.upperYearsBound += 3 - diffYears;
        }
      }

      if (this.minDateTime.isValid()) {
        this.bottomYearsBound = this.minDateTime.year();

        const diffYears = this.dateTime.year() - this.minDateTime.year();

        if (diffYears < 4) {
          this.bottomYearsBound -= 3 - diffYears;
        }
      }
    },

    nextStep() {
      this.stepIndex += 1;

      this.step = _get(this.steps, this.stepIndex, null);

      if (this.step === 'time') {
        this.onTimeStep();
      }

      this.timePartsTouched = {
        hour: false,
        minute: false,
        suffix: !this.use12Hour,
      };

      if (!this.step) {
        this.stepIndex = 0;
        this.step = _get(this.steps, this.stepIndex, null);
        this.opened = false;
        this.$emit(
          'change',
          (this.format) ? this.dateTime.format(this.format) : this.dateTime.toISOString(),
        );
      }
    },

    previousMonth() {
      this.calendar = this.calendar.subtract(1, 'month');
    },

    nextMonth() {
      this.calendar = this.calendar.add(1, 'month');
    },

    showYear() {
      this.step = 'year';
      this.stepIndex = 0;

      this.$nextTick(() => {
        this.scrollToSelectedYear();
      });
    },

    showMonth() {
      this.step = 'month';
      this.stepIndex = 0;

      this.$nextTick(() => {
        this.scrollToSelectedMonth();
      });
    },

    showDate() {
      this.step = 'date';
      this.stepIndex = 0;
    },

    confirm() {
      this.nextStep();
    },

    cancel() {
      this.opened = false;
      this.$emit('cancel');
    },

    selectYear({ number, disabled }) {
      if (disabled) {
        return;
      }

      const year = parseInt(number, 10);

      const dateTime = this.dateTime.year(year);

      this.dateTime = dateTime.clone();
      this.calendar = dateTime.clone();

      if (this.auto) {
        this.nextStep();
      }
    },

    selectMonth({ number, disabled }) {
      if (disabled) {
        return;
      }

      const month = parseInt(number, 10);

      const dateTime = this.dateTime.month(month);

      this.dateTime = dateTime.clone();
      this.calendar = dateTime.clone();

      if (this.auto) {
        this.nextStep();
      }
    },

    selectDay({ day, disabled }) {
      if (disabled) {
        return;
      }

      let dateTime = day.hour(this.dateTime.hour()).minute(this.dateTime.minute());

      if (this.minDateTime.isValid() && dateTime.isBefore(this.minDateTime, 'minute')) {
        dateTime = this.minDateTime;
      }

      if (this.maxDateTime.isValid() && dateTime.isAfter(this.maxDateTime, 'minute')) {
        dateTime = this.maxDateTime;
      }

      this.dateTime = dateTime.clone();
      this.calendar = dateTime.clone();

      if (this.auto) {
        this.nextStep();
      }
    },

    selectHour({ number, disabled }) {
      if (disabled) {
        return;
      }

      const hour = parseInt(number, 10);

      const dateTime = this.dateTime.hour(hour);

      this.dateTime = dateTime.clone();
      this.calendar = dateTime.clone();

      this.timePartsTouched.hour = true;

      if (this.auto && this.timePartsTouched.every((v) => !!v)) {
        this.nextStep();
      }
    },

    selectMinute({ number, disabled }) {
      if (disabled) {
        return;
      }

      const minute = parseInt(number, 10);

      const dateTime = this.dateTime.minute(minute);

      this.dateTime = dateTime.clone();
      this.calendar = dateTime.clone();
      this.timePartsTouched.minute = true;

      if (this.auto && this.timePartsTouched.every((v) => !!v)) {
        this.nextStep();
      }
    },

    selectSuffix(suffix) {
      if (suffix === 'am') {
        if (this.hour >= 12) {
          this.dateTime = this.dateTime.hour(this.hour - 12);
          this.calendar = this.dateTime.clone();
        }
      }
      if (suffix === 'pm') {
        if (this.hour < 12) {
          this.dateTime = this.dateTime.hour(this.hour + 12);
          this.calendar = this.dateTime.clone();
        }
      }

      this.timePartsTouched.suffix = true;

      if (this.auto && this.timePartsTouched.every((v) => !!v)) {
        this.nextStep();
      }
    },

    onTimeStep() {
      this.$nextTick(() => {
        this.scrollToSelectedHour();
        this.scrollToSelectedMinute();
      });
    },

    onYearsScroll({ target }) {
      const oldScrollHeight = target.scrollHeight;

      const [bottomYear] = this.years;
      const upperYear = this.years[this.years.length - 1];

      if (target.scrollTop < 150) {
        let bottomYearsBound = this.bottomYearsBound - 100;
        bottomYearsBound = (bottomYearsBound > 0) ? bottomYearsBound : 1;

        if (this.minDateTime.isValid()) {
          if (bottomYear.number <= this.minDateTime.year()) {
            return;
          }

          bottomYearsBound = this.minDateTime.year();
        }

        this.bottomYearsBound = bottomYearsBound;

        this.$nextTick(() => {
          target.scrollTop = target.scrollHeight - (oldScrollHeight - target.scrollTop);
        });
      }

      if ((oldScrollHeight - target.scrollTop) < 1000) {
        let upperYearsBound = this.upperYearsBound + 100;

        if (this.maxDateTime.isValid()) {
          if (upperYear.number >= this.maxDateTime.year()) {
            return;
          }

          upperYearsBound = this.maxDateTime.year();
        }

        this.upperYearsBound = upperYearsBound;

        const oldScrollTop = target.scrollTop;

        this.$nextTick(() => {
          target.scrollTop = oldScrollTop;
        });
      }
    },

    scrollToSelectedYear() {
      // scroll to selected year
      const { yearList } = this.$refs;
      const selectedYear = yearList.querySelector('.datetime-year-picker-item.selected');
      scrollTo(yearList, selectedYear ? selectedYear.offsetTop - 250 : 0);

      return this;
    },

    scrollToSelectedMonth() {
      // scroll to selected month
      const { monthList } = this.$refs;
      const selectedMonth = monthList.querySelector('.datetime-month-picker-item.selected');
      scrollTo(monthList, selectedMonth ? selectedMonth.offsetTop - 250 : 0);

      return this;
    },

    scrollToSelectedHour() {
      // scroll to selected hour
      const { hourList } = this.$refs;
      const selectedHour = hourList.querySelector('.datetime-time-picker-item.selected');
      scrollTo(hourList, selectedHour ? selectedHour.offsetTop - 250 : 0);

      return this;
    },

    scrollToSelectedMinute() {
      // scroll to selected minute
      const { minuteList } = this.$refs;
      const selectedMinute = minuteList.querySelector('.datetime-time-picker-item.selected');
      scrollTo(minuteList, selectedMinute ? selectedMinute.offsetTop - 250 : 0);

      return this;
    },

    to24or12Clock(v) {
      const hour = parseInt(v, 10);

      if (this.use12Hour) {
        if (hour === 0) {
          return 12;
        }

        if (hour > 12) {
          return hour - 12;
        }
      }
      return hour;
    },

    onKeyDown(event) {
      const keyTab = 9;
      const keyEnter = 13;
      const keyEsc = 27;

      if (event.keyCode === keyEsc || event.keyCode === keyTab) {
        this.cancel();
      } else if (event.keyCode === keyEnter) {
        this.nextStep();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.datetime-overlay {
  z-index: 999;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  transition: opacity .5s;
}

.datetime-popup {
  box-sizing: border-box;
  z-index: 1000;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 360px;
  max-width: calc(100% - 30px);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
  color: #444;
  line-height: 1.18;
  background: #fff;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  & * {
    box-sizing: border-box;
  }
}

.datetime-popup-header {
  padding: 18px 30px;
  background: #1867c0;
  color: #fff;
  font-size: 32px;
}

.datetime-popup-title {
  margin-bottom: 8px;
  font-size: 21px;
  font-weight: 300;
}

.datetime-popup-year {
  font-weight: 300;
  font-size: 15px;
  opacity: 0.7;
  cursor: pointer;
  transition: opacity .3s;

  &:hover {
    opacity: 1;
  }
}

.datetime-popup-date span {
  line-height: 1;
  cursor: pointer;
}

.datetime-popup-date span:hover {
  text-shadow: 0 0 1px #ffffff;
}

.datetime-popup-actions {
  padding: 0 20px 10px 30px;
  text-align: right;
}

.datetime-popup-actions-button {
  display: inline-block;
  border: none;
  padding: 10px 20px;
  background: transparent;
  font-size: 16px;
  color: #1867c0;
  cursor: pointer;
  transition: color .3s;

  & :hover {
    color: #444;
  }
}

.datetime-year-picker {
  box-sizing: border-box;

  &::after {
    content: '';
    display: table;
    clear: both;
  }

  & * {
    box-sizing: border-box;
  }
}

.datetime-year-picker-list {
  float: left;
  width: 100%;
  height: 356px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 3px;
  }

  &::-webkit-scrollbar-track {
    background: #efefef;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
  }
}

.datetime-year-picker-item {
  padding: 10px 0;
  font-size: 20px;
  text-align: center;
  cursor: pointer;
  transition: font-size .3s;
}

.datetime-year-picker-item:hover {
  font-size: 32px;
}

.datetime-year-picker-item.selected {
  color: #1867c0;
  font-size: 32px;
}

.datetime-year-picker-item.disabled {
  opacity: 0.4;
  cursor: default;

  &:hover {
    color: inherit;
    background: transparent;
  }
}

.datetime-calendar-navigation,
.datetime-calendar-navigation * {
  box-sizing: border-box;
}

.datetime-calendar-navigation {
  position: relative;
  margin: 15px 0;
  padding: 0 30px;
  width: 100%;
}

.datetime-calendar-navigation-previous,
.datetime-calendar-navigation-next {
  position: absolute;
  top: 0;
  padding: 0 5px;
  width: 18px;
  cursor: pointer;

  & svg {
    width: 8px;

    & path {
      transition: stroke .3s;
    }
  }

  &:hover svg path {
    stroke: #888;
  }
}

.datetime-calendar-navigation-previous {
  left: 25px;
}

.datetime-calendar-navigation-next {
  right: 25px;
  transform: scaleX(-1);
}

.datetime-calendar-current-month {
  text-align: center;
  text-transform: capitalize;
}

.datetime-calendar-month {
  padding: 0 20px;
  transition: height .2s;
}

.datetime-calendar-month-weekday,
.datetime-calendar-month-day {
  display: inline-block;
  width: calc(100% / 7);
  line-height: 36px;
  text-align: center;
  font-size: 15px;
  font-weight: 300;
  cursor: pointer;

  & > span {
    display: block;
    width: 100%;
    position: relative;
    height: 0;
    padding: 0 0 100%;
    overflow: hidden;

    & > span {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      border: 0;
      border-radius: 50%;
      transition: background-color .3s, color .3s;
    }
  }
}

.datetime-calendar-month-weekday {
  font-weight: bold;
}

.datetime-calendar-month-day:hover > span > span {
  background: #eee;
}

.datetime-calendar-month-day.selected {
  & > span > span,
  &:hover > span > span {
    color: #fff;
    background: #1867c0;
  }
}

.datetime-calendar-month-day.disabled {
  opacity: 0.4;
  cursor: default;

  &:hover > span > span {
    color: inherit;
    background: transparent;
  }
}

.datetime-calendar-month-day.inactive {
  opacity: 0.4;
}

.datetime-month-picker {
  box-sizing: border-box;

  &::after {
    content: '';
    display: table;
    clear: both;
  }

  & * {
    box-sizing: border-box;
  }

}

.datetime-month-picker-list {
  float: left;
  width: 100%;
  height: 356px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 3px;
  }

  &::-webkit-scrollbar-track {
    background: #efefef;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
  }

}

.datetime-month-picker-item {
  padding: 10px 0;
  font-size: 20px;
  text-align: center;
  cursor: pointer;
  transition: font-size .3s;
}

.datetime-month-picker-item:hover {
  font-size: 32px;
}

.datetime-month-picker-item.selected {
  color: #1867c0;
  font-size: 32px;
}

.datetime-month-picker-item.disabled {
  opacity: 0.4;
  cursor: default;

  &:hover {
    color: inherit;
    background: transparent;
  }

}

.datetime-time-picker {
  box-sizing: border-box;

  &::after {
    content: '';
    display: table;
    clear: both;
  }

  & * {
    box-sizing: border-box;
  }

}

.datetime-time-picker-list {
  float: left;
  width: 50%;
  height: 356px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 3px;
  }

  &::-webkit-scrollbar-track {
    background: #efefef;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
  }

}

.datetime-time-picker-with-suffix .datetime-time-picker-list {
  width: 33.3%;
}

.datetime-time-picker-item {
  padding: 10px 0;
  font-size: 20px;
  text-align: center;
  cursor: pointer;
  transition: font-size .3s;
}

.datetime-time-picker-item:hover {
  font-size: 32px;
}

.datetime-time-picker-item.selected {
  color: #1867c0;
  font-size: 32px;
}

.datetime-time-picker-item.disabled {
  opacity: 0.4;
  cursor: default;
  font-size: 20px !important;
}
</style>
