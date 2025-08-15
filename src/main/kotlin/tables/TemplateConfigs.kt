package tables

import models.TemplateConfigKey
import org.jetbrains.exposed.v1.core.Table

object TemplateConfigs : Table() {
    val key = enumerationByName("key", 50, TemplateConfigKey::class).uniqueIndex()
    val value = text("value")

    override val primaryKey = PrimaryKey(key)
}

