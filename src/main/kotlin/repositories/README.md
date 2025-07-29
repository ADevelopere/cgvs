# Repository Documentation

This document outlines all the repositories created for the Ktor application, migrated from Laravel + Lighthouse.

## Overview

The repository pattern is implemented using Exposed ORM with Kotlin coroutines for asynchronous database operations. Each repository provides CRUD operations and domain-specific queries.

## Repository Structure

All repositories follow a consistent pattern:
- **create()**: Insert new records
- **findById()**: Find by primary key
- **findAll()**: Get all records
- **update()**: Update existing records
- **delete()**: Hard delete records
- **softDelete()**: Soft delete (where applicable)
- **restore()**: Restore soft-deleted records (where applicable)
- **Custom finders**: Domain-specific query methods

## Core Repositories

### 1. UserRepository
- **Purpose**: User authentication and management
- **Key Methods**:
  - `findByEmail(email: String)`: Find user by email
  - `create(user: User)`: Create new user
  - `update(id: Int, user: User)`: Update user information

### 2. SessionRepository
- **Purpose**: Session management
- **Key Methods**:
  - `findByUser(userId: Int)`: Get user sessions
  - `updateLastActivity(id: String, lastActivity: Int)`: Update session activity
  - `deleteExpired(cutoffTime: Int)`: Clean up expired sessions

### 3. PasswordResetTokenRepository
- **Purpose**: Password reset token management
- **Key Methods**:
  - `findByToken(token: String)`: Find by reset token
  - `create(token: PasswordResetToken)`: Create reset token
  - `delete(email: String)`: Remove token after use

## Student Management

### 4. StudentRepository
- **Purpose**: Student information management
- **Key Methods**:
  - `findByEmail(email: String)`: Find student by email
  - `findByGender(gender: Gender)`: Filter by gender
  - `findByNationality(nationality: Nationality)`: Filter by nationality
  - `findActive()`: Get non-deleted students
  - `softDelete(id: Int)`: Soft delete student
  - `restore(id: Int)`: Restore deleted student

### 5. CertificateRepository
- **Purpose**: Certificate generation and management
- **Key Methods**:
  - `findByVerificationCode(code: String)`: Verify certificates
  - `findByStudent(studentId: Int)`: Get student certificates
  - `findByTemplate(templateId: Int)`: Get template certificates
  - `findByStudentAndTemplate(studentId: Int, templateId: Int)`: Unique certificate lookup

## Template Management

### 6. TemplateRepository
- **Purpose**: Certificate template management
- **Key Methods**:
  - `findByCategory(categoryId: Int)`: Get templates by category
  - `findActive()`: Get non-deleted/non-trashed templates
  - `softDelete(id: Int)`: Soft delete template
  - `trash(id: Int)`: Move to trash
  - `restore(id: Int)`: Restore template

### 7. TemplateCategoryRepository
- **Purpose**: Template categorization
- **Key Methods**:
  - `findByParent(parentId: Int)`: Get child categories
  - `findRootCategories()`: Get top-level categories
  - `findBySpecialType(specialType: SpecialType)`: Filter by special type
  - `findActive()`: Get non-deleted categories

### 8. TemplateVariableRepository
- **Purpose**: Template variable definition
- **Key Methods**:
  - `findByTemplate(templateId: Int)`: Get template variables
  - `findByTemplateAndName(templateId: Int, name: String)`: Unique variable lookup
  - `findRequired(templateId: Int)`: Get required variables
  - `findByType(type: String)`: Filter by variable type

### 9. TemplateElementRepository
- **Purpose**: Template visual elements
- **Key Methods**:
  - `findByTemplate(templateId: Int)`: Get template elements
  - `findByType(type: ElementType)`: Filter by element type
  - `findByTemplateAndType(templateId: Int, type: ElementType)`: Specific element lookup

## Recipient Management

### 10. TemplateRecipientGroupRepository
- **Purpose**: Recipient group management
- **Key Methods**:
  - `findByTemplate(templateId: Int)`: Get template groups
  - `findByTemplateAndName(templateId: Int, name: String)`: Unique group lookup

### 11. TemplateRecipientGroupItemRepository
- **Purpose**: Individual recipients in groups
- **Key Methods**:
  - `findByGroup(groupId: Int)`: Get group members
  - `findByStudent(studentId: Int)`: Get student's groups
  - `findByGroupAndStudent(groupId: Int, studentId: Int)`: Check membership

### 12. RecipientGroupItemVariableValueRepository
- **Purpose**: Variable values for recipients
- **Key Methods**:
  - `findByGroupItem(itemId: Int)`: Get recipient's values
  - `findByVariable(variableId: Int)`: Get variable usage
  - `findByGroupItemAndVariable(itemId: Int, variableId: Int)`: Specific value lookup

## Repository Manager

### RepositoryManager
- **Purpose**: Centralized repository access
- **Usage**: Singleton pattern for consistent database access
- **Features**:
  - Lazy initialization of repositories
  - Thread-safe singleton implementation
  - Single database connection management

## Usage Example

```kotlin
// Initialize with database
val repositoryManager = RepositoryManager.getInstance(database)

// Use repositories
val users = repositoryManager.userRepository.findAll()
val templates = repositoryManager.templateRepository.findActive()
val students = repositoryManager.studentRepository.findByNationality(Nationality.SA)

// Create new entities
val newUser = repositoryManager.userRepository.create(user)
val newTemplate = repositoryManager.templateRepository.create(template)
```

## Database Transaction Handling

All repositories use the `dbQuery` helper function that:
- Executes queries on a dedicated IO thread pool
- Handles database transactions automatically
- Provides proper error handling and resource management
- Supports coroutines for non-blocking operations

## Key Features

1. **Consistent API**: All repositories follow the same pattern
2. **Async Operations**: Full coroutine support for non-blocking database access
3. **Type Safety**: Leverages Kotlin's type system and Exposed ORM
4. **Soft Deletes**: Implemented where business logic requires it
5. **Complex Queries**: Domain-specific finder methods for complex business logic
6. **JSON Handling**: Proper serialization/deserialization for complex fields
7. **Relationship Management**: Proper foreign key handling and cascading operations

This repository layer provides a solid foundation for the Ktor application, maintaining the same business logic as the original Laravel application while leveraging Kotlin's strengths.
