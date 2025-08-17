package schema.query

import com.expediagroup.graphql.server.operations.Query
import schema.type.PaginatedStudentResponse
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import schema.directive.PaginateDirective
import schema.type.Student
import services.StudentService
import kotlin.getValue

class StudentQuery : Query, KoinComponent {
    private val service: StudentService by inject()

    suspend fun student(id: Int): Student? {
        return service.findById(id)
    }

    suspend fun students(): List<Student> {
        return service.findAll()
    }

    @PaginateDirective(defaultCount = 15, maxCount = 100)
    suspend fun paginatedStudents(
        first: Int? = null,
        skip: Int? = null,
        page: Int? = null
    ): PaginatedStudentResponse {
        // Fetch only the paginated items from database for better performance
        val paginatedResult = service.findPaginatedWithInfo(first, skip, page)

        return PaginatedStudentResponse(
            data = paginatedResult.data,
            paginationInfo = paginatedResult.paginationInfo
        )
    }
}
