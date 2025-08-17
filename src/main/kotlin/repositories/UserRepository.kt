package repositories

import schema.type.User
import tables.Users
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
import schema.type.Email

class UserRepository(private val database: Database) {

    suspend fun create(user: User): User = dbQuery {
        val now = Clock.System.now().toLocalDateTime(TimeZone.UTC)
        val insertStatement = Users.insert {
            it[name] = user.name
            it[email] = user.email.value
            it[password] = user.password
            it[emailVerifiedAt] = user.emailVerifiedAt
            it[isAdmin] = user.isAdmin
            it[createdAt] = now
            it[updatedAt] = now
        }

        val id = insertStatement[Users.id]
        user.copy(
            id = id,
            createdAt = now,
            updatedAt = now
        )
    }

    suspend fun findById(id: Int): User? = dbQuery {
        Users.selectAll()
            .where { Users.id eq id }
            .map { rowToUser(it) }
            .singleOrNull()
    }

    suspend fun findByEmail(email: String): User? = dbQuery {
        Users.selectAll()
            .where { Users.email eq email }
            .map { rowToUser(it) }
            .singleOrNull()
    }

    suspend fun findAll(): List<User> = dbQuery {
        Users.selectAll()
            .map { rowToUser(it) }
    }

    suspend fun update(id: Int, user: User): User? {
        val updated = dbQuery {
            Users.update({ Users.id eq id }) {
                it[name] = user.name
                it[email] = user.email.value
                it[password] = user.password
                it[emailVerifiedAt] = user.emailVerifiedAt
                it[isAdmin] = user.isAdmin
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
        Users.deleteWhere { Users.id eq id } > 0
    }

    private fun rowToUser(row: ResultRow): User {
        return User(
            id = row[Users.id],
            name = row[Users.name],
            email = Email(row[Users.email]),
            password = row[Users.password],
            emailVerifiedAt = row[Users.emailVerifiedAt],
            isAdmin = row[Users.isAdmin],
            createdAt = row[Users.createdAt],
            updatedAt = row[Users.updatedAt]
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
