package schema.type

import kotlinx.serialization.Serializable
import kotlinx.datetime.LocalDateTime

@Serializable
data class User(
    val id: Int = 0,
    val name: String,
    val email: String,
    val emailVerifiedAt: LocalDateTime? = null,
    val password: String,
    val isAdmin: Boolean = false,
    val rememberToken: String? = null,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

data class AuthPayload(
    val token: String,
    val user: User
)

data class LogoutResponse(
    val message: String
)

@Serializable
data class LoginInput(
    val email: String,
    val password: String
)

@Serializable
data class RegisterInput(
    val name: String,
    val email: String,
    val password: String
)
