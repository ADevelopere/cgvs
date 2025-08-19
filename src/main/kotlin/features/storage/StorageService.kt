
package features.storage

import com.google.api.gax.paging.Page
import com.google.cloud.storage.Blob
import com.google.cloud.storage.BlobId
import com.google.cloud.storage.BlobInfo
import com.google.cloud.storage.Storage
import config.GcsConfig
import java.io.InputStream
import java.net.URL
import java.util.concurrent.TimeUnit

class StorageService(private val storage: Storage, private val gcsConfig: GcsConfig) {

    fun uploadFile(path: String, inputStream: InputStream, contentType: String?): BlobInfo {
        val blobId = BlobId.of(gcsConfig.bucketName, path)
        val blobInfo = BlobInfo.newBuilder(blobId).setContentType(contentType).build()
        return storage.create(blobInfo, inputStream)
    }

    fun getSignedUrl(path: String): URL {
        val blobInfo = storage.get(gcsConfig.bucketName, path) 
            ?: throw Exception("File not found: $path")

        return storage.signUrl(blobInfo, 15, TimeUnit.MINUTES, Storage.SignUrlOption.withV4Signature())
    }

    fun list(prefix: String): Page<Blob> {
        return storage.list(gcsConfig.bucketName, Storage.BlobListOption.prefix(prefix), Storage.BlobListOption.currentDirectory())
    }

    fun createFolder(path: String): Blob {
        val blobId = BlobId.of(gcsConfig.bucketName, "$path/")
        val blobInfo = BlobInfo.newBuilder(blobId).build()
        return storage.create(blobInfo)
    }

    fun deleteFile(path: String): Boolean {
        val blobId = BlobId.of(gcsConfig.bucketName, path)
        return storage.delete(blobId)
    }

    fun deleteFolder(path: String): Boolean {
        val blobs = storage.list(gcsConfig.bucketName, Storage.BlobListOption.prefix("$path/")).values
        if (blobs.any()) {
            storage.delete(blobs.map { it.blobId })
        }
        return true
    }
}
