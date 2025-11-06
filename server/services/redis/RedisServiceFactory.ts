import logger from "@/server/lib/logger";
import { IRedisService, RedisProvider } from "./IRedisService";
import { LocalRedisAdapter } from "./LocalRedisAdapter";
import { UpstashRedisAdapter } from "./UpstashRedisAdapter";

/**
 * Redis Service Factory
 * Creates the appropriate Redis adapter based on environment configuration
 */
export class RedisServiceFactory {
  private static instance: IRedisService | null = null;

  /**
   * Get Redis service instance (singleton)
   */
  static getInstance(): IRedisService {
    if (!this.instance) {
      this.instance = this.createRedisService();
    }
    return this.instance;
  }

  /**
   * Create Redis service based on provider type
   */
  private static createRedisService(): IRedisService {
    const provider = (process.env.REDIS_PROVIDER || "local") as RedisProvider;

    logger.log(`🔧 Initializing Redis with provider: ${provider}`);

    switch (provider) {
      case "local":
        return this.createLocalRedis();

      case "upstash":
        return this.createUpstashRedis();

      default:
        logger.warn(`Unknown Redis provider: ${provider}, falling back to local`);
        return this.createLocalRedis();
    }
  }

  /**
   * Create local Redis adapter
   */
  private static createLocalRedis(): IRedisService {
    const url = process.env.REDIS_URL || "redis://localhost:6379";

    logger.log(`Connecting to local Redis: ${url}`);

    return new LocalRedisAdapter(url);
  }

  /**
   * Create Upstash Redis adapter
   */
  private static createUpstashRedis(): IRedisService {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      throw new Error(
        "Upstash Redis requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN. " +
          "Get these from https://console.upstash.com/"
      );
    }

    logger.log("Connecting to Upstash Redis (serverless)");

    return new UpstashRedisAdapter(url, token);
  }

  /**
   * Reset instance (useful for testing)
   */
  static reset(): void {
    if (this.instance) {
      this.instance.disconnect();
      this.instance = null;
    }
  }

  /**
   * Health check for Redis connection
   */
  static async healthCheck(): Promise<boolean> {
    try {
      const redis = this.getInstance();
      return await redis.ping();
    } catch (error) {
      logger.error("Redis health check failed:", error);
      return false;
    }
  }
}

/**
 * Get Redis service instance (lazy-loaded)
 */
export const getRedisService = () => RedisServiceFactory.getInstance();

/**
 * Export singleton instance (lazy-loaded)
 * Only initializes when actually accessed
 */
export const redisService = new Proxy(
  {},
  {
    get(target, prop) {
      const service = getRedisService();
      return service[prop as keyof typeof service];
    },
  }
);
