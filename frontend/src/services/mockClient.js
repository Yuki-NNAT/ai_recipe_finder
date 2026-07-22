/**
 * Mock transport. Every service resolves through here so swapping to the real
 * axios/FastAPI backend later is a one-file change — the service APIs stay put.
 */

/** Resolve `data` after a simulated network delay. */
export const respond = (data, ms = 450) =>
  new Promise((resolve) => setTimeout(() => resolve(structuredCloneSafe(data)), ms));

/** Reject after a delay — for exercising error states. */
export const respondError = (message = 'Request failed', ms = 450) =>
  new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms));

/** structuredClone with a JSON fallback for older runtimes. */
function structuredCloneSafe(value) {
  try {
    return structuredClone(value);
  } catch {
    return JSON.parse(JSON.stringify(value));
  }
}
