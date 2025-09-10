package services

import repositories.TemplateRecipientGroupItemRepository
import repositories.TemplateRecipientGroupRepository
import schema.model.AddStudentToRecipientGroupInput
import schema.model.AddStudentsToRecipientGroupInput
import schema.model.OrderStudentsByClause
import schema.model.PaginatedStudentResponse
import schema.model.PaginationArgs
import schema.model.StudentFilterArgs
import schema.model.TemplateRecipientGroupItem

class TemplateRecipientGroupItemService(
    private val repository: TemplateRecipientGroupItemRepository,
    private val groupRepository: TemplateRecipientGroupRepository,
    private val studentService: StudentService
) {

    suspend fun addStudent(input: AddStudentToRecipientGroupInput): TemplateRecipientGroupItem {
        val (groupId, studentId) = input

        // Validate group exists
        check(groupRepository.existsById(groupId)) {
            "Group with ID $groupId does not exist."
        }

        // Validate student exists
        check(studentService.existsById(studentId)) {
            "Student with ID $studentId does not exist."
        }

        // Check if the student is already in the group
        check(repository.existsByGroupIdAndStudentId(groupId, studentId).not()) {
            "Student with ID $studentId is already in group with ID $groupId."
        }

        // Add student to group
        return repository.addStudent(input)
    }

    suspend fun addStudents(input: AddStudentsToRecipientGroupInput): List<TemplateRecipientGroupItem> {
        val (groupId, studentIds) = input

        // Validate group exists
        check(groupRepository.existsById(groupId)) {
            "Group with ID $groupId does not exist."
        }

        // Validate all students exist
        check(studentService.allExistsById(studentIds)) {
            "One or more students do not exist."
        }

        return repository.addNonExistentStudents(input)
    }

    suspend fun remove(id: Int): TemplateRecipientGroupItem? {
        val item = repository.findById(id) ?: throw IllegalArgumentException("Item with ID $id does not exist.")
        val isRemoved = repository.remove(id)
        return if (isRemoved) item else null
    }

    suspend fun removeSet(ids: Set<Int>): List<TemplateRecipientGroupItem> = repository.removeSet(ids)

    suspend fun findStudentsInGroup(
        groupId: Int,
        paginationArgs: PaginationArgs?,
        orderBy: List<OrderStudentsByClause>? = null,
        filterArgs: StudentFilterArgs?
    ): PaginatedStudentResponse = repository.searchStudentsInGroup(
        groupId,
        orderBy,
        paginationArgs,
        filterArgs
    )

    suspend fun findStudentsNotInGroup(
        groupId: Int,
        paginationArgs: PaginationArgs?,
        orderBy: List<OrderStudentsByClause>? = null,
        filterArgs: StudentFilterArgs?
    ): PaginatedStudentResponse = repository.searchStudentsNotInGroup(
        groupId,
        orderBy,
        paginationArgs,
        filterArgs
    )
}
