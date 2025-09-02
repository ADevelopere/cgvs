package tables

import org.jetbrains.exposed.v1.core.Table
import org.jetbrains.exposed.v1.datetime.datetime

object Templates : Table() {
    val id = integer("id").autoIncrement()
    val name = varchar("name", 255)
    val description = text("description").nullable()
    val imageFileId = reference("image_file_id", StorageFiles.id).nullable()
    val categoryId = integer("category_id").references(TemplateCategories.id)
    val order = integer("order")
    val preSuspensionCategoryId = integer("pre_suspension_category_id").references(TemplateCategories.id).nullable()
    val createdAt = datetime("created_at")
    val updatedAt = datetime("updated_at")

    override val primaryKey = PrimaryKey(id)
}
