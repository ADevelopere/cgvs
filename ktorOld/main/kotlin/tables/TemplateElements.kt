package tables

import org.jetbrains.exposed.v1.core.Table
import org.jetbrains.exposed.v1.datetime.datetime

object TemplateElements : Table("template_elements") {
    val id = integer("id").autoIncrement()
    val templateId = integer("template_id").references(Templates.id)
    val type = enumerationByName("type", 20, ElementType::class)
    val xCoordinate = float("x_coordinate")
    val yCoordinate = float("y_coordinate")
    val fontSize = integer("font_size").nullable()
    val color = varchar("color", 20).nullable()
    val alignment = varchar("alignment", 20).nullable()
    val fontFamily = varchar("font_family", 100).nullable()
    val languageConstraint = varchar("language_constraint", 10).nullable()
    val createdAt = datetime("created_at")
    val updatedAt = datetime("updated_at")

    override val primaryKey = PrimaryKey(id)
}

enum class ElementType {
    static_text,
    data_text,
    data_date,
    image,
    qr_code
}
