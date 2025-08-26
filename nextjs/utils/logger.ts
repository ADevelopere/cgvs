/* eslint-disable no-console */

const enabled = process.env.NODE_ENV === "development";
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
};

export default logger;
