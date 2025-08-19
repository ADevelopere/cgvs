
package di

import com.google.cloud.storage.Storage
import com.google.cloud.storage.StorageOptions
import config.GcsConfig
import features.storage.StorageService
import org.koin.dsl.module

fun storageModule() = module {
    single {
        val bucketName = getProperty<String>("gcs.bucketName")
        GcsConfig(bucketName)
    }
    single<Storage> {
        StorageOptions.getDefaultInstance().service
    }
    single {
        StorageService(get(), get())
    }
}
