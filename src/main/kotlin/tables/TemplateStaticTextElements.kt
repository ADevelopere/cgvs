package tables

import org.jetbrains.exposed.v1.core.Table
import org.jetbrains.exposed.v1.datetime.datetime

object TemplateStaticTextElements : Table() {
    val elementId = integer("element_id").references(TemplateElements.id)
    val content = text("content")
    val createdAt = datetime("created_at")
    val updatedAt = datetime("updated_at")

    override val primaryKey = PrimaryKey(elementId)
}
