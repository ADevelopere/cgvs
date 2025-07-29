package repositories

import models.PasswordResetToken
import tables.PasswordResetTokens
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

class PasswordResetTokenRepository(private val database: Database) {

    suspend fun create(token: PasswordResetToken): PasswordResetToken = dbQuery {
        val now = Clock.System.now().toLocalDateTime(TimeZone.UTC)
        PasswordResetTokens.insert {
            it[email] = token.email
            it[this.token] = token.token
            it[createdAt] = now
        }
        token.copy(createdAt = now)
    }

    suspend fun findByEmail(email: String): PasswordResetToken? = dbQuery {
        PasswordResetTokens.selectAll()
            .where { PasswordResetTokens.email eq email }
            .map { rowToPasswordResetToken(it) }
            .singleOrNull()
    }

    suspend fun findByToken(token: String): PasswordResetToken? = dbQuery {
        PasswordResetTokens.selectAll()
            .where { PasswordResetTokens.token eq token }
            .map { rowToPasswordResetToken(it) }
            .singleOrNull()
    }

    suspend fun findAll(): List<PasswordResetToken> = dbQuery {
        PasswordResetTokens.selectAll()
            .map { rowToPasswordResetToken(it) }
    }

    suspend fun update(email: String, token: PasswordResetToken): PasswordResetToken? {
        val updated = dbQuery {
            PasswordResetTokens.update({ PasswordResetTokens.email eq email }) {
                it[this.token] = token.token
                it[createdAt] = token.createdAt
            }
        }
        return if (updated > 0) {
            findByEmail(email)
        } else {
            null
        }
    }

    suspend fun delete(email: String): Boolean = dbQuery {
        PasswordResetTokens.deleteWhere { PasswordResetTokens.email eq email } > 0
    }

    suspend fun deleteByToken(token: String): Boolean = dbQuery {
        PasswordResetTokens.deleteWhere { PasswordResetTokens.token eq token } > 0
    }

    private fun rowToPasswordResetToken(row: ResultRow): PasswordResetToken {
        return PasswordResetToken(
            email = row[PasswordResetTokens.email],
            token = row[PasswordResetTokens.token],
            createdAt = row[PasswordResetTokens.createdAt]
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
