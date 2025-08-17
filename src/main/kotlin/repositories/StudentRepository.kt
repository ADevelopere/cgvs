package repositories

import schema.type.Student
import tables.Students
import kotlinx.datetime.Clock
import kotlinx.datetime.TimeZone
import kotlinx.datetime.toLocalDateTime
import org.jetbrains.exposed.v1.core.ResultRow
import org.jetbrains.exposed.v1.core.SqlExpressionBuilder.eq
import org.jetbrains.exposed.v1.jdbc.Database
import org.jetbrains.exposed.v1.jdbc.deleteWhere
import org.jetbrains.exposed.v1.jdbc.insert
import org.jetbrains.exposed.v1.jdbc.selectAll
import org.jetbrains.exposed.v1.jdbc.update
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import schema.type.Gender
import schema.type.Nationality
import schema.type.PhoneNumber

class StudentRepository(private val database: Database) : PaginatableRepository<Student> {

    suspend fun create(student: Student): Student = dbQuery {
        val now = Clock.System.now().toLocalDateTime(TimeZone.UTC)
        val insertStatement = Students.insert {
            it[name] = student.name
            it[email] = student.email
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

    suspend fun findByEmail(email: String): Student? = dbQuery {
        Students.selectAll()
            .where { Students.email eq email }
            .map { rowToStudent(it) }
            .singleOrNull()
    }

    suspend fun findAll(): List<Student> = dbQuery {
        Students.selectAll()
            .map { rowToStudent(it) }
    }

    suspend fun findActive(): List<Student> = dbQuery {
        Students.selectAll()
            .where { Students.deletedAt.isNull() }
            .map { rowToStudent(it) }
    }

    suspend fun findByGender(gender: Gender): List<Student> = dbQuery {
        Students.selectAll()
            .where { Students.gender eq gender }
            .map { rowToStudent(it) }
    }

    suspend fun findByNationality(nationality: Nationality): List<Student> = dbQuery {
        Students.selectAll()
            .where { Students.nationality eq nationality }
            .map { rowToStudent(it) }
    }

    /**
     * Fetches students with pagination (limit/offset)
     */
    override suspend fun findPaginated(limit: Int, offset: Int): List<Student> = dbQuery {
        Students.selectAll()
            .limit(limit)
            .offset(offset.toLong())
            .map { rowToStudent(it) }
    }

    /**
     * Returns the total count of students
     */
    override suspend fun countAll(): Int = dbQuery {
        Students.selectAll().count().toInt()
    }

    suspend fun update(id: Int, student: Student): Student? {
        val updated = dbQuery {
            Students.update({ Students.id eq id }) {
                it[name] = student.name
                it[email] = student.email
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

    suspend fun softDelete(id: Int): Boolean {
        val now = Clock.System.now().toLocalDateTime(TimeZone.UTC)
        val updated = dbQuery {
            Students.update({ Students.id eq id }) {
                it[deletedAt] = now
                it[updatedAt] = now
            }
        }
        return updated > 0
    }

    suspend fun restore(id: Int): Boolean {
        val updated = dbQuery {
            Students.update({ Students.id eq id }) {
                it[deletedAt] = null
                it[updatedAt] = Clock.System.now().toLocalDateTime(TimeZone.UTC)
            }
        }
        return updated > 0
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

        return Student(
            id = row[Students.id],
            name = row[Students.name],
            email = row[Students.email],
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
