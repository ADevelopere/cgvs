import logger from "@/lib/logger";
import { ICacheService, CacheProvider } from "./ICacheService";
import { PostgresCacheAdapter } from "./PostgresCacheAdapter";

/**
 * Cache Service Factory
 * Creates the appropriate cache adapter based on environment configuration
 */
export class CacheServiceFactory {
  private static instance: ICacheService | null = null;

  /**
   * Get cache service instance (singleton)
   */
  static getInstance(): ICacheService {
    if (!this.instance) {
      this.instance = this.createCacheService();
    }
    return this.instance;
  }

  /**
   * Create cache service based on provider type
   */
  private static createCacheService(): ICacheService {
    const provider = this.getCacheProvider();

    logger.log(`🔧 Initializing Cache with provider: ${provider}`);

    switch (provider) {
      case "postgres":
        return this.createPostgresCache();

      case "redis":
        return this.createRedisCache();

      default:
        logger.warn(
          `Unknown cache provider: ${provider}, falling back to redis`,
        );
        return this.createRedisCache();
    }
  }

  /**
   * Create PostgreSQL cache adapter
   */
  private static createPostgresCache(): ICacheService {
    logger.log("Connecting to PostgreSQL cache (UNLOGGED table)");
    return new PostgresCacheAdapter();
  }

  /**
   * Create Redis cache adapter (lazy import to avoid loading Redis when using PostgreSQL)
   */
  private static createRedisCache(): ICacheService {
    logger.log("Connecting to Redis cache");
    // Use require to avoid importing Redis module when using PostgreSQL
    const { RedisCacheAdapter } = require("./RedisCacheAdapter");
    return new RedisCacheAdapter();
  }

  /**
   * Get cache provider from environment variable
   */
  private static getCacheProvider(): CacheProvider {
    const provider = (
      process.env.CACHE_PROVIDER || "redis"
    ).toLowerCase() as CacheProvider;

    if (provider !== "redis" && provider !== "postgres") {
      logger.warn(
        `⚠️  Invalid CACHE_PROVIDER: ${provider}. Must be 'redis' or 'postgres'. Using 'redis'.`,
      );
      return "redis";
    }

    return provider;
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
   * Health check for cache connection
   */
  static async healthCheck(): Promise<boolean> {
    try {
      const cache = this.getInstance();
      return await cache.ping();
    } catch (error) {
      logger.error("Cache health check failed:", error);
      return false;
    }
  }
}

/**
 * Export singleton instance
 */
export const cacheService = CacheServiceFactory.getInstance();
