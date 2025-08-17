package schema.query

import com.expediagroup.graphql.server.operations.Query
import schema.type.PaginatedStudentResponse
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import schema.type.OrderStudentsByClause
import schema.type.PaginationArgs
import schema.type.Student
import schema.type.StudentSortArgs
import services.StudentService
import kotlin.getValue

class StudentQuery : Query, KoinComponent {
    private val service: StudentService by inject()

    suspend fun student(id: Int): Student? {
        return service.findById(id)
    }

//    suspend fun students(
//        paginationArgs: PaginationArgs? = null,
//        orderBy: List<OrderStudentsByClause>? = null,
//        sortArgs: StudentSortArgs? = null
//    ): PaginatedStudentResponse {
//        // Fetch only the paginated items from database for better performance
//        val result = service.students(paginationArgs, orderBy, sortArgs)
//
//        return PaginatedStudentResponse(
//            data = result.data,
//            paginationInfo = result.paginationInfo
//        )
//    }
}
