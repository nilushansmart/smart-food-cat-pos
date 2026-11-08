import { useState, useEffect } from 'react';

export const NumberCounter = ({ value = 0, prefix = '', suffix = '', decimals = 2, duration = 400 }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let startTimestamp = null;
    const startValue = typeof displayValue === 'number' ? displayValue : parseFloat(displayValue) || 0;
    const endValue = typeof value === 'number' ? value : parseFloat(value) || 0;

    if (startValue === endValue) return;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease out
      const current = startValue + (endValue - startValue) * easeProgress;
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  const formatted = decimals > 0 ? Number(displayValue).toFixed(decimals) : Math.round(displayValue);

  return (
    <span className="tabular-nums">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};
