package schema.model

import kotlinx.datetime.LocalDateTime

data class User(
    val id: Int = 0,
    val name: String,
    val email: Email,
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

data class LoginInput(
    val email: String,
    val password: String
)

data class RegisterInput(
    val name: String,
    val email: Email,
    val password: String
)
