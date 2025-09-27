package tables

import org.jetbrains.exposed.v1.core.Table

object Sessions : Table() {
    val id = varchar("id", 255)
    val userId = integer("user_id").references(Users.id).nullable()
    val ipAddress = varchar("ip_address", 45).nullable()
    val userAgent = text("user_agent").nullable()
    val payload = text("payload")
    val lastActivity = integer("last_activity")

    override val primaryKey = PrimaryKey(id)

    init {
        index("sessions_user_id_index", false, userId) // Removed unique constraint
        index("sessions_last_activity_index", true, lastActivity)
    }
}
