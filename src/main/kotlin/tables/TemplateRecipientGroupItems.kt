package tables

import org.jetbrains.exposed.v1.core.Table
import org.jetbrains.exposed.v1.datetime.datetime

object TemplateRecipientGroupItems : Table("template_recipient_group_items") {
    val id = integer("id").autoIncrement()
    val templateRecipientGroupId = integer("template_recipient_group_id").references(TemplateRecipientGroups.id)
    val studentId = integer("student_id").references(Students.id)
    val createdAt = datetime("created_at")
    val updatedAt = datetime("updated_at")

    override val primaryKey = PrimaryKey(id)

    init {
        uniqueIndex("trgi_student_group_unique", studentId, templateRecipientGroupId)
    }
}
