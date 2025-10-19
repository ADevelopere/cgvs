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
  static async getInstance(): Promise<ICacheService> {
    if (!this.instance) {
      this.instance = await this.createCacheService();
    }
    return this.instance;
  }

  /**
   * Create cache service based on provider type
   */
  private static async createCacheService(): Promise<ICacheService> {
    const provider = this.getCacheProvider();

    logger.log(`🔧 Initializing Cache with provider: ${provider}`);

    switch (provider) {
      case "postgres":
        return this.createPostgresCache();

      case "redis":
        return await this.createRedisCache();

      default:
        logger.warn(
          `Unknown cache provider: ${provider}, falling back to redis`
        );
        return await this.createRedisCache();
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
  private static async createRedisCache(): Promise<ICacheService> {
    logger.log("Connecting to Redis cache");
    // Use dynamic import to avoid importing Redis module when using PostgreSQL
    const { RedisCacheAdapter } = await import("./RedisCacheAdapter");
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
        `⚠️  Invalid CACHE_PROVIDER: ${provider}. Must be 'redis' or 'postgres'. Using 'redis'.`
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
      const cache = await this.getInstance();
      return await cache.ping();
    } catch (error) {
      logger.error("Cache health check failed:", error);
      return false;
    }
  }
}

/**
 * Export singleton instance getter
 */
export const getCacheService = () => CacheServiceFactory.getInstance();
