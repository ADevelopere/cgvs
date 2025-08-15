package tables

import org.jetbrains.exposed.v1.core.Table
import org.jetbrains.exposed.v1.datetime.datetime
import org.jetbrains.exposed.v1.datetime.date

object TemplateVariables : Table("template_variables") {
    val id = integer("id").autoIncrement()
    val templateId = integer("template_id").references(Templates.id)
    val name = varchar("name", 255)
    val type = varchar("type", 50)
    val description = text("description").nullable()
    val previewValue = varchar("preview_value", 255).nullable()
    val required = bool("required").default(false)
    val order = integer("order")
    // Text variable properties
    val minLength = integer("min_length").nullable()
    val maxLength = integer("max_length").nullable()
    val pattern = varchar("pattern", 255).nullable()
    // Number variable properties
    val minValue = decimal("min_value", 65, 10).nullable()
    val maxValue = decimal("max_value", 65, 10).nullable()
    val decimalPlaces = integer("decimal_places").nullable()
    // Date variable properties
    val minDate = date("min_date").nullable()
    val maxDate = date("max_date").nullable()
    val format = varchar("format", 50).nullable()
    // Select variable properties
    val options = text("options").nullable() // JSON array
    val multiple = bool("multiple").nullable()
    val createdAt = datetime("created_at")
    val updatedAt = datetime("updated_at")

    override val primaryKey = PrimaryKey(id)

    init {
        uniqueIndex("template_variables_name_unique", templateId, name)
    }
}
