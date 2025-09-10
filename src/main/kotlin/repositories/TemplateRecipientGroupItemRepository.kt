package repositories

import schema.model.TemplateRecipientGroupItem
import tables.TemplateRecipientGroupItems
import org.jetbrains.exposed.v1.core.ResultRow
import org.jetbrains.exposed.v1.core.SqlExpressionBuilder.eq
import org.jetbrains.exposed.v1.jdbc.Database
import org.jetbrains.exposed.v1.jdbc.deleteWhere
import org.jetbrains.exposed.v1.jdbc.insert
import org.jetbrains.exposed.v1.jdbc.batchInsert
import org.jetbrains.exposed.v1.jdbc.selectAll
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.jetbrains.exposed.v1.core.SqlExpressionBuilder.inList
import org.jetbrains.exposed.v1.core.alias
import org.jetbrains.exposed.v1.core.and
import org.jetbrains.exposed.v1.core.leftJoin
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import repositories.utils.applyStudentFilters
import repositories.utils.applyStudentOrdering
import repositories.utils.paginate
import schema.model.AddStudentToRecipientGroupInput
import schema.model.AddStudentsToRecipientGroupInput
import schema.model.OrderStudentsByClause
import schema.model.PaginatedStudentResponse
import schema.model.PaginationArgs
import schema.model.StudentFilterArgs
import schema.model.paginationArgsToInfo
import tables.Students
import util.now

class TemplateRecipientGroupItemRepository(private val database: Database) {

    suspend fun addStudent(input: AddStudentToRecipientGroupInput): TemplateRecipientGroupItem = dbQuery {
        val now = now()
        val insertStatement = TemplateRecipientGroupItems.insert {
            it[templateRecipientGroupId] = input.groupId
            it[studentId] = input.studentId
            it[createdAt] = now
            it[updatedAt] = now
        }

        val id = insertStatement[TemplateRecipientGroupItems.id]
        input.toTemplateRecipientGroupItem(
            id = id,
            createdAt = now,
            updatedAt = now
        )
    }

    suspend fun addNonExistentStudents(input: AddStudentsToRecipientGroupInput): List<TemplateRecipientGroupItem> =
        dbQuery {
            val now = now()
            val insertedRows = TemplateRecipientGroupItems.batchInsert(
                data = input.studentIds,
                ignore = true,
                shouldReturnGeneratedValues = true
            ) { studentId ->
                this[TemplateRecipientGroupItems.templateRecipientGroupId] = input.groupId
                this[TemplateRecipientGroupItems.studentId] = studentId
                this[TemplateRecipientGroupItems.createdAt] = now
                this[TemplateRecipientGroupItems.updatedAt] = now
            }
            insertedRows.map { rowToTemplateRecipientGroupItem(it) }
        }

    suspend fun findById(id: Int): TemplateRecipientGroupItem? = dbQuery {
        TemplateRecipientGroupItems.selectAll()
            .where { TemplateRecipientGroupItems.id eq id }
            .map { rowToTemplateRecipientGroupItem(it) }
            .singleOrNull()
    }

    suspend fun findByStudent(studentId: Int): List<TemplateRecipientGroupItem> = dbQuery {
        TemplateRecipientGroupItems.selectAll()
            .where { TemplateRecipientGroupItems.studentId eq studentId }
            .map { rowToTemplateRecipientGroupItem(it) }
    }

    suspend fun findByGroupIdAndStudentId(groupId: Int, studentId: Int): TemplateRecipientGroupItem? = dbQuery {
        TemplateRecipientGroupItems.selectAll()
            .where {
                (TemplateRecipientGroupItems.templateRecipientGroupId eq groupId) and
                    (TemplateRecipientGroupItems.studentId eq studentId)
            }
            .map { rowToTemplateRecipientGroupItem(it) }
            .singleOrNull()
    }

    suspend fun existsByGroupIdAndStudentId(groupId: Int, studentId: Int): Boolean = dbQuery {
        TemplateRecipientGroupItems.selectAll()
            .where {
                (TemplateRecipientGroupItems.templateRecipientGroupId eq groupId) and
                    (TemplateRecipientGroupItems.studentId eq studentId)
            }
            .count() > 0
    }

    suspend fun remove(id: Int): Boolean = dbQuery {
        TemplateRecipientGroupItems.deleteWhere { TemplateRecipientGroupItems.id eq id } > 0
    }

    suspend fun removeSet(ids: Set<Int>): List<TemplateRecipientGroupItem> = dbQuery {
        val itemsToRemove = TemplateRecipientGroupItems.selectAll()
            .where { TemplateRecipientGroupItems.id inList ids }
            .map { rowToTemplateRecipientGroupItem(it) }

        TemplateRecipientGroupItems.deleteWhere { TemplateRecipientGroupItems.id inList ids }
        itemsToRemove
    }

    suspend fun searchStudentsInGroup(
        groupId: Int,
        orderBy: List<OrderStudentsByClause>?,
        paginationArgs: PaginationArgs?,
        filterArgs: StudentFilterArgs?
    ): PaginatedStudentResponse {
        val total = countStudentsInGroup(groupId)

        return dbQuery {
            val query = (Students innerJoin TemplateRecipientGroupItems)
                .selectAll()
                .where { TemplateRecipientGroupItems.templateRecipientGroupId eq groupId }
                .applyStudentFilters(filterArgs)
            
            query
                .applyStudentOrdering(orderBy)

            paginationArgs?.let {
                query.paginate(paginationArgs)
            }

            val students = query.map { rowToStudent(it) }
            val paginationInfo = paginationArgsToInfo(
                args = paginationArgs,
                count = students.size,
                total = total,
            )

            PaginatedStudentResponse(
                data = students,
                paginationInfo = paginationInfo
            )
        }
    }

    suspend fun countStudentsInGroup(groupId: Int): Int = dbQuery {
        TemplateRecipientGroupItems
            .selectAll()
            .where { TemplateRecipientGroupItems.templateRecipientGroupId eq groupId }
            .count()
            .toInt()
    }

    suspend fun searchStudentsNotInGroup(
        groupId: Int,
        orderBy: List<OrderStudentsByClause>?,
        paginationArgs: PaginationArgs?,
        filterArgs: StudentFilterArgs?
    ): PaginatedStudentResponse {
        val total = countStudentsNotInGroup(groupId, filterArgs)

        return dbQuery {
            val groupItemsAlias = TemplateRecipientGroupItems.alias("trgi")
            val query = Students
                .leftJoin(
                    groupItemsAlias,
                    onColumn = { Students.id },
                    otherColumn = { groupItemsAlias[TemplateRecipientGroupItems.studentId] },
                    additionalConstraint = { groupItemsAlias[TemplateRecipientGroupItems.templateRecipientGroupId] eq groupId }
                )
                .selectAll()
                .where { groupItemsAlias[TemplateRecipientGroupItems.id].isNull() }
                .applyStudentFilters(filterArgs)

            query.applyStudentOrdering(orderBy)

            paginationArgs?.let {
                query.paginate(paginationArgs)
            }

            val students = query.map { rowToStudent(it) }
            val paginationInfo = paginationArgsToInfo(
                args = paginationArgs,
                count = students.size,
                total = total,
            )

            PaginatedStudentResponse(
                data = students,
                paginationInfo = paginationInfo
            )
        }
    }

    suspend fun countStudentsNotInGroup(groupId: Int, filterArgs: StudentFilterArgs? = null): Int = dbQuery {
        val groupItemsAlias = TemplateRecipientGroupItems.alias("trgi")
        Students
            .leftJoin(
                groupItemsAlias,
                onColumn = { Students.id },
                otherColumn = { groupItemsAlias[TemplateRecipientGroupItems.studentId] },
                additionalConstraint = { groupItemsAlias[TemplateRecipientGroupItems.templateRecipientGroupId] eq groupId }
            )
            .selectAll()
            .where { groupItemsAlias[TemplateRecipientGroupItems.id].isNull() }
            .applyStudentFilters(filterArgs)
            .count()
            .toInt()
    }

    private fun rowToTemplateRecipientGroupItem(row: ResultRow): TemplateRecipientGroupItem {
        return TemplateRecipientGroupItem(
            id = row[TemplateRecipientGroupItems.id],
            templateRecipientGroupId = row[TemplateRecipientGroupItems.templateRecipientGroupId],
            studentId = row[TemplateRecipientGroupItems.studentId],
            createdAt = row[TemplateRecipientGroupItems.createdAt],
            updatedAt = row[TemplateRecipientGroupItems.updatedAt]
        )
    }

    /**
     * A helper function to execute a database transaction on a dedicated IO thread pool
     */
    private suspend fun <T> dbQuery(block: () -> T): T =
        withContext(Dispatchers.IO) {
            transaction(database) {
                block()
            }
        }
}
