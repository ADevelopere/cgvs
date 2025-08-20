package plugins

import com.fasterxml.jackson.core.JsonGenerator
import com.fasterxml.jackson.databind.JsonSerializer
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.databind.SerializerProvider
import com.fasterxml.jackson.databind.module.SimpleModule
import io.ktor.serialization.jackson.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.routing.*
import kotlinx.datetime.LocalDateTime
import kotlinx.serialization.Serializable
import org.koin.ktor.ext.inject
import services.StorageService

@Serializable
data class GenerateUploadUrlRequest(
    val filename: String,
    val contentType: String = "application/octet-stream",
    val folder: String = ""
)

fun Application.configureStorageRouting() {

    val storageService: StorageService by inject()

    routing {
        route("/upload") {
            install(ContentNegotiation) {
                jackson {
                    val module = SimpleModule()
                    module.addSerializer(LocalDateTime::class.java, object : JsonSerializer<LocalDateTime>() {
                        override fun serialize(value: LocalDateTime, gen: JsonGenerator, serializers: SerializerProvider) {
                            gen.writeString(value.toString())
                        }
                    })
                    registerModule(module)
                    disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
                }
            }

            post("/public/template-cover") {
                storageService.handleFileUpload(call, "public/templateCover")
            }

            post("/public") {
                storageService.handleFileUpload(call, "public")
            }
        }
    }
}
