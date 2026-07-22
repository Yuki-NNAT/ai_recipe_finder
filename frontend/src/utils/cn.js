import clsx from 'clsx';

/**
 * Class-name helper. Thin wrapper over clsx so every component composes
 * conditional Tailwind classes the same way. Keeping this centralized means
 * we never re-import clsx piecemeal across the UI kit.
 *
 * @param  {...any} inputs clsx-compatible values
 * @returns {string}
 */
export function cn(...inputs) {
  return clsx(inputs);
}

export default cn;
