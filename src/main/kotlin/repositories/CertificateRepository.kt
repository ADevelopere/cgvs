package repositories

import schema.model.Certificate
import tables.Certificates
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
import org.jetbrains.exposed.v1.core.and
import org.jetbrains.exposed.v1.jdbc.transactions.transaction

class CertificateRepository(private val database: Database) {

    suspend fun create(certificate: Certificate): Certificate = dbQuery {
        val now = Clock.System.now().toLocalDateTime(TimeZone.UTC)
        val insertStatement = Certificates.insert {
            it[templateId] = certificate.templateId
            it[studentId] = certificate.studentId
            it[templateRecipientGroupId] = certificate.templateRecipientGroupId
            it[releaseDate] = certificate.releaseDate
            it[verificationCode] = certificate.verificationCode
            it[createdAt] = now
            it[updatedAt] = now
        }

        val id = insertStatement[Certificates.id]
        certificate.copy(
            id = id,
            createdAt = now,
            updatedAt = now
        )
    }

    suspend fun findById(id: Int): Certificate? = dbQuery {
        Certificates.selectAll()
            .where { Certificates.id eq id }
            .map { rowToCertificate(it) }
            .singleOrNull()
    }

    suspend fun findByVerificationCode(code: String): Certificate? = dbQuery {
        Certificates.selectAll()
            .where { Certificates.verificationCode eq code }
            .map { rowToCertificate(it) }
            .singleOrNull()
    }

    suspend fun findByStudent(studentId: Int): List<Certificate> = dbQuery {
        Certificates.selectAll()
            .where { Certificates.studentId eq studentId }
            .map { rowToCertificate(it) }
    }

    suspend fun findByTemplate(templateId: Int): List<Certificate> = dbQuery {
        Certificates.selectAll()
            .where { Certificates.templateId eq templateId }
            .map { rowToCertificate(it) }
    }

    suspend fun findByStudentAndTemplate(studentId: Int, templateId: Int): Certificate? = dbQuery {
        Certificates.selectAll()
            .where { (Certificates.studentId eq studentId) and (Certificates.templateId eq templateId) }
            .map { rowToCertificate(it) }
            .singleOrNull()
    }

    suspend fun findAll(): List<Certificate> = dbQuery {
        Certificates.selectAll()
            .map { rowToCertificate(it) }
    }

    suspend fun findActive(): List<Certificate> = dbQuery {
        Certificates.selectAll()
            .where { Certificates.deletedAt.isNull() }
            .map { rowToCertificate(it) }
    }

    suspend fun update(id: Int, certificate: Certificate): Certificate? {
        val updated = dbQuery {
            Certificates.update({ Certificates.id eq id }) {
                it[templateId] = certificate.templateId
                it[studentId] = certificate.studentId
                it[templateRecipientGroupId] = certificate.templateRecipientGroupId
                it[releaseDate] = certificate.releaseDate
                it[verificationCode] = certificate.verificationCode
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
            Certificates.update({ Certificates.id eq id }) {
                it[deletedAt] = now
                it[updatedAt] = now
            }
        }
        return updated > 0
    }

    suspend fun restore(id: Int): Boolean {
        val updated = dbQuery {
            Certificates.update({ Certificates.id eq id }) {
                it[deletedAt] = null
                it[updatedAt] = Clock.System.now().toLocalDateTime(TimeZone.UTC)
            }
        }
        return updated > 0
    }

    suspend fun delete(id: Int): Boolean = dbQuery {
        Certificates.deleteWhere { Certificates.id eq id } > 0
    }

    private fun rowToCertificate(row: ResultRow): Certificate {
        return Certificate(
            id = row[Certificates.id],
            templateId = row[Certificates.templateId],
            studentId = row[Certificates.studentId],
            templateRecipientGroupId = row[Certificates.templateRecipientGroupId],
            releaseDate = row[Certificates.releaseDate],
            verificationCode = row[Certificates.verificationCode],
            createdAt = row[Certificates.createdAt],
            updatedAt = row[Certificates.updatedAt]
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
