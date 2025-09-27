package schema.query

import com.expediagroup.graphql.server.operations.Query
import schema.model.PaginatedStudentResponse
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import schema.model.OrderStudentsByClause
import schema.model.PaginationArgs
import schema.model.Student
import schema.model.StudentFilterArgs
import services.StudentService
import kotlin.getValue

class StudentQuery : Query, KoinComponent {
    private val service: StudentService by inject()

    suspend fun student(id: Int): Student? {
        return service.findById(id)
    }

   suspend fun students(
       paginationArgs: PaginationArgs? = null,
       orderBy: List<OrderStudentsByClause>? = null,
       filterArgs: StudentFilterArgs? = null
   ): PaginatedStudentResponse {
       return service.students(paginationArgs, orderBy, filterArgs)
   }
}
