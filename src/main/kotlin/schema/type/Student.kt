package schema.type

import kotlinx.datetime.LocalDate
import kotlinx.datetime.LocalDateTime
import util.now

data class Student(
    val id: Int = 0,
    val name: String,
    val email: Email? = null,
    val phoneNumber: PhoneNumber? = null,
    val dateOfBirth: LocalDate? = null,
    val gender: Gender? = null,
    val nationality: Nationality? = null,
    val createdAt: LocalDateTime = now(),
    val updatedAt: LocalDateTime = now()
)

data class CreateStudentInput(
    val name: String,
    val email: Email? = null,
    val phoneNumber: PhoneNumber? = null,
    val dateOfBirth: LocalDate? = null, // ISO date string
    val gender: Gender? = null,
    val nationality: Nationality? = null
) {
    fun toStudent() = Student(
        name = name,
        email = email,
        phoneNumber = phoneNumber,
        dateOfBirth = dateOfBirth,
        gender = gender,
        nationality = nationality
    )

}

data class UpdateStudentInput(
    val id: Int,
    val name: String,
    val email: Email? = null,
    val phoneNumber: PhoneNumber? = null,
    val dateOfBirth: LocalDate? = null, // ISO date string
    val gender: Gender? = null,
    val nationality: Nationality? = null
) {
    fun toStudent() = Student(
        name = name,
        email = email,
        phoneNumber = phoneNumber,
        dateOfBirth = dateOfBirth,
        gender = gender,
        nationality = nationality
    )

}

data class PaginatedStudentResponse(
    val data: List<Student>,
    val paginationInfo: PaginationInfo? = null
)

/**
 * Arguments for sorting, filtering, and paginating students in the students query.
 */
data class StudentSortArgs(
    val name: String? = null,
    val nameNotContains: String? = null,
    val nameEquals: String? = null,
    val nameNotEquals: String? = null,
    val nameStartsWith: String? = null,
    val nameEndsWith: String? = null,
    val nameIsEmpty: Boolean? = null,
    val nameIsNotEmpty: Boolean? = null,

    val email: String? = null,
    val emailNotContains: String? = null,
    val emailEquals: Email? = null,
    val emailNotEquals: String? = null,
    val emailStartsWith: String? = null,
    val emailEndsWith: String? = null,
    val emailIsEmpty: Boolean? = null,
    val emailIsNotEmpty: Boolean? = null,

    val phoneNumber: PhoneNumber? = null,
    val gender: Gender? = null,
    val nationality: Nationality? = null,

    val createdAt: LocalDateTime? = null,
    val createdAtNot: LocalDateTime? = null,
    val createdAtFrom: LocalDateTime? = null,
    val createdAtTo: LocalDateTime? = null,
    val createdAtAfter: LocalDateTime? = null,
    val createdAtBefore: LocalDateTime? = null,
    val createdAtOnOrAfter: LocalDateTime? = null,
    val createdAtOnOrBefore: LocalDateTime? = null,
    val createdAtIsEmpty: Boolean? = null,
    val createdAtIsNotEmpty: Boolean? = null,

    val birthDate: LocalDateTime? = null,
    val birthDateNot: LocalDateTime? = null,
    val birthDateFrom: LocalDateTime? = null,
    val birthDateTo: LocalDateTime? = null,
    val birthDateAfter: LocalDateTime? = null,
    val birthDateBefore: LocalDateTime? = null,
    val birthDateOnOrAfter: LocalDateTime? = null,
    val birthDateOnOrBefore: LocalDateTime? = null,
    val birthDateIsEmpty: Boolean? = null,
    val birthDateIsNotEmpty: Boolean? = null,
)

/**
 * Represents a clause for ordering student results.
 */
data class OrderStudentsByClause(
    val column: OrderStudentsByColumn,
    val order: SortOrder
)

enum class OrderStudentsByColumn {
    ID,
    NAME,
    EMAIL,
    DATE_OF_BIRTH,
    GENDER,
    CREATED_AT,
    UPDATED_AT
}


