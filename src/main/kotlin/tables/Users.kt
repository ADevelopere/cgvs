package tables

import org.jetbrains.exposed.v1.core.Table
import org.jetbrains.exposed.v1.datetime.datetime

object Users : Table() {
    val id = integer("id").autoIncrement()
    val name = varchar("name", 255)
    val email = varchar("email", 255).uniqueIndex()
    val emailVerifiedAt = datetime("email_verified_at").nullable()
    val password = varchar("password", 255)
    val isAdmin = bool("is_admin").default(false)
    val rememberToken = varchar("remember_token", 100).nullable()
    val createdAt = datetime("created_at")
    val updatedAt = datetime("updated_at")

    override val primaryKey = PrimaryKey(id)
}
