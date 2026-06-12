const NUMBER_SUFFIXES = [
  '', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc',
  'UDc', 'DDc', 'TDc', 'QaDc', 'QiDc', 'SxDc', 'SpDc', 'OcDc'
];

export function formatNumber(num) {
  if (num < 0) return '0';
  if (num < 1000) return Math.floor(num).toLocaleString('ko-KR');

  const absNum = Math.abs(num);
  let tier = Math.floor(Math.log10(absNum) / 3);

  if (tier >= NUMBER_SUFFIXES.length) {
    return num.toExponential(2);
  }

  const suffix = NUMBER_SUFFIXES[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = num / scale;

  if (scaled < 10) {
    return scaled.toFixed(2) + suffix;
  } else if (scaled < 100) {
    return scaled.toFixed(1) + suffix;
  } else {
    return Math.floor(scaled) + suffix;
  }
}

export function formatRate(num) {
  if (num <= 0) return '0';
  return formatNumber(num);
}

export function formatTime(totalSeconds) {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function calculatePrice(baseCost, count, growthFactor = 1.15) {
  return Math.floor(baseCost * Math.pow(growthFactor, count));
}
