package models

import com.expediagroup.graphql.server.extensions.getValueFromDataLoader
import graphql.schema.DataFetchingEnvironment
import kotlinx.serialization.Serializable
import kotlinx.datetime.LocalDate
import kotlinx.datetime.LocalDateTime
import schema.dataloaders.StudentDataLoader
import schema.dataloaders.TemplateDataLoader
import java.util.concurrent.CompletableFuture

@Serializable
data class Certificate(
    val id: Int = 0,
    val templateId: Int,
    val studentId: Int,
    val templateRecipientGroupId: Int,
    val releaseDate: LocalDate,
    val verificationCode: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
){
    fun student(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<Student?> {
        return dataFetchingEnvironment.getValueFromDataLoader(StudentDataLoader.dataLoaderName, studentId)
    }

    fun template(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<Template?> {
        return dataFetchingEnvironment.getValueFromDataLoader(TemplateDataLoader.dataLoaderName, templateId)
    }
}
