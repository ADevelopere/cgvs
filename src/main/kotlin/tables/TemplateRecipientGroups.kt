package tables

import org.jetbrains.exposed.v1.core.Table
import org.jetbrains.exposed.v1.datetime.datetime

object TemplateRecipientGroups : Table("template_recipient_groups") {
    val id = integer("id").autoIncrement()
    val templateId = integer("template_id").references(Templates.id)
    val name = varchar("name", 255)
    val description = text("description").nullable()
    val createdAt = datetime("created_at")
    val updatedAt = datetime("updated_at")

    override val primaryKey = PrimaryKey(id)
}
