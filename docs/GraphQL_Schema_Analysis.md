# GraphQL Schema Migration Analysis

## Overview
This document provides a comprehensive analysis of the current Laravel GraphQL schema for migration to Ktor/Kotlin. The analysis covers all types, queries, mutations, and their corresponding Laravel models.

## Schema Structure

### Scalars
- `DateTime`: Custom scalar for date-time values (`Y-m-d H:i:s` format)
- `Date`: Custom scalar for date values  
- `Upload`: Custom scalar for file uploads

### Core Types

#### 1. User Type
```graphql
type User {
    id: ID!
    name: String!
    email: String!
    email_verified_at: DateTime
    isAdmin: Boolean!
    created_at: DateTime!
    updated_at: DateTime!
}
```

**Kotlin Data Class Mapping:**
```kotlin
data class User(
    val id: String,
    val name: String,
    val email: String,
    val emailVerifiedAt: LocalDateTime? = null,
    val isAdmin: Boolean,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
```

#### 2. Student Type
```graphql
type Student {
    id: ID!
    name: String!
    email: String
    phone_number: String
    date_of_birth: Date
    gender: StudentGender
    nationality: CountryCode
    recipientGroups: [TemplateRecipientGroup!]
    certificates: [Certificate!]
    created_at: DateTime!
    updated_at: DateTime!
}
```

**Kotlin Data Class Mapping:**
```kotlin
data class Student(
    val id: String,
    val name: String,
    val email: String? = null,
    val phoneNumber: String? = null,
    val dateOfBirth: LocalDate? = null,
    val gender: StudentGender? = null,
    val nationality: CountryCode? = null,
    val recipientGroups: List<TemplateRecipientGroup> = emptyList(),
    val certificates: List<Certificate> = emptyList(),
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

enum class StudentGender {
    MALE, FEMALE, OTHER
}

enum class CountryCode {
    SA, PS, YE, SY, EG, KW, QA, OM, BH, LB, JO, IQ, LY, AE, TN, DZ, MA, SD, ID, MR, SO, KM, DJ, ER, SS, EH
}
```

#### 3. Template Type
```graphql
type Template {
    id: ID!
    name: String!
    description: String
    image_url: String
    category: TemplateCategory!
    pre_deletion_category: TemplateCategory
    order: Int
    elements: [TemplateElement!]!
    variables: [TemplateVariable!]!
    recipientGroups: [TemplateRecipientGroup!]!
    certificates: [Certificate!]!
    created_at: DateTime!
    updated_at: DateTime!
    trashed_at: DateTime
}
```

**Kotlin Data Class Mapping:**
```kotlin
data class Template(
    val id: String,
    val name: String,
    val description: String? = null,
    val imageUrl: String? = null,
    val category: TemplateCategory,
    val preDeletionCategory: TemplateCategory? = null,
    val order: Int? = null,
    val elements: List<TemplateElement> = emptyList(),
    val variables: List<TemplateVariable> = emptyList(),
    val recipientGroups: List<TemplateRecipientGroup> = emptyList(),
    val certificates: List<Certificate> = emptyList(),
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
    val trashedAt: LocalDateTime? = null
)
```

#### 4. TemplateCategory Type
```graphql
type TemplateCategory {
    id: ID!
    name: String!
    description: String
    parentCategory: TemplateCategory
    childCategories: [TemplateCategory!]!
    order: Int
    special_type: TemplateCategoryType
    templates: [Template!]
    created_at: DateTime!
    updated_at: DateTime!
}
```

**Kotlin Data Class Mapping:**
```kotlin
data class TemplateCategory(
    val id: String,
    val name: String,
    val description: String? = null,
    val parentCategory: TemplateCategory? = null,
    val childCategories: List<TemplateCategory> = emptyList(),
    val order: Int? = null,
    val specialType: TemplateCategoryType? = null,
    val templates: List<Template> = emptyList(),
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

enum class TemplateCategoryType {
    DELETION, MAIN
}
```

#### 5. TemplateElement Type (Complex Polymorphic Type)
```graphql
type TemplateElement {
    id: ID!
    template: Template!
    type: String!
    x_coordinate: Float!
    y_coordinate: Float!
    font_size: Int
    color: String
    alignment: String
    font_family: String
    language_constraint: String
    staticText: StaticTextElement
    dataText: DataTextElement
    dataDate: DataDateElement
    image: ImageElement
    qrCode: QrCodeElement
    created_at: DateTime!
    updated_at: DateTime!
}
```

**Kotlin Data Class Mapping (Using Sealed Classes):**
```kotlin
sealed class TemplateElement {
    abstract val id: String
    abstract val template: Template
    abstract val xCoordinate: Float
    abstract val yCoordinate: Float
    abstract val fontSize: Int?
    abstract val color: String?
    abstract val alignment: String?
    abstract val fontFamily: String?
    abstract val languageConstraint: String?
    abstract val createdAt: LocalDateTime
    abstract val updatedAt: LocalDateTime

    data class StaticText(
        override val id: String,
        override val template: Template,
        override val xCoordinate: Float,
        override val yCoordinate: Float,
        override val fontSize: Int? = null,
        override val color: String? = null,
        override val alignment: String? = null,
        override val fontFamily: String? = null,
        override val languageConstraint: String? = null,
        override val createdAt: LocalDateTime,
        override val updatedAt: LocalDateTime,
        val content: String
    ) : TemplateElement()

    data class DataText(
        override val id: String,
        override val template: Template,
        override val xCoordinate: Float,
        override val yCoordinate: Float,
        override val fontSize: Int? = null,
        override val color: String? = null,
        override val alignment: String? = null,
        override val fontFamily: String? = null,
        override val languageConstraint: String? = null,
        override val createdAt: LocalDateTime,
        override val updatedAt: LocalDateTime,
        val sourceType: DataSourceType,
        val sourceField: String
    ) : TemplateElement()

    // ... other element types
}

enum class DataSourceType {
    STUDENT, TEMPLATE, CERTIFICATE, CUSTOM
}
```

### Authentication Types

#### AuthPayload
```graphql
type AuthPayload {
    token: String!
    user: User!
}
```

**Kotlin Data Class:**
```kotlin
data class AuthPayload(
    val token: String,
    val user: User
)
```

#### LogoutResponse
```graphql
type LogoutResponse {
    message: String!
}
```

**Kotlin Data Class:**
```kotlin
data class LogoutResponse(
    val message: String
)
```

## Queries Analysis

### 1. Authentication Queries
```graphql
extend type Query {
    me: User!
    user(id: ID, email: String): User
    users(name: String): [User!]!
}
```

**Kotlin Resolver Interface:**
```kotlin
interface AuthQueryResolver {
    suspend fun me(context: AuthContext): User
    suspend fun user(id: String? = null, email: String? = null): User?
    suspend fun users(name: String? = null, pagination: PaginationInput): PaginatedResult<User>
}
```

### 2. Template Queries
```graphql
extend type Query {
    templates: [Template!]!
    template(id: ID!): Template
    templateConfig: TemplateConfig!
}
```

**Kotlin Resolver Interface:**
```kotlin
interface TemplateQueryResolver {
    suspend fun templates(pagination: PaginationInput): PaginatedResult<Template>
    suspend fun template(id: String): Template?
    suspend fun templateConfig(): TemplateConfig
}
```

### 3. Student Queries
```graphql
extend type Query {
    students: [Student!]!
    student(id: ID!): Student
}
```

**Kotlin Resolver Interface:**
```kotlin
interface StudentQueryResolver {
    suspend fun students(pagination: PaginationInput): PaginatedResult<Student>
    suspend fun student(id: String): Student?
}
```

### 4. Template Category Queries
```graphql
extend type Query {
    templateCategories: [TemplateCategory!]!
    templateCategory(id: ID!): TemplateCategory
}
```

**Kotlin Resolver Interface:**
```kotlin
interface TemplateCategoryQueryResolver {
    suspend fun templateCategories(): List<TemplateCategory>
    suspend fun templateCategory(id: String): TemplateCategory?
}
```

## Mutations Analysis

### 1. Authentication Mutations
```graphql
extend type Mutation {
    login(email: String!, password: String!): AuthPayload!
    logout: LogoutResponse!
}
```

**Kotlin Resolver Interface:**
```kotlin
interface AuthMutationResolver {
    suspend fun login(email: String, password: String): AuthPayload
    suspend fun logout(context: AuthContext): LogoutResponse
}
```

### 2. Template Mutations
```graphql
extend type Mutation {
    createTemplate(input: CreateTemplateInput!): Template!
    updateTemplate(id: ID!, input: UpdateTemplateInput!): Template!
    updateTemplateWithImage(id: ID!, input: UpdateTemplateWithImageInput!): Template!
    deleteTemplate(id: ID!): Template!
    moveTemplateToDeletionCategory(templateId: ID!): Template!
    restoreTemplate(templateId: ID!): Template!
    reorderTemplates(input: [ReorderTemplateInput!]!): [Template!]!
}
```

**Kotlin Input Classes:**
```kotlin
data class CreateTemplateInput(
    val name: String,
    val description: String? = null,
    val categoryId: String
)

data class UpdateTemplateInput(
    val name: String? = null,
    val description: String? = null,
    val categoryId: String? = null
)

data class UpdateTemplateWithImageInput(
    val name: String? = null,
    val description: String? = null,
    val categoryId: String? = null,
    val imageFile: Upload? = null
)

data class ReorderTemplateInput(
    val id: String,
    val order: Int
)
```

**Kotlin Resolver Interface:**
```kotlin
interface TemplateMutationResolver {
    suspend fun createTemplate(input: CreateTemplateInput, context: AuthContext): Template
    suspend fun updateTemplate(id: String, input: UpdateTemplateInput, context: AuthContext): Template
    suspend fun updateTemplateWithImage(id: String, input: UpdateTemplateWithImageInput, context: AuthContext): Template
    suspend fun deleteTemplate(id: String, context: AuthContext): Template
    suspend fun moveTemplateToDeletionCategory(templateId: String, context: AuthContext): Template
    suspend fun restoreTemplate(templateId: String, context: AuthContext): Template
    suspend fun reorderTemplates(input: List<ReorderTemplateInput>, context: AuthContext): List<Template>
}
```

### 3. Student Mutations
```graphql
extend type Mutation {
    createStudent(input: CreateStudentInput!): Student!
    updateStudent(id: ID!, input: UpdateStudentInput!): Student!
    deleteStudent(id: ID!): Student!
}
```

**Kotlin Input Classes:**
```kotlin
data class CreateStudentInput(
    val name: String,
    val email: String? = null,
    val phoneNumber: String? = null,
    val dateOfBirth: LocalDate? = null,
    val gender: StudentGender? = null,
    val nationality: CountryCode? = null
)

data class UpdateStudentInput(
    val name: String? = null,
    val email: String? = null,
    val phoneNumber: String? = null,
    val dateOfBirth: LocalDate? = null,
    val gender: StudentGender? = null,
    val nationality: CountryCode? = null
)
```

### 4. Template Category Mutations
```graphql
extend type Mutation {
    createTemplateCategory(input: CreateTemplateCategoryInput!): TemplateCategory!
    updateTemplateCategory(id: ID!, input: UpdateTemplateCategoryInput!): TemplateCategory!
    deleteTemplateCategory(id: ID!): TemplateCategory!
}
```

## Key Migration Considerations

### 1. Authentication
- Laravel uses Sanctum for API authentication
- Ktor will need JWT-based authentication
- Guard directives need to be implemented as middleware

### 2. Pagination
- Laravel Lighthouse uses `@paginate` directive
- Ktor GraphQL will need custom pagination implementation
- Standard cursor-based or offset-based pagination

### 3. File Uploads
- Laravel handles uploads through `Upload` scalar
- Ktor will need multipart file handling
- Storage integration for file management

### 4. Database Relations
- Laravel uses Eloquent ORM with relations
- Ktor will use Exposed ORM or similar
- Lazy loading vs eager loading strategies

### 5. Validation
- Laravel uses `@rules` directive for validation
- Ktor will need custom validation implementation
- Input validation for all mutations

### 6. Authorization
- Laravel uses `@can` directive for authorization
- Ktor will need custom authorization middleware
- Role-based access control implementation

## Migration Priority

1. **Phase 1**: Core types and basic CRUD operations
   - User, Student, Template, TemplateCategory
   - Basic authentication
   - Simple queries and mutations

2. **Phase 2**: Complex relationships and features
   - TemplateElement polymorphic types
   - File upload handling
   - Advanced queries with filtering

3. **Phase 3**: Advanced features
   - Real-time subscriptions
   - Complex authorization rules
   - Performance optimizations

## Database Schema Requirements

Based on the GraphQL schema, the following database tables are required:

1. `users` - User management
2. `students` - Student information
3. `templates` - Template metadata
4. `template_categories` - Template categorization
5. `template_elements` - Template elements (polymorphic)
6. `template_variables` - Template variables
7. `template_recipient_groups` - Recipient grouping
8. `certificates` - Certificate records
9. Junction tables for many-to-many relationships

## Recommended Ktor Implementation Structure

```
src/main/kotlin/
├── graphql/
│   ├── schemas/
│   ├── resolvers/
│   ├── types/
│   └── scalars/
├── models/
├── services/
├── repositories/
├── auth/
├── validation/
└── utils/
```

This analysis provides a comprehensive foundation for migrating the Laravel GraphQL schema to Ktor/Kotlin while maintaining all existing functionality.
