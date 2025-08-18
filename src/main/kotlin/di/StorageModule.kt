package di

import io.ktor.server.application.Application
import org.koin.dsl.module
import storage.gcp.getStorage

fun storageModule() = module {
    val storage = getStorage()
    println(storage.toString())
}
