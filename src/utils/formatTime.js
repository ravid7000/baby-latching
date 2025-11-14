export function formatMsToHMS(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const h = hours > 0 ? String(hours).padStart(2, '0') + ':' : '';
  return `${h}${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function nowTs() {
  return Date.now();
}

