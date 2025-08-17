package schema.type

import com.expediagroup.graphql.server.extensions.getValueFromDataLoader
import graphql.schema.DataFetchingEnvironment
import kotlinx.datetime.LocalDateTime
import schema.dataloaders.TemplateDataLoader
import java.util.concurrent.CompletableFuture



enum class DataSourceType {
    student,
    template,
    certificate,
    custom
}

sealed class TemplateElement {
    abstract val id: String
    abstract val templateId: String
    abstract val xCoordinate: Float
    abstract val yCoordinate: Float
    abstract val fontSize: Int?
    abstract val color: String?
    abstract val alignment: String?
    abstract val fontFamily: String?
    abstract val languageConstraint: String?
    abstract val createdAt: LocalDateTime
    abstract val updatedAt: LocalDateTime

    abstract fun template(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<Template?>

    data class StaticText(
        override val id: String,
        override val templateId: String,
        override val xCoordinate: Float,
        override val yCoordinate: Float,
        override val fontSize: Int? = null,
        override val color: String? = null,
        override val alignment: String? = null,
        override val fontFamily: String? = null,
        override val languageConstraint: String? = null,
        override val createdAt: LocalDateTime,
        override val updatedAt: LocalDateTime,
        val content: String
    ) : TemplateElement() {
        override fun template(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<Template?> {
            return dataFetchingEnvironment.getValueFromDataLoader(TemplateDataLoader.dataLoaderName, templateId)
        }
    }

    data class DataText(
        override val id: String,
        override val templateId: String,
        override val xCoordinate: Float,
        override val yCoordinate: Float,
        override val fontSize: Int? = null,
        override val color: String? = null,
        override val alignment: String? = null,
        override val fontFamily: String? = null,
        override val languageConstraint: String? = null,
        override val createdAt: LocalDateTime,
        override val updatedAt: LocalDateTime,
        val sourceType: DataSourceType,
        val sourceField: String
    ) : TemplateElement() {
        override fun template(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<Template?> {
            return dataFetchingEnvironment.getValueFromDataLoader(TemplateDataLoader.dataLoaderName, templateId)
        }
    }

    data class DataDate(
        override val id: String,
        override val templateId: String,
        override val xCoordinate: Float,
        override val yCoordinate: Float,
        override val fontSize: Int? = null,
        override val color: String? = null,
        override val alignment: String? = null,
        override val fontFamily: String? = null,
        override val languageConstraint: String? = null,
        override val createdAt: LocalDateTime,
        override val updatedAt: LocalDateTime,
        val sourceType: DataSourceType,
        val sourceField: String,
        val dateFormat: String? = null
    ) : TemplateElement() {
        override fun template(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<Template?> {
            return dataFetchingEnvironment.getValueFromDataLoader(TemplateDataLoader.dataLoaderName, templateId)
        }
    }

    data class Image(
        override val id: String,
        override val templateId: String,
        override val xCoordinate: Float,
        override val yCoordinate: Float,
        override val fontSize: Int? = null,
        override val color: String? = null,
        override val alignment: String? = null,
        override val fontFamily: String? = null,
        override val languageConstraint: String? = null,
        override val createdAt: LocalDateTime,
        override val updatedAt: LocalDateTime,
        val imageUrl: String,
        val width: Float? = null,
        val height: Float? = null
    ) : TemplateElement() {
        override fun template(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<Template?> {
            return dataFetchingEnvironment.getValueFromDataLoader(TemplateDataLoader.dataLoaderName, templateId)
        }
    }

    data class QrCode(
        override val id: String,
        override val templateId: String,
        override val xCoordinate: Float,
        override val yCoordinate: Float,
        override val fontSize: Int? = null,
        override val color: String? = null,
        override val alignment: String? = null,
        override val fontFamily: String? = null,
        override val languageConstraint: String? = null,
        override val createdAt: LocalDateTime,
        override val updatedAt: LocalDateTime,
        val qrData: String,
        val size: Float? = null
    ) : TemplateElement() {
        override fun template(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<Template?> {
            return dataFetchingEnvironment.getValueFromDataLoader(TemplateDataLoader.dataLoaderName, templateId)
        }
    }
}
