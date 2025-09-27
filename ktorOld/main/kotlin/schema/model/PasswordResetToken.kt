package schema.model

import kotlinx.datetime.LocalDateTime

data class PasswordResetToken(
    val email: Email,
    val token: String,
    val createdAt: LocalDateTime? = null
)
