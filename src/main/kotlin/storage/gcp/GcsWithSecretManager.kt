package storage.gcp

import com.google.cloud.secretmanager.v1.SecretManagerServiceClient
import com.google.cloud.secretmanager.v1.AccessSecretVersionRequest
import com.google.auth.oauth2.ServiceAccountCredentials
import com.google.cloud.storage.Storage
import com.google.cloud.storage.StorageOptions


fun getStorage(): Storage {
    // Uses Application Default Credentials, which you set up with gcloud auth application-default
    return StorageOptions.getDefaultInstance().service
}
