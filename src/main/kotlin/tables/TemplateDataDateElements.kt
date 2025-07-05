package tables

import org.jetbrains.exposed.v1.core.Table
import org.jetbrains.exposed.v1.datetime.datetime

object TemplateDataDateElements : Table() {
    val elementId = integer("element_id").references(TemplateElements.id)
    val sourceType = enumerationByName("source_type", 20, SourceType::class)
    val sourceField = varchar("source_field", 100)
    val dateFormat = varchar("date_format", 50).nullable()
    val createdAt = datetime("created_at")
    val updatedAt = datetime("updated_at")

    override val primaryKey = PrimaryKey(elementId)
}
