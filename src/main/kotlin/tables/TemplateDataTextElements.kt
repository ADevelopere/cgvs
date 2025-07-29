package tables

import org.jetbrains.exposed.v1.core.Table
import org.jetbrains.exposed.v1.datetime.datetime

object TemplateDataTextElements : Table() {
    val elementId = integer("element_id").references(TemplateElements.id)
    val sourceType = enumerationByName("source_type", 20, SourceType::class)
    val sourceField = varchar("source_field", 100)
    val createdAt = datetime("created_at")
    val updatedAt = datetime("updated_at")

    override val primaryKey = PrimaryKey(elementId)
}

enum class SourceType {
    student,
    variable,
    certificate
}
