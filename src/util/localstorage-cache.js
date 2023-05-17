/* eslint-disable react/display-name */
const getFromCache = (localStorageKey) => (key) => {
  const cachedString = window.localStorage.getItem(localStorageKey);
  if (cachedString === null) return null;
  const cached = JSON.parse(cachedString);

  // if the localStorage value isn't an array (using old json object), return null
  if (!Array.isArray(cached)) return null;

  return (
    cached.find((entry) => entry.key === key)?.value ?? null
  );
};

const setCache = (localStorageKey) => (key, value) => {
  const cachedString = window.localStorage.getItem(localStorageKey);
  let cached = JSON.parse(cachedString) ?? [];

  // if there was any other type of localStorage value, clear the cache
  if (!Array.isArray(cached)) cached = [];

  // if the key already exists in the cache, return so as to not add a dup
  if (cached.find((entry) => entry.key === key)) return;

  const maxAttempts = cached.length;
  const attemptAppend = (attempt = 0) => {
    // if we've tried an deque `maxAttempts` times and are still getting
    // a QuotaExceededError, return to avoid infinite recursion
    if (attempt > maxAttempts) return;

    // try to append the key/val pair to the cache
    try {
      cached.push({
        key,
        value,
      });
      window.localStorage.setItem(
        localStorageKey,
        JSON.stringify(cached)
      );
    } catch (err) {
      // https://mmazzarolo.com/blog/2022-06-25-local-storage-status/
      // if we're out of storage, remove the first item and try again
      if (
        err instanceof DOMException &&
        (err.code === 22 ||
          err.code === 1014 ||
          err.name === "QuotaExceededError" ||
          err.name === "NS_ERROR_DOM_QUOTA_REACHED")
      ) {
        console.warn(
          `Out of localStorage, removing old value from ${localStorageKey}. Attempt ${attempt}`
        );
        // deque the first item. We also have to remove the last item because it will be
        // added back by the next attemptAppend call
        cached = cached.slice(
          1,
          cached.length - 1
        );
        attemptAppend(attempt + 1);
      }
    }
  };
  attemptAppend();
};

/**
 * Creates a map-ish interface stored in `localStorage`. Throws away the oldest entries in
 * the map when the localStorage quota is reached, so that a new key/val pair can be stored.
 * Don't use for data that needs to be kept, as the data structure may throw it away. Useful
 * for caching network requests. 
 * @param {*} localStorageKey key to store map under in localStorage
 * @warn this isn't a real map so it's not O(1), it's actually just searching through an 
 * array, so O(n). Recommend n < 10,000
 */
export const localStorageCache = (localStorageKey) => ({
  /**
   * @param {string}
   */
  get: getFromCache(localStorageKey),
  set: setCache(localStorageKey),
})
