package tables

import org.jetbrains.exposed.v1.core.Table
import org.jetbrains.exposed.v1.datetime.datetime
import org.jetbrains.exposed.v1.datetime.date
import schema.type.TemplateVariableType

// Base table for all template variables
object TemplateVariableBase : Table("template_variable_base") {
    val id = integer("id").autoIncrement()
    val templateId = integer("template_id").references(Templates.id)
    val name = varchar("name", 255)
    val description = text("description").nullable()
    val type = enumerationByName("type", 50, TemplateVariableType::class)
    val required = bool("required").default(false)
    val order = integer("order")
    val createdAt = datetime("created_at")
    val updatedAt = datetime("updated_at")
    override val primaryKey = PrimaryKey(id)

    init {
        uniqueIndex("template_variable_base_name_unique", templateId, name)
    }
}

// Text variable properties table
object TextTemplateVariables : Table("text_template_variables") {
    val id = integer("id").references(TemplateVariableBase.id)
    val minLength = integer("min_length").nullable()
    val maxLength = integer("max_length").nullable()
    val pattern = varchar("pattern", 255).nullable()
    val previewValue = varchar("preview_value", 255).nullable()
    override val primaryKey = PrimaryKey(id)
}

// Number variable properties table
object NumberTemplateVariables : Table("number_template_variables") {
    val id = integer("id").references(TemplateVariableBase.id)
    val minValue = decimal("min_value", 65, 10).nullable()
    val maxValue = decimal("max_value", 65, 10).nullable()
    val decimalPlaces = integer("decimal_places").nullable()
    val previewValue = decimal("preview_value", 65, 10).nullable()
    override val primaryKey = PrimaryKey(id)
}

// Date variable properties table
object DateTemplateVariables : Table("date_template_variables") {
    val id = integer("id").references(TemplateVariableBase.id)
    val minDate = date("min_date").nullable()
    val maxDate = date("max_date").nullable()
    val format = varchar("format", 50).nullable()
    val previewValue = date("preview_value").nullable()
    override val primaryKey = PrimaryKey(id)
}

// Select variable properties table
object SelectTemplateVariables : Table("select_template_variables") {
    val id = integer("id").references(TemplateVariableBase.id)
    val options = text("options").nullable() // JSON array
    val multiple = bool("multiple").nullable()
    val previewValue = varchar("preview_value", 255).nullable()
    override val primaryKey = PrimaryKey(id)
}
