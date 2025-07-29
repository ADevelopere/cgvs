//package repositories
//
//import models.TemplateElement
//import tables.TemplateElements
//import tables.ElementType
//import kotlinx.datetime.Clock
//import kotlinx.datetime.TimeZone
//import kotlinx.datetime.toLocalDateTime
//import org.jetbrains.exposed.v1.core.ResultRow
//import org.jetbrains.exposed.v1.core.SqlExpressionBuilder.eq
//import org.jetbrains.exposed.v1.jdbc.Database
//import org.jetbrains.exposed.v1.jdbc.deleteWhere
//import org.jetbrains.exposed.v1.jdbc.insert
//import org.jetbrains.exposed.v1.jdbc.selectAll
//import org.jetbrains.exposed.v1.jdbc.update
//import kotlinx.coroutines.Dispatchers
//import kotlinx.coroutines.withContext
//import org.jetbrains.exposed.v1.jdbc.transactions.transaction
//
//class TemplateElementRepository(private val database: Database) {
//
//    suspend fun create(element: TemplateElement): TemplateElement = dbQuery {
//        val now = Clock.System.now().toLocalDateTime(TimeZone.UTC)
//        val insertStatement = TemplateElements.insert {
//            it[templateId] = element.templateId
//            it[xCoordinate] = element.xCoordinate
//            it[yCoordinate] = element.yCoordinate
//            it[fontSize] = element.fontSize
//            it[color] = element.color
//            it[alignment] = element.alignment
//            it[fontFamily] = element.fontFamily
//            it[languageConstraint] = element.languageConstraint
//            it[createdAt] = now
//            it[updatedAt] = now
//        }
//
//        val id = insertStatement[TemplateElements.id]
//        element.copy(
//            id = id,
//            createdAt = now,
//            updatedAt = now
//        )
//    }
//
//    suspend fun findById(id: Int): TemplateElement? = dbQuery {
//        TemplateElements.selectAll()
//            .where { TemplateElements.id eq id }
//            .map { rowToTemplateElement(it) }
//            .singleOrNull()
//    }
//
//    suspend fun findByTemplate(templateId: Int): List<TemplateElement> = dbQuery {
//        TemplateElements.selectAll()
//            .where { TemplateElements.templateId eq templateId }
//            .map { rowToTemplateElement(it) }
//    }
//
//    suspend fun findByType(type: ElementType): List<TemplateElement> = dbQuery {
//        TemplateElements.selectAll()
//            .where { TemplateElements.type eq type }
//            .map { rowToTemplateElement(it) }
//    }
//
//    suspend fun findByTemplateAndType(templateId: Int, type: ElementType): List<TemplateElement> = dbQuery {
//        TemplateElements.selectAll()
//            .where { (TemplateElements.templateId eq templateId) and (TemplateElements.type eq type) }
//            .map { rowToTemplateElement(it) }
//    }
//
//    suspend fun findAll(): List<TemplateElement> = dbQuery {
//        TemplateElements.selectAll()
//            .map { rowToTemplateElement(it) }
//    }
//
//    suspend fun update(id: Int, element: TemplateElement): TemplateElement? {
//        val updated = dbQuery {
//            TemplateElements.update({ TemplateElements.id eq id }) {
//                it[templateId] = element.templateId
//                it[type] = element.type
//                it[xCoordinate] = element.xCoordinate
//                it[yCoordinate] = element.yCoordinate
//                it[fontSize] = element.fontSize
//                it[color] = element.color
//                it[alignment] = element.alignment
//                it[fontFamily] = element.fontFamily
//                it[languageConstraint] = element.languageConstraint
//                it[updatedAt] = Clock.System.now().toLocalDateTime(TimeZone.UTC)
//            }
//        }
//        return if (updated > 0) {
//            findById(id)
//        } else {
//            null
//        }
//    }
//
//    suspend fun delete(id: Int): Boolean = dbQuery {
//        TemplateElements.deleteWhere { TemplateElements.id eq id } > 0
//    }
//
//    suspend fun deleteByTemplate(templateId: Int): Boolean = dbQuery {
//        TemplateElements.deleteWhere { TemplateElements.templateId eq templateId } > 0
//    }
//
//    private fun rowToTemplateElement(row: ResultRow): TemplateElement {
//        return TemplateElement(
//            id = row[TemplateElements.id],
//            templateId = row[TemplateElements.templateId],
//            type = row[TemplateElements.type],
//            xCoordinate = row[TemplateElements.xCoordinate],
//            yCoordinate = row[TemplateElements.yCoordinate],
//            fontSize = row[TemplateElements.fontSize],
//            color = row[TemplateElements.color],
//            alignment = row[TemplateElements.alignment],
//            fontFamily = row[TemplateElements.fontFamily],
//            languageConstraint = row[TemplateElements.languageConstraint],
//            createdAt = row[TemplateElements.createdAt],
//            updatedAt = row[TemplateElements.updatedAt]
//        )
//    }
//
//    /**
//     * A helper function to execute a database transaction on a dedicated IO thread pool
//     */
//    private suspend fun <T> dbQuery(block: () -> T): T =
//        withContext(Dispatchers.IO) {
//            transaction(database) {
//                block()
//            }
//        }
//}
