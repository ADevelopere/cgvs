package repositories

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import kotlinx.datetime.Clock
import kotlinx.datetime.TimeZone
import kotlinx.datetime.toLocalDateTime
import org.jetbrains.exposed.v1.core.ResultRow
import org.jetbrains.exposed.v1.core.SqlExpressionBuilder.eq
import org.jetbrains.exposed.v1.core.or
import org.jetbrains.exposed.v1.jdbc.*
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import schema.model.*
import repositories.utils.TsQuery
import repositories.utils.TsVector
import repositories.utils.matches
import tables.Students

class StudentRepository(private val database: Database) {

    suspend fun create(student: Student): Student = dbQuery {
        val now = Clock.System.now().toLocalDateTime(TimeZone.UTC)
        val insertStatement = Students.insert {
            it[name] = student.name
            it[email] = student.email?.value
            it[phoneNumber] = student.phoneNumber?.number
            it[dateOfBirth] = student.dateOfBirth
            it[gender] = student.gender
            it[nationality] = student.nationality
            it[createdAt] = now
            it[updatedAt] = now
        }

        val id = insertStatement[Students.id]
        student.copy(
            id = id,
            createdAt = now,
            updatedAt = now
        )
    }

    suspend fun findById(id: Int): Student? = dbQuery {
        Students.selectAll()
            .where { Students.id eq id }
            .map { rowToStudent(it) }
            .singleOrNull()
    }

    suspend fun findAll(): List<Student> = dbQuery {
        Students.selectAll()
            .map { rowToStudent(it) }
    }


    /**
     * Returns the total count of students
     */
    suspend fun students(
        paginationArgs: PaginationArgs? = null,
        orderBy: List<OrderStudentsByClause>? = null,
        filterArgs: StudentFilterArgs? = null
    ): PaginatedStudentResponse = dbQuery {
        var query = Students.selectAll()

        // Filtering (StudentSortArgs)
        filterArgs?.let { args ->
            val ftsLang = "simple" // Use "simple" for language-agnostic, or "english", "arabic" etc.

            // Name filters
            args.name?.let {
                if (it.isNotBlank()) {
                    query = query.andWhere { TsVector(Students.name, ftsLang) matches TsQuery(it, ftsLang) }
                }
            }
            args.nameNotContains?.let { query = query.andWhere { Students.name notLike "%$it%" } }
            args.nameEquals?.let { query = query.andWhere { Students.name eq it } }
            args.nameNotEquals?.let { query = query.andWhere { Students.name neq it } }
            args.nameStartsWith?.let { query = query.andWhere { Students.name like "$it%" } }
            args.nameEndsWith?.let { query = query.andWhere { Students.name like "%$it" } }
            args.nameIsEmpty?.let { if (it) query = query.andWhere { Students.name eq "" } } // Name is not nullable
            args.nameIsNotEmpty?.let { if (it) query = query.andWhere { Students.name neq "" } }

            // Email filters
            args.email?.let {
                if (it.isNotBlank()) {
                    query = query.andWhere { TsVector(Students.email, ftsLang) matches TsQuery(it, ftsLang) }
                }
            }
            args.emailNotContains?.let { query = query.andWhere { Students.email notLike "%$it%" } }
            args.emailEquals?.let { query = query.andWhere { Students.email eq it.value } }
            args.emailNotEquals?.let { query = query.andWhere { Students.email neq it } }
            args.emailStartsWith?.let { query = query.andWhere { Students.email like "$it%" } }
            args.emailEndsWith?.let { query = query.andWhere { Students.email like "%$it" } }
            args.emailIsEmpty?.let { if (it) query = query.andWhere { Students.email.isNull() or (Students.email eq "") } }
            args.emailIsNotEmpty?.let { if (it) query = query.andWhere { Students.email.isNotNull() } }

            // Phone number filter
            args.phoneNumber?.let { query = query.andWhere { Students.phoneNumber eq it.number } }

            // Gender filter
            args.gender?.let { query = query.andWhere { Students.gender eq it } }

            // Nationality filter
            args.nationality?.let { query = query.andWhere { Students.nationality eq it } }

            // Created at filters
            args.createdAt?.let { query = query.andWhere { Students.createdAt eq it } }
            args.createdAtNot?.let { query = query.andWhere { Students.createdAt neq it } }
            args.createdAtFrom?.let { query = query.andWhere { Students.createdAt greaterEq it } }
            args.createdAtTo?.let { query = query.andWhere { Students.createdAt lessEq it } }
            args.createdAtAfter?.let { query = query.andWhere { Students.createdAt greater it } }
            args.createdAtBefore?.let { query = query.andWhere { Students.createdAt less it } }
            args.createdAtOnOrAfter?.let { query = query.andWhere { Students.createdAt greaterEq it } }
            args.createdAtOnOrBefore?.let { query = query.andWhere { Students.createdAt lessEq it } }
            args.createdAtIsEmpty?.let { if (it) query = query.andWhere { Students.createdAt.isNull() } }
            args.createdAtIsNotEmpty?.let { if (it) query = query.andWhere { Students.createdAt.isNotNull() } }

            // Birthdate filters (dateOfBirth is LocalDate, birthDate fields are LocalDateTime)
            args.birthDate?.let { query = query.andWhere { Students.dateOfBirth eq it.date } }
            args.birthDateNot?.let { query = query.andWhere { Students.dateOfBirth neq it.date } }
            args.birthDateFrom?.let { query = query.andWhere { Students.dateOfBirth greaterEq it.date } }
            args.birthDateTo?.let { query = query.andWhere { Students.dateOfBirth lessEq it.date } }
            args.birthDateAfter?.let { query = query.andWhere { Students.dateOfBirth greater it.date } }
            args.birthDateBefore?.let { query = query.andWhere { Students.dateOfBirth less it.date } }
            args.birthDateOnOrAfter?.let { query = query.andWhere { Students.dateOfBirth greaterEq it.date } }
            args.birthDateOnOrBefore?.let { query = query.andWhere { Students.dateOfBirth lessEq it.date } }
            args.birthDateIsEmpty?.let { if (it) query = query.andWhere { Students.dateOfBirth.isNull() } }
            args.birthDateIsNotEmpty?.let { if (it) query = query.andWhere { Students.dateOfBirth.isNotNull() } }
        }

        // Ordering (OrderStudentsByClause)
        orderBy?.forEach { clause ->
            val sortDirection = when (clause.order) {
                SortDirection.ASC -> org.jetbrains.exposed.v1.core.SortOrder.ASC
                SortDirection.DESC -> org.jetbrains.exposed.v1.core.SortOrder.DESC
            }
            query = when (clause.column) {
                OrderStudentsByColumn.ID -> query.orderBy(Students.id, sortDirection)
                OrderStudentsByColumn.NAME -> query.orderBy(Students.name, sortDirection)
                OrderStudentsByColumn.EMAIL -> query.orderBy(Students.email, sortDirection)
                OrderStudentsByColumn.DATE_OF_BIRTH -> query.orderBy(Students.dateOfBirth, sortDirection)

                OrderStudentsByColumn.GENDER -> query.orderBy(Students.gender, sortDirection)
                OrderStudentsByColumn.CREATED_AT -> query.orderBy(Students.createdAt, sortDirection)
                OrderStudentsByColumn.UPDATED_AT -> query.orderBy(Students.updatedAt, sortDirection)
            }
        }

        val total = runBlocking {
            countAll().toInt()
        }

        val perPage = minOf(
            paginationArgs?.first ?: paginationArgs?.defaultCount ?: PaginationArgs.DEFAULT_COUNT,
            paginationArgs?.maxCount ?: PaginationArgs.MAX_COUNT
        )
        val currentPage = paginationArgs?.page ?: 1
        val offset = paginationArgs?.skip ?: ((currentPage - 1) * perPage)
        val lastPage = if (total > 0) ((total - 1) / perPage) + 1 else 1
        val hasMorePages = currentPage < lastPage

        query = query.limit(perPage).offset(offset.toLong())

        val items = query.map { rowToStudent(it) }
        val paginationInfo = PaginationInfo(
            count = items.size,
            currentPage = currentPage,
            firstItem = if (items.isNotEmpty()) offset + 1 else null,
            hasMorePages = hasMorePages,
            lastItem = if (items.isNotEmpty()) offset + items.size else null,
            lastPage = lastPage,
            perPage = perPage,
            total = total
        )

        PaginatedStudentResponse(
            data = items,
            paginationInfo = paginationInfo
        )
    }

    suspend fun countAll(): Long = dbQuery {
        Students.selectAll().count()
    }

    suspend fun update(id: Int, student: Student): Student? {
        val updated = dbQuery {
            Students.update({ Students.id eq id }) {
                it[name] = student.name
                it[email] = student.email?.value
                it[phoneNumber] = student.phoneNumber?.number
                it[dateOfBirth] = student.dateOfBirth
                it[gender] = student.gender
                it[nationality] = student.nationality
                it[updatedAt] = Clock.System.now().toLocalDateTime(TimeZone.UTC)
            }
        }
        return if (updated > 0) {
            findById(id)
        } else {
            null
        }
    }

    suspend fun delete(id: Int): Boolean = dbQuery {
        Students.deleteWhere { Students.id eq id } > 0
    }

    private fun rowToStudent(row: ResultRow): Student {
        val phoneNumberValue = row[Students.phoneNumber]
        val phoneNumber = if (phoneNumberValue != null) {
            PhoneNumber(phoneNumberValue)
        } else {
            null
        }

        val emailValue = row[Students.email]
        val email = if (emailValue != null) {
            Email(emailValue)
        } else {
            null
        }

        return Student(
            id = row[Students.id],
            name = row[Students.name],
            email = email,
            phoneNumber = phoneNumber,
            dateOfBirth = row[Students.dateOfBirth],
            gender = row[Students.gender],
            nationality = row[Students.nationality],
            createdAt = row[Students.createdAt],
            updatedAt = row[Students.updatedAt]
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
