package schema.mutation

import com.expediagroup.graphql.server.operations.Mutation
import schema.model.CreateStudentInput
import schema.model.Student
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import schema.model.PartialUpdateStudentInput
import services.StudentService
import kotlin.getValue

class StudentMutation : Mutation, KoinComponent {
    private val service: StudentService by inject()

    suspend fun createStudent(input: CreateStudentInput): Student {
        return service.create(input)
    }

    suspend fun partialUpdateStudent(input: PartialUpdateStudentInput): Student {
        return service.partialUpdate(input)
    }

    suspend fun deleteStudent(id: Int): Student {
        return service.delete(id)
    }
}
