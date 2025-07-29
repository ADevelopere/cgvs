package tables

import org.jetbrains.exposed.v1.core.Table
import org.jetbrains.exposed.v1.datetime.datetime

object TemplateCategories : Table() {
    val id = integer("id").autoIncrement()
    val name = varchar("name", 255)
    val description = text("description").nullable()
    val parentCategoryId = integer("parent_category_id").references(id).nullable()
    val order = integer("order").nullable()
    val specialType = enumerationByName("special_type", 10, SpecialType::class).nullable()
    val deletedAt = datetime("deleted_at").nullable()
    val createdAt = datetime("created_at")
    val updatedAt = datetime("updated_at")

    override val primaryKey = PrimaryKey(id)
}

enum class SpecialType {
    deletion,
    main
}
