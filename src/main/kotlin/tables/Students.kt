package tables

import org.jetbrains.exposed.v1.core.Table
import org.jetbrains.exposed.v1.datetime.date
import org.jetbrains.exposed.v1.datetime.datetime
import schema.type.Gender
import schema.type.CountryCode

object Students : Table() {
    val id = integer("id").autoIncrement()
    val name = varchar("name", 255)
    val email = varchar("email", 255).nullable()
    val phoneNumber = varchar("phone_number", 255).nullable()
    val dateOfBirth = date("date_of_birth").nullable()
    val gender = enumerationByName("gender", 10, Gender::class).nullable()
    val nationality = enumerationByName("nationality", 2, CountryCode::class).nullable()
    val deletedAt = datetime("deleted_at").nullable()
    val createdAt = datetime("created_at")
    val updatedAt = datetime("updated_at")

    override val primaryKey = PrimaryKey(id)
}
