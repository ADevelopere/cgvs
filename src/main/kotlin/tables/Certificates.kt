package tables

import org.jetbrains.exposed.v1.core.Table
import org.jetbrains.exposed.v1.datetime.date
import org.jetbrains.exposed.v1.datetime.datetime

object Certificates : Table() {
    val id = integer("id").autoIncrement()
    val templateId = integer("template_id").references(Templates.id)
    val studentId = integer("student_id").references(Students.id)
    val templateRecipientGroupId = integer("template_recipient_group_id").references(TemplateRecipientGroups.id)
    val releaseDate = date("release_date")
    val verificationCode = varchar("verification_code", 255).uniqueIndex()
    val deletedAt = datetime("deleted_at").nullable()
    val createdAt = datetime("created_at")
    val updatedAt = datetime("updated_at")

    override val primaryKey = PrimaryKey(id)
    
    init {
        uniqueIndex("unique_student_template_certificate", templateId, studentId)
    }
}
