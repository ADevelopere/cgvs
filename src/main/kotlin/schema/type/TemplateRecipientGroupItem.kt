package models

import kotlinx.serialization.Serializable
import kotlinx.datetime.LocalDateTime

@Serializable
data class TemplateRecipientGroupItem(
    val id: Int = 0,
    val templateRecipientGroupId: Int,
    val studentId: Int,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
