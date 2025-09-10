# Plan for Template Recipient Management

This plan outlines the backend development required to implement the management of template recipient groups, the students within them, and their associated template variable data.

The existing backend has a complete data access layer (Exposed tables, models, and repositories). The primary tasks are to create the service layer to contain business logic and the GraphQL layer to expose the functionality to the frontend, following the established code-first pattern.

## 1. Service Layer Implementation

Create new services to orchestrate repository calls and implement business logic. These services will be placed in the `/src/main/kotlin/services/` directory.

### 1.1. `TemplateRecipientGroupService.kt`
- **Purpose**: Manage CRUD operations for `TemplateRecipientGroup`.
- **Dependencies**: `TemplateRecipientGroupRepository`.
- **Methods**:
    - `create(templateId: Int, name: String, description: String?): TemplateRecipientGroup`
    - `findById(id: Int): TemplateRecipientGroup?`
    - `findAllByTemplateId(templateId: Int): List<TemplateRecipientGroup>`
    - `update(id: Int, name: String, description: String?): TemplateRecipientGroup`
    - `delete(id: Int): Boolean`

### 1.2. `TemplateRecipientGroupItemService.kt`
- **Purpose**: Manage students within a recipient group.
- **Dependencies**: `TemplateRecipientGroupItemRepository`, `StudentRepository`.
- **Methods**:
    - `addStudent(groupId: Int, studentId: Int): TemplateRecipientGroupItem`
    - `addStudents(groupId: Int, studentIds: List<Int>): List<TemplateRecipientGroupItem>`
    - `removeStudent(groupId: Int, studentId: Int): Boolean`
    - `findStudentsInGroup(groupId: Int, pagination: PaginationArgs?, filter: StudentFilterArgs?): PaginatedStudentResponse` (Leverages `StudentRepository.students`)
    - `findStudentsNotInGroup(templateId: Int, groupId: Int, pagination: PaginationArgs?, filter: StudentFilterArgs?): PaginatedStudentResponse`

### 1.3. `RecipientGroupItemVariableValueService.kt`
- **Purpose**: Manage the template variable data for each student in a group.
- **Dependencies**: `RecipientGroupItemVariableValueRepository`, `TemplateRecipientGroupItemRepository`.
- **Methods**:
    - `findAllByGroupItem(groupId: Int, studentId: Int): List<RecipientGroupItemVariableValue>`
    - `findAllByGroup(groupId: Int): Map<Int, List<RecipientGroupItemVariableValue>>` (Map of studentId to their variable values)
    - `batchUpdate(input: List<UpdateGroupItemVariableValueInput>): List<RecipientGroupItemVariableValue>`

## 2. GraphQL API Layer (Code-First)

Expose the service layer functionality using `graphql-kotlin`. This involves creating new Query and Mutation classes that inject the services using Koin.

### 2.1. GraphQL Query (`TemplateRecipientGroupQuery.kt`)
- **Location**: `/src/main/kotlin/schema/query/TemplateRecipientGroupQuery.kt`
- **Class**: `class TemplateRecipientGroupQuery : Query, KoinComponent`
- **Dependencies**: `TemplateRecipientGroupService`, `TemplateRecipientGroupItemService`, `RecipientGroupItemVariableValueService`.
- **Functions**:
    - `recipientGroup(id: Int!): TemplateRecipientGroup?`
    - `recipientGroups(templateId: Int!): [TemplateRecipientGroup!]!`
    - `studentsInGroup(groupId: Int!, pagination: PaginationArgs, filter: StudentFilterArgs): PaginatedStudentResponse!`
    - `studentsNotInGroup(templateId: Int!, groupId: Int!, pagination: PaginationArgs, filter: StudentFilterArgs): PaginatedStudentResponse!`
    - `recipientGroupItemVariableValues(groupId: Int!, studentId: Int!): [RecipientGroupItemVariableValue!]!`

### 2.2. GraphQL Mutation (`TemplateRecipientGroupMutation.kt`)
- **Location**: `/src/main/kotlin/schema/mutation/TemplateRecipientGroupMutation.kt`
- **Class**: `class TemplateRecipientGroupMutation : Mutation, KoinComponent`
- **Dependencies**: `TemplateRecipientGroupService`, `TemplateRecipientGroupItemService`, `RecipientGroupItemVariableValueService`.
- **Functions**:
    - `createRecipientGroup(input: CreateRecipientGroupInput!): TemplateRecipientGroup!`
    - `updateRecipientGroup(input: UpdateRecipientGroupInput!): TemplateRecipientGroup!`
    - `deleteRecipientGroup(id: Int!): Boolean!`
    - `addStudentToGroup(input: AddStudentToGroupInput!): TemplateRecipientGroupItem!`
    - `addStudentsToGroup(input: AddStudentsToGroupInput!): [TemplateRecipientGroupItem!]!`
    - `removeStudentFromGroup(input: RemoveStudentFromGroupInput!): Boolean!`
    - `updateRecipientGroupItemVariableValues(input: [UpdateGroupItemVariableValueInput!]!): [RecipientGroupItemVariableValue!]!`

### 2.3. GraphQL Input Types
- **Location**: `/src/main/kotlin/schema/model/`
- **Models**:
    - `CreateRecipientGroupInput(templateId: Int, name: String, description: String?)`
    - `UpdateRecipientGroupInput(id: Int, name: String, description: String?)`
    - `AddStudentToGroupInput(groupId: Int, studentId: Int)`
    - `AddStudentsToGroupInput(groupId: Int, studentIds: [Int])`
    - `RemoveStudentFromGroupInput(groupId: Int, studentId: Int)`
    - `UpdateGroupItemVariableValueInput(...)`

## 3. Dependency Injection and Setup

- **Service Instantiation**: Create the new services and register them with the Koin dependency injection framework, providing the necessary repositories from the `RepositoryManager`.
- **GraphQL Schema Integration**: The `graphql-kotlin` library will automatically discover the new `TemplateRecipientGroupQuery` and `TemplateRecipientGroupMutation` classes. Ensure they are in the scanned packages.

This plan provides a clear path to implementing the required backend functionality. The next step is to start creating the service files.
