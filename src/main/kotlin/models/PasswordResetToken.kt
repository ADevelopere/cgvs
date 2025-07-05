package models

import kotlinx.serialization.Serializable
import kotlinx.datetime.LocalDateTime

@Serializable
data class PasswordResetToken(
    val email: String,
    val token: String,
    val createdAt: LocalDateTime? = null
)
