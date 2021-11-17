export default (element, to, duration = 0) => {
  const start = element.scrollTop;
  const change = to - start;
  let currentTime = 0;
  const increment = 20;

  const animateScroll = () => {
    currentTime += increment;

    const easeInOutQuad = (t, s, c, d) => {
      let n = t / (d / 2);

      if (n < 1) {
        return (c / 2) * n * n + s;
      }

      n -= 1;
      return -(c / 2) * (n * (n - 2) - 1) + s;
    };

    element.scrollTop = easeInOutQuad(currentTime, start, change, duration);

    if (currentTime < duration) {
      setTimeout(animateScroll, increment);
    }
  };

  if (duration) {
    animateScroll();
  } else {
    element.scrollTop = to;
  }
};
