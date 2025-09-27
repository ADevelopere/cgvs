package schema.model

import kotlinx.serialization.Serializable
import kotlinx.datetime.LocalDateTime

@Serializable
data class RecipientGroupItemVariableValue(
    val id: Int = 0,
    val templateRecipientGroupItemId: Int,
    val templateVariableId: Int,
    val value: String? = null,
    val valueIndexed: String? = null,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
