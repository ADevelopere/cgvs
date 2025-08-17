package services

import schema.type.CreateStudentInput
import schema.type.Student
import repositories.StudentRepository
import schema.pagination.PaginationResult
import schema.type.OrderStudentsByClause
import schema.type.PaginationArgs
import schema.type.StudentSortArgs
import schema.type.UpdateStudentInput

class StudentService(
    private val repository: StudentRepository
) {
    suspend fun findById(id: Int): Student? {
        return repository.findById(id)
    }

//    suspend fun students(
//        paginationArgs: PaginationArgs? = null,
//        orderBy: List<OrderStudentsByClause>? = null,
//        sortArgs: StudentSortArgs? = null
//    ): PaginationResult<Student> {
//
//    }

    suspend fun create(input: CreateStudentInput): Student {
        // Validate name length
        check(input.name.length in 3..255) {
            "Student name must be between 3 and 255 characters long."
        }

        return repository.create(
            input.toStudent()
        )
    }

    suspend fun update(input: UpdateStudentInput): Student {
        val existingStudent = repository.findById(input.id)
            ?: throw IllegalArgumentException("Student with ID ${input.id} does not exist.")

        // Validate name length
        check(input.name.length in 3..255) {
            "Student name must be between 3 and 255 characters long."
        }

        return repository.update(
            id = input.id,
            existingStudent.copy(
                name = input.name,
                email = input.email,
                phoneNumber = input.phoneNumber,
                dateOfBirth = input.dateOfBirth,
                gender = input.gender,
                nationality = input.nationality
            )
        ) ?: throw IllegalArgumentException("Failed to update student with ID ${input.id}.")
    }

    suspend fun delete(id: Int): Student {
        val existingStudent = repository.findById(id)
            ?: throw IllegalArgumentException("Student with ID $id does not exist.")

        val deleted = repository.delete(id)
        check(deleted) {
            "Failed to delete student with ID $id."
        }

        return existingStudent
    }
}
