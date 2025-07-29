package models

import kotlinx.serialization.Serializable

@Serializable
data class UserSession(
    val userId: Int,
    val email: String,
    val sessionId: String,
    val isAdmin: Boolean = false,
    val isAuthenticated: Boolean = true
)
