package di

import com.google.cloud.storage.Storage
import com.google.cloud.storage.StorageOptions
import config.GcsConfig
import services.StorageService
import services.StorageDbService
import io.ktor.server.application.Application
import org.koin.dsl.module
import services.getStorageFromSecretManager
import services.storageService
import services.storageDbService

fun storageModule(application: Application) = module {
    val config = application.environment.config

    val gcsConfig = GcsConfig(
        bucketName = config.property("gcp.bucket_name").getString()
    )
    single<GcsConfig> { gcsConfig }

    val projectId = config.property("gcp.project_id").getString()
    val secretId = config.property("gcp.secret_id").getString()
    val versionId = config.propertyOrNull("gcp.secret_version")?.getString() ?: "latest"

    val storage: Storage =getStorageFromSecretManager(projectId, secretId, versionId) ?:
        StorageOptions.getDefaultInstance().service
    single<Storage> { storage }

    single<StorageService> { storageService(get(), gcsConfig, get()) }
    single<StorageDbService> { storageDbService(get(), gcsConfig, get()) }
}
