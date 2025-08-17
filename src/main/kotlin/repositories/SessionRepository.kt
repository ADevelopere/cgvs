package repositories

import schema.type.Session
import tables.Sessions
import org.jetbrains.exposed.v1.core.ResultRow
import org.jetbrains.exposed.v1.core.SqlExpressionBuilder.eq
import org.jetbrains.exposed.v1.jdbc.Database
import org.jetbrains.exposed.v1.jdbc.deleteWhere
import org.jetbrains.exposed.v1.jdbc.insert
import org.jetbrains.exposed.v1.jdbc.selectAll
import org.jetbrains.exposed.v1.jdbc.update
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.jetbrains.exposed.v1.core.SqlExpressionBuilder.less
import org.jetbrains.exposed.v1.jdbc.transactions.transaction

class SessionRepository(private val database: Database) {

    suspend fun create(session: Session): Session = dbQuery {
        Sessions.insert {
            it[id] = session.id
            it[userId] = session.userId
            it[ipAddress] = session.ipAddress
            it[userAgent] = session.userAgent
            it[payload] = session.payload
            it[lastActivity] = session.lastActivity
        }
        session
    }

    suspend fun findById(id: String): Session? = dbQuery {
        Sessions.selectAll()
            .where { Sessions.id eq id }
            .map { rowToSession(it) }
            .singleOrNull()
    }

    suspend fun findByUser(userId: Int): List<Session> = dbQuery {
        Sessions.selectAll()
            .where { Sessions.userId eq userId }
            .map { rowToSession(it) }
    }

    suspend fun findAll(): List<Session> = dbQuery {
        Sessions.selectAll()
            .map { rowToSession(it) }
    }

    suspend fun findExpiredSessions(cutoffTime: Int): List<Session> = dbQuery {
        Sessions.selectAll()
            .where { Sessions.lastActivity less cutoffTime }
            .map { rowToSession(it) }
    }

    suspend fun update(id: String, session: Session): Session? {
        val updated = dbQuery {
            Sessions.update({ Sessions.id eq id }) {
                it[userId] = session.userId
                it[ipAddress] = session.ipAddress
                it[userAgent] = session.userAgent
                it[payload] = session.payload
                it[lastActivity] = session.lastActivity
            }
        }
        return if (updated > 0) {
            findById(id)
        } else {
            null
        }
    }

    suspend fun updateLastActivity(id: String, lastActivity: Int): Boolean = dbQuery {
        Sessions.update({ Sessions.id eq id }) {
            it[Sessions.lastActivity] = lastActivity
        } > 0
    }

    suspend fun delete(id: String): Boolean = dbQuery {
        Sessions.deleteWhere { Sessions.id eq id } > 0
    }

    suspend fun deleteByUser(userId: Int): Boolean = dbQuery {
        Sessions.deleteWhere { Sessions.userId eq userId } > 0
    }

    suspend fun deleteExpired(cutoffTime: Int): Boolean = dbQuery {
        Sessions.deleteWhere { Sessions.lastActivity less cutoffTime } > 0
    }

    private fun rowToSession(row: ResultRow): Session {
        return Session(
            id = row[Sessions.id],
            userId = row[Sessions.userId],
            ipAddress = row[Sessions.ipAddress],
            userAgent = row[Sessions.userAgent],
            payload = row[Sessions.payload],
            lastActivity = row[Sessions.lastActivity]
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
