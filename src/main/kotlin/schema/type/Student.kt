package schema.type

import kotlinx.datetime.LocalDate
import kotlinx.datetime.LocalDateTime
import schema.directive.PaginationInfo
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

