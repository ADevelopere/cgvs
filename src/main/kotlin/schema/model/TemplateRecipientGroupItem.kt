package schema.model

import kotlinx.datetime.LocalDateTime

data class TemplateRecipientGroupItem(
    val id: Int,
    val templateRecipientGroupId: Int,
    val studentId: Int,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)


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
