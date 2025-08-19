package schema.type

import kotlinx.serialization.Serializable

@Serializable
data class UserSession(
    val userId: Int,
    val email: Email,
    val sessionId: String,
    val isAdmin: Boolean = false,
    val isAuthenticated: Boolean = true
)
