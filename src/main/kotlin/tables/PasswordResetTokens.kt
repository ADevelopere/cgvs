package tables

import org.jetbrains.exposed.v1.core.Table
import org.jetbrains.exposed.v1.datetime.datetime

object PasswordResetTokens : Table() {
    val email = varchar("email", 255)
    val token = varchar("token", 255)
    val createdAt = datetime("created_at").nullable()

    override val primaryKey = PrimaryKey(email)
}
