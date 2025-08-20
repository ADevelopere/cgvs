package di

import com.google.cloud.storage.Storage
import com.google.cloud.storage.StorageOptions
import config.GcsConfig
import services.StorageService
import io.ktor.server.application.Application
import org.koin.dsl.module
import services.storageService

fun storageModule(application: Application) = module {
    val config = application.environment.config

    val gcsConfig = GcsConfig(
        bucketName = config.property("gcp.bucket_name").getString()
    )
    single<GcsConfig> { gcsConfig }

    val storage: Storage = StorageOptions.getDefaultInstance().service
    single<Storage> { storage }

    single<StorageService> { storageService(get(), gcsConfig) }
}
