package repositories

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.jetbrains.exposed.v1.core.ResultRow
import org.jetbrains.exposed.v1.core.SqlExpressionBuilder.eq
import org.jetbrains.exposed.v1.core.SqlExpressionBuilder.inList
import org.jetbrains.exposed.v1.jdbc.*
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import repositories.utils.applyStudentFilters
import repositories.utils.applyStudentOrdering
import repositories.utils.paginate
import schema.model.*
import tables.Students
import util.now


class StudentRepository(private val database: Database) {

    suspend fun create(student: Student): Student = dbQuery {
        val now = now()
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

    suspend fun existsById(id: Int): Boolean = dbQuery {
        Students.select(Students.id eq id)
            .limit(1)
            .count() > 0
    }

    suspend fun findAll(): List<Student> = dbQuery {
        Students.selectAll()
            .map { rowToStudent(it) }
    }

    suspend fun allExistsByIds(ids: Set<Int>) = dbQuery {
        val count = Students.select(Students.id inList ids)
            .count()
        count == ids.size.toLong()
    }


    /**
     * Returns the total count of students
     */
    suspend fun students(
        paginationArgs: PaginationArgs? = null,
        orderBy: List<OrderStudentsByClause>? = null,
        filterArgs: StudentFilterArgs? = null
    ): PaginatedStudentResponse {
        val total = countAll().toInt()

        return dbQuery {
            val query = Students.selectAll()
                .applyStudentFilters(filterArgs)
                .applyStudentOrdering(orderBy)

            paginationArgs?.let {
                query.paginate(paginationArgs)
            }

            val items = query.map { rowToStudent(it) }
            val paginationInfo = paginationArgsToInfo(
                args = paginationArgs,
                count = items.size,
                total = total,
            )

            PaginatedStudentResponse(
                data = items,
                paginationInfo = paginationInfo
            )
        }
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
                it[updatedAt] = now()
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

fun rowToStudent(row: ResultRow): Student {
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
