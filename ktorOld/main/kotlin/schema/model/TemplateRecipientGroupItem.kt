package schema.model

import com.expediagroup.graphql.generator.annotations.GraphQLIgnore
import com.expediagroup.graphql.server.extensions.getValueFromDataLoader
import graphql.schema.DataFetchingEnvironment
import kotlinx.datetime.LocalDateTime
import schema.dataloaders.StudentDataLoader
import schema.dataloaders.TemplateRecipientGroupDataLoader
import java.util.concurrent.CompletableFuture

@Suppress("unused")
data class TemplateRecipientGroupItem(
    val id: Int,
    @GraphQLIgnore
    val templateRecipientGroupId: Int,
    @GraphQLIgnore
    val studentId: Int,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
){
    fun student(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<Student?> {
        return dataFetchingEnvironment.getValueFromDataLoader(StudentDataLoader.dataLoaderName, studentId)
    }

    fun recipientGroup(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<TemplateRecipientGroup?> {
        return dataFetchingEnvironment.getValueFromDataLoader(TemplateRecipientGroupDataLoader.dataLoaderName, templateRecipientGroupId)
    }
}


data class AddStudentToRecipientGroupInput(
    val groupId: Int,
    val studentId: Int
) {
    fun toTemplateRecipientGroupItem(
        id: Int,
        createdAt: LocalDateTime,
        updatedAt: LocalDateTime
    ) = TemplateRecipientGroupItem(
        id = id,
        templateRecipientGroupId = groupId,
        studentId = studentId,
        createdAt = createdAt,
        updatedAt = updatedAt
    )
}

data class AddStudentsToRecipientGroupInput(
    val groupId: Int,
    val studentIds: Set<Int>
)
