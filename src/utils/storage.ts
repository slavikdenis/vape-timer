export type StorageKeys =
  | 'heatingTime'
  | 'blazeTime'
  | 'screenWakeLock'
  | 'vibrations';

// set
const set = <T>(key: StorageKeys, value: T) => {
  if (typeof value === 'string') {
    localStorage.setItem(key, value);
  } else {
    const stringValue = JSON.stringify(value);
    localStorage.setItem(key, stringValue);
  }
};

// get
function get<T>(key: StorageKeys, opts: { shouldParse: true }): T | null;
function get<T>(key: StorageKeys, opts?: { shouldParse?: true }): T | null;
function get(key: StorageKeys, opts: { shouldParse: false }): string | null;
function get<T>(
  key: StorageKeys,
  opts?: { shouldParse?: boolean },
): T | string | null {
  const stringValue = localStorage.getItem(key);

  const shouldParse = opts?.shouldParse ? opts.shouldParse : true;

  if (shouldParse) {
    return stringValue === null ? null : (JSON.parse(stringValue) as T);
  } else {
    return stringValue === null ? null : stringValue;
  }
}

// remove
const remove = (key: StorageKeys) => {
  localStorage.removeItem(key);
};

export { get, set, remove };
