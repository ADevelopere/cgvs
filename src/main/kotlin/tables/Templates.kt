package tables

import org.jetbrains.exposed.v1.core.Table
import org.jetbrains.exposed.v1.datetime.datetime

object Templates : Table() {
    val id = integer("id").autoIncrement()
    val name = varchar("name", 255)
    val description = text("description").nullable()
    val imageUrl = varchar("image_url", 500).nullable()
    val categoryId = integer("category_id").references(TemplateCategories.id)
    val preDeletionCategoryId = integer("pre_deletion_category_id").references(TemplateCategories.id).nullable()
    val order = integer("order").nullable()
    val deletedAt = datetime("deleted_at").nullable()
    val trashedAt = datetime("trashed_at").nullable()
    val createdAt = datetime("created_at")
    val updatedAt = datetime("updated_at")

    override val primaryKey = PrimaryKey(id)
}
