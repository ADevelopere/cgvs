package schema.model

import kotlinx.serialization.Serializable

@Serializable
data class Session(
    val id: String,
    val userId: Int? = null,
    val ipAddress: String? = null,
    val userAgent: String? = null,
    val payload: String,
    val lastActivity: Int
)
