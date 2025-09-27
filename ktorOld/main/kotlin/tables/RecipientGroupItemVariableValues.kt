package tables

import org.jetbrains.exposed.v1.core.Table
import org.jetbrains.exposed.v1.datetime.datetime

object RecipientGroupItemVariableValues : Table("recipient_group_item_variable_values") {
    val id = integer("id").autoIncrement()
    val templateRecipientGroupItemId = integer("template_recipient_group_item_id").references(TemplateRecipientGroupItems.id)
    val templateVariableId = integer("template_variable_id").references(TemplateVariableBase.id)
    val value = text("value").nullable()
    val valueIndexed = varchar("value_indexed", 255).nullable()
    val createdAt = datetime("created_at")
    val updatedAt = datetime("updated_at")

    override val primaryKey = PrimaryKey(id)

    init {
        uniqueIndex("rgiv_group_item_variable_unique", templateRecipientGroupItemId, templateVariableId)
        index("rgiv_value_idx", false, valueIndexed)
    }
}
