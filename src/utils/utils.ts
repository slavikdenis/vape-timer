import packageJson from '../../package.json';

export const isNumber = (val: unknown): val is number =>
  typeof val === 'number';

// Read version from `package.json
export const getCurrentVersion = (): string => packageJson.version;
