package tables

import org.jetbrains.exposed.v1.core.Table
import org.jetbrains.exposed.v1.datetime.datetime

object TemplateQrCodeElements : Table("template_qr_code_elements") {
    val elementId = integer("element_id").references(TemplateElements.id)
    val size = integer("size").nullable()
    val createdAt = datetime("created_at")
    val updatedAt = datetime("updated_at")

    override val primaryKey = PrimaryKey(elementId)
}
