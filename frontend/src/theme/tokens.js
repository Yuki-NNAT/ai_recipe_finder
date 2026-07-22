/**
 * Design tokens — the single source of truth for values that need to be read
 * from JavaScript (chart palettes, SweetAlert theming, inline gradients).
 * Tailwind mirrors these in tailwind.config.js; keep the two in sync.
 */

export const colors = {
  primary: '#FF4F87',
  secondary: '#FF8FB1',
  accent: '#FFD6E5',
  background: '#FFF7FA',
  surface: '#FFFFFF',
  text: '#202020',
  muted: '#777777',
  success: '#00C896',
  warning: '#FFC542',
  danger: '#FF5C7A',
};

export const radius = {
  sm: '14px',
  md: '22px',
  lg: '28px',
  pill: '999px',
};

export const shadow = {
  soft: '0 10px 30px -12px rgba(255, 79, 135, 0.25)',
  softLg: '0 24px 60px -20px rgba(255, 79, 135, 0.32)',
  glass: '0 8px 32px rgba(255, 79, 135, 0.12)',
};

/** Ordered palette for charts (macros, categories, etc.). */
export const chartPalette = [
  colors.primary,
  colors.secondary,
  colors.warning,
  colors.success,
  '#9B8CFF',
  '#66C7FF',
];

/** Macro-specific colors used consistently across nutrition + calculator. */
export const macroColors = {
  protein: colors.primary,
  carbs: colors.warning,
  fat: colors.secondary,
  fiber: colors.success,
};

export default { colors, radius, shadow, chartPalette, macroColors };
