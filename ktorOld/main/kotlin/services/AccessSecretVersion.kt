package services

import com.google.auth.oauth2.ServiceAccountCredentials
import com.google.cloud.secretmanager.v1.SecretManagerServiceClient
import com.google.cloud.secretmanager.v1.SecretVersionName
import com.google.cloud.storage.Storage
import com.google.cloud.storage.StorageOptions
import java.io.ByteArrayInputStream

fun getStorageFromSecretManager(projectId: String, secretId: String, versionId: String = "latest"): Storage? {
    return try {
        SecretManagerServiceClient.create().use { client ->
            val secretVersionName = SecretVersionName.of(projectId, secretId, versionId)
            val response = client.accessSecretVersion(secretVersionName)
            val payload = response.payload.data.toByteArray()
            val credentials = ServiceAccountCredentials.fromStream(ByteArrayInputStream(payload))
            StorageOptions.newBuilder()
                .setCredentials(credentials)
                .build()
                .service
        }
    } catch (_: Exception) {
        System.err.println("Failed to access secret version: $secretId in project: $projectId")
        null
    }
}
