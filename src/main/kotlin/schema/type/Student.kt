package models

import kotlinx.serialization.Serializable
import tables.Gender
import tables.Nationality
import kotlinx.datetime.LocalDate
import kotlinx.datetime.LocalDateTime
import schema.directive.PaginationInfo

@Serializable
data class Student(
    val id: Int = 0,
    val name: String,
    val email: String? = null,
    val phoneNumber: String? = null,
    val dateOfBirth: LocalDate? = null,
    val gender: Gender? = null,
    val nationality: Nationality? = null,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

data class CreateStudentInput(
    val name: String,
    val email: String? = null,
    val phoneNumber: String? = null,
    val dateOfBirth: String? = null, // ISO date string
    val gender: String? = null,
    val nationality: String? = null
)

data class UpdateStudentInput(
    val name: String? = null,
    val email: String? = null,
    val phoneNumber: String? = null,
    val dateOfBirth: String? = null, // ISO date string
    val gender: String? = null,
    val nationality: String? = null
)

data class PaginatedStudentResponse(
    val data: List<Student>,
    val paginationInfo: PaginationInfo? = null
)
