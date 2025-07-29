package tables

import org.jetbrains.exposed.v1.core.Table
import org.jetbrains.exposed.v1.datetime.datetime

object TemplateImageElements : Table() {
    val elementId = integer("element_id").references(TemplateElements.id)
    val imageUrl = varchar("image_url", 500)
    val width = integer("width").nullable()
    val height = integer("height").nullable()
    val createdAt = datetime("created_at")
    val updatedAt = datetime("updated_at")

    override val primaryKey = PrimaryKey(elementId)
}
