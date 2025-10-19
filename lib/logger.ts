/* eslint-disable no-console */
const env = process.env.NODE_ENV;
const enabled = env === "development" || env === undefined;
const logger = {
  log: (...args: unknown[]) => {
    if (enabled) {
      console.log(...args);
    }
  },
  info: (...args: unknown[]) => {
    if (enabled) {
      console.info(...args);
    }
  },
  error: (...args: unknown[]) => {
    if (enabled) {
      console.error(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (enabled) {
      console.warn(...args);
    }
  },
  debug: (...args: unknown[]) => {
    if (enabled) {
      console.debug(...args);
    }
  },
};

export default logger;
