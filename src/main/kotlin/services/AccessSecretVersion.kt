package services

import com.google.cloud.secretmanager.v1.SecretManagerServiceClient
import com.google.cloud.secretmanager.v1.SecretVersionName
import java.io.IOException
import java.util.zip.CRC32C
import java.util.zip.Checksum

object AccessSecretVersion {
    @Throws(IOException::class)
    fun accessSecretVersion() {
        // TODO(developer): Replace these variables before running the sample.
        val projectId = "your-project-id"
        val secretId = "your-secret-id"
        val versionId = "your-version-id"
        accessSecretVersion(projectId, secretId, versionId)
    }

    // Access the payload for the given secret version if one exists. The version
    // can be a version number as a string (e.g. "5") or an alias (e.g. "latest").
    @Throws(IOException::class)
    fun accessSecretVersion(projectId: String?, secretId: String?, versionId: String?) {
        // Initialize client that will be used to send requests. This client only needs to be created
        // once, and can be reused for multiple requests. After completing all of your requests, call
        // the "close" method on the client to safely clean up any remaining background resources.
        SecretManagerServiceClient.create().use { client ->
            val secretVersionName = SecretVersionName.of(projectId, secretId, versionId)
            // Access the secret version.
            val response = client.accessSecretVersion(secretVersionName)

            // Verify checksum. The used library is available in Java 9+.
            // If using Java 8, you may use the following:
            // https://github.com/google/guava/blob/e62d6a0456420d295089a9c319b7593a3eae4a83/guava/src/com/google/common/hash/Hashing.java#L395
            val data = response.getPayload().getData().toByteArray()
            val checksum: Checksum = CRC32C()
            checksum.update(data, 0, data.size)
            if (response.getPayload().getDataCrc32C() != checksum.getValue()) {
                System.out.printf("Data corruption detected.")
                return
            }

            // Print the secret payload.
            //
            // WARNING: Do not print the secret in a production environment - this
            // snippet is showing how to access the secret material.
            val payload = response.getPayload().getData().toStringUtf8()
            System.out.printf("Plaintext: %s\n", payload)
        }
    }
}
