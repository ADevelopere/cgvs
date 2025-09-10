package services

import schema.model.CreateStudentInput
import schema.model.Student
import repositories.StudentRepository
import schema.model.OrderStudentsByClause
import schema.model.PaginatedStudentResponse
import schema.model.PaginationArgs
import schema.model.StudentFilterArgs
import schema.model.PartialUpdateStudentInput

class StudentService(
    private val repository: StudentRepository
) {
    suspend fun findById(id: Int): Student? {
        return repository.findById(id)
    }

    suspend fun existsById(id: Int): Boolean {
        return repository.existsById(id)
    }

    suspend fun allExistsById(ids: Set<Int>): Boolean {
        return repository.allExistsByIds(ids)
    }

    suspend fun students(
        paginationArgs: PaginationArgs? = null,
        orderBy: List<OrderStudentsByClause>? = null,
        filterArgs: StudentFilterArgs? = null
    ): PaginatedStudentResponse {
        return repository.students(paginationArgs, orderBy, filterArgs)
    }

    suspend fun create(input: CreateStudentInput): Student {
        // Validate name length
        check(input.name.length in 3..255) {
            "Student name must be between 3 and 255 characters long."
        }

        return repository.create(
            input.toStudent()
        )
    }

    /**
     * Updates the student with the given ID.
     * updates only the fields that are provided in the input.
     * If a field is not provided, it will retain its existing value.
     */
    suspend fun partialUpdate(input: PartialUpdateStudentInput): Student {
        val existingStudent = repository.findById(input.id)
            ?: throw IllegalArgumentException("Student with ID ${input.id} does not exist.")

        // Validate name length
        check(input.name == null || input.name.length in 3..255) {
            "Student name must be between 3 and 255 characters long."
        }

        return repository.update(
            id = input.id,
            existingStudent.copy(
                name = input.name ?: existingStudent.name,
                email = input.email ?: existingStudent.email,
                phoneNumber = input.phoneNumber ?: existingStudent.phoneNumber,
                dateOfBirth = input.dateOfBirth ?: existingStudent.dateOfBirth,
                gender = input.gender ?: existingStudent.gender,
                nationality = input.nationality ?: existingStudent.nationality
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
