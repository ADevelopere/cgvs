import { BaseLogger } from "./base-logger";

class TestLogger extends BaseLogger {
  constructor() {
    super("test");
  }
}

// Create singleton instance
const logger = new TestLogger();

export default logger;
