import { Storage } from '@google-cloud/storage';

export interface GcsConfig {
    bucketName: string;
    projectId: string;
    baseUrl: string;
}

export class GcsConfigImpl implements GcsConfig {
    public readonly bucketName: string;
    public readonly projectId: string;
    public readonly baseUrl: string;

    constructor(bucketName: string, projectId: string) {
        this.bucketName = bucketName;
        this.projectId = projectId;
        this.baseUrl = `https://storage.googleapis.com/${bucketName}/`;
    }
}

export function createGcsConfig(): GcsConfig {
    const bucketName = process.env.GCP_BUCKET_NAME;
    const projectId = process.env.GCP_PROJECT_ID;

    if (!bucketName) {
        throw new Error('GCP_BUCKET_NAME environment variable is required');
    }

    if (!projectId) {
        throw new Error('GCP_PROJECT_ID environment variable is required');
    }

    return new GcsConfigImpl(bucketName, projectId);
}

export function createStorage(config: GcsConfig): Storage {
    return new Storage({
        projectId: config.projectId,
        // If running locally, make sure GOOGLE_APPLICATION_CREDENTIALS is set
        // If running on GCP, it will use the default service account
    });
}