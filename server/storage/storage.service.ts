import { StorageService } from "./disk/storage.service.interface";
import { createGcpAdapter } from "./disk/gcp";
import logger from "@/lib/logger";

/**
 * Supported storage providers
 */
type StorageProvider = "gcp" | "vercel" | "s3" | "r2";

/**
 * Storage Service Factory
 * Creates a storage service instance based on the STORAGE_PROVIDER environment variable
 */
class StorageServiceFactory {
    private static instance: StorageService | null = null;
    private static isInitializing = false;

    /**
     * Get the storage service instance (singleton pattern)
     */
    static async getInstance(): Promise<StorageService> {
        if (this.instance) {
            return this.instance;
        }

        if (this.isInitializing) {
            // Wait for the current initialization to complete
            while (this.isInitializing) {
                await new Promise(resolve => setTimeout(resolve, 10));
            }
            if (this.instance) {
                return this.instance;
            }
        }

        this.isInitializing = true;

        try {
            const provider = this.getStorageProvider();
            this.instance = await this.createService(provider);
            logger.info(`Storage service initialized with provider: ${provider}`);
            return this.instance;
        } catch (error) {
            logger.error("Failed to initialize storage service", error);
            throw new Error(`Failed to initialize storage service: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            this.isInitializing = false;
        }
    }

    /**
     * Get the storage provider from environment variable
     */
    private static getStorageProvider(): StorageProvider {
        const provider = process.env.STORAGE_PROVIDER as StorageProvider;

        if (!provider) {
            throw new Error("STORAGE_PROVIDER environment variable is required. Options: 'gcp', 'vercel', 's3', 'r2'");
        }

        const validProviders: StorageProvider[] = ["gcp", "vercel", "s3", "r2"];
        if (!validProviders.includes(provider)) {
            throw new Error(`Invalid STORAGE_PROVIDER: ${provider}. Options: ${validProviders.join(", ")}`);
        }

        return provider;
    }

    /**
     * Create storage service instance based on provider
     */
    private static async createService(provider: StorageProvider): Promise<StorageService> {
        switch (provider) {
            case "gcp":
                return await createGcpAdapter();

            case "vercel":
                throw new Error("Vercel storage adapter not implemented yet");

            case "s3":
                throw new Error("S3 storage adapter not implemented yet");

            case "r2":
                throw new Error("R2 storage adapter not implemented yet");

            default:
                throw new Error(`Unsupported storage provider: ${provider}`);
        }
    }

    /**
     * Get the storage service instance synchronously (throws if not initialized)
     */
    static getInstanceSync(): StorageService {
        if (!this.instance) {
            throw new Error("Storage service not initialized. Call getStorageService() first.");
        }
        return this.instance;
    }

    /**
     * Reset the singleton instance (useful for testing)
     */
    static reset(): void {
        this.instance = null;
        this.isInitializing = false;
    }
}

/**
 * Get the configured storage service instance
 * This is the main export that should be used throughout the application
 */
export const getStorageService = async (): Promise<StorageService> => {
    return await StorageServiceFactory.getInstance();
};

/**
 * Get storage service synchronously (throws if not initialized)
 * Use this only when you're certain the service has been initialized
 */
export const getStorageServiceSync = (): StorageService => {
    return StorageServiceFactory.getInstanceSync();
};

/**
 * Initialize storage service (optional, useful for app startup)
 * The service will be automatically initialized on first use if not called explicitly
 */
export const initializeStorageService = async (): Promise<StorageService> => {
    return await getStorageService();
};

// Export the factory class for advanced usage
export { StorageServiceFactory };

// Re-export types for convenience
export type { StorageService };
export * from "../types/storage.types";
export * from "./disk/storage.service.interface";
