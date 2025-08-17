package services

import schema.type.CreateStudentInput
import schema.type.Student
import repositories.StudentRepository
import schema.pagination.PaginationResult
import schema.pagination.PaginationUtils
import util.now

class StudentService(
    private val repository: StudentRepository
) {
    suspend fun findById(id: Int): Student? {
        return repository.findById(id)
    }

    suspend fun findAll(): List<Student> {
        return repository.findAll()
    }

    suspend fun findPaginatedWithInfo(
        first: Int? = null,
        skip: Int? = null,
        page: Int? = null,
        defaultCount: Int = 15,
        maxCount: Int = 100
    ): PaginationResult<Student> {
        return PaginationUtils.findPaginatedWithInfo(
            repository = repository,
            first = first,
            skip = skip,
            page = page,
            defaultCount = defaultCount,
            maxCount = maxCount
        )
    }

    suspend fun create(input: CreateStudentInput): Student {
        // Validate name length
        check(input.name.length in 3..255) {
            "Student name must be between 3 and 255 characters long."
        }

        return Student(
            id = 1,
            name = input.name,
            email = input.email,
            phoneNumber = input.phoneNumber,
            gender = input.gender,
            nationality = input.nationality,
            dateOfBirth = input.dateOfBirth,
            createdAt = now(),
            updatedAt = now()
        )

    }
}
