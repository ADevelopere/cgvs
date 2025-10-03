import { Storage } from "@google-cloud/storage";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import logger from "@/utils/logger";
import * as StorageTypes from "../storage.types";
import { StorageService } from "./storage.service.interface";

const bucketName = process.env.GCP_BUCKET_NAME;
const projectId = process.env.GCP_PROJECT_ID;
const secretId = process.env.GCP_SECRET_ID;
const secretVersion = process.env.GCP_SECRET_VERSION || "latest";

export const gcpBaseUrl = `https://storage.googleapis.com/${bucketName}/`;

const getStorageFromSecretManager = async (): Promise<Storage | null> => {
    try {
        const client = new SecretManagerServiceClient();
        const name = `projects/${projectId}/secrets/${secretId}/versions/${secretVersion}`;

        const [version] = await client.accessSecretVersion({ name });
        const payload = version.payload?.data;

        if (!payload) {
            throw new Error("No payload found in secret version");
        }

        const credentials = JSON.parse(payload.toString());

        return new Storage({
            projectId,
            credentials,
        });
    } catch (error) {
        logger.error(
            `Failed to access secret version: ${secretId} in project: ${projectId}`,
            error,
        );
        return null;
    }
};

export async function createGcpStorage(): Promise<Storage> {
    if (projectId && secretId) {
        const storageFromSecret = await getStorageFromSecretManager();
        if (storageFromSecret) {
            return storageFromSecret;
        }
    }

    // Fallback to default credentials
    return new Storage({
        projectId,
    });
}

class gcpAdapter implements StorageService {}
