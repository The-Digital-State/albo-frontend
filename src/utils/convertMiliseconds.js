export default (milliseconds = 0, format) => {
  let seconds = 0;
  let minutes = 0;
  let hours = 0;
  let days = 0;

  const totalSeconds = Math.floor(Math.abs(milliseconds) / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);

  seconds = totalSeconds % 60;
  minutes = totalMinutes % 60;
  hours = totalHours % 24;
  days = Math.floor(totalHours / 24);

  switch (format) {
    case 'second':
    case 'seconds': {
      return totalSeconds;
    }

    case 'minute':
    case 'minutes': {
      return totalMinutes;
    }

    case 'hour':
    case 'hours': {
      return totalHours;
    }

    case 'day':
    case 'days': {
      return days;
    }

    default: {
      return { days, hours, minutes, seconds };
    }
  }
};
