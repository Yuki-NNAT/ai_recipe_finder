/** Formatting helpers shared across features (no duplicated inline logic). */

/** 1234 -> "1,234". Locale-aware thousands grouping. */
export const formatNumber = (value) =>
  new Intl.NumberFormat('en-US').format(Number(value) || 0);

/** 12500 -> "12.5k" for compact stat displays. */
export const formatCompact = (value) =>
  new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(
    Number(value) || 0,
  );

/** 25 -> "25 min", clamps to a friendly label. */
export const formatDuration = (minutes) => {
  const m = Number(minutes) || 0;
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest ? `${h}h ${rest}m` : `${h}h`;
};

/** ISO string -> "Jan 5, 2026". */
export const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

/** Constrain a number to a range. */
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/** "grilled chicken salad" -> "GC" initials for avatar fallbacks. */
export const getInitials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
