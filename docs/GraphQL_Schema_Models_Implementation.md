# GraphQL Schema Models Implementation

## Overview
This document describes the GraphQL schema models that have been implemented in the `src/main/kotlin/schema/models/` directory. These models are designed to work with the GraphQL Kotlin library and follow the same patterns as the existing Expedia examples.

## Implemented Models

### Core Domain Models

#### 1. GraphQLUser (`GraphQLUser.kt`)
- **Purpose**: Represents users in the GraphQL schema
- **Key Features**:
  - Basic user information (id, name, email, isAdmin)
  - Timestamp tracking (createdAt, updatedAt)
  - Email verification support
  - Mock data for testing

#### 2. Student (`GraphQLStudent.kt`)
- **Purpose**: Represents students in the system
- **Key Features**:
  - Personal information (name, email, phone, dateOfBirth)
  - Demographics (gender, nationality using existing enums)
  - Relationships to recipient groups and certificates via DataLoaders
  - Mock data with realistic sample students

#### 3. Template (`GraphQLTemplate.kt`)
- **Purpose**: Represents certificate templates
- **Key Features**:
  - Template metadata (name, description, imageUrl)
  - Category relationships (category, preDeletionCategory)
  - Complex relationships to elements, variables, recipient groups, and certificates
  - Soft deletion support (trashedAt)
  - Ordering support

#### 4. TemplateCategory (`TemplateCategory.kt`)
- **Purpose**: Hierarchical categorization of templates
- **Key Features**:
  - Hierarchical structure (parent/child relationships)
  - Special category types (main, deletion)
  - Ordering support
  - Bidirectional relationships with templates

#### 5. TemplateElement (`TemplateElement.kt`)
- **Purpose**: Polymorphic template elements using sealed classes
- **Key Features**:
  - Base element properties (coordinates, styling)
  - Sealed class hierarchy for different element types:
    - `StaticText`: Fixed text content
    - `DataText`: Dynamic text from data sources
    - `DataDate`: Dynamic date formatting
    - `Image`: Image elements with sizing
    - `QrCode`: QR code elements
  - Data source enumeration for dynamic content

#### 6. TemplateVariable (`TemplateVariable.kt`)
- **Purpose**: Configurable variables for templates
- **Key Features**:
  - Variable metadata (name, label, description)
  - Validation support (isRequired, defaultValue)
  - Ordering for UI display
  - Template relationship

#### 7. TemplateRecipientGroup (`TemplateRecipientGroup.kt`)
- **Purpose**: Groups of students that receive certificates
- **Key Features**:
  - Group metadata (name, description)
  - Many-to-many relationship with students
  - Template association

#### 8. Certificate (`Certificate.kt`)
- **Purpose**: Issued certificates with metadata
- **Key Features**:
  - Certificate tracking (certificateNumber, issuedDate, expiryDate)
  - Status management (active, revoked, expired, pending)
  - Flexible metadata storage
  - Relationships to student and template

### Supporting Types

#### 9. CommonTypes (`CommonTypes.kt`)
- **Purpose**: Shared types and input classes
- **Key Features**:
  - Authentication types (AuthPayload, LogoutResponse)
  - Configuration types (TemplateConfig, TemplatePreview)
  - Input types for all mutations
  - Comprehensive CRUD operation inputs

## Data Loaders

Each model has corresponding data loaders for efficient relationship loading:

1. `UserDataLoader` - Loads users by ID
2. `StudentDataLoader` - Loads students by ID
3. `TemplateDataLoader` - Loads templates by ID
4. `TemplateCategoryDataLoader` - Loads template categories by ID
5. `TemplateElementDataLoader` - Loads template elements by ID
6. `TemplateVariableDataLoader` - Loads template variables by ID
7. `TemplateRecipientGroupDataLoader` - Loads recipient groups by ID
8. `CertificateDataLoader` - Loads certificates by ID

## Key Design Patterns

### 1. DataLoader Integration
All models that have relationships use DataLoaders to prevent N+1 query problems:
```kotlin
fun category(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<TemplateCategory?> {
    return dataFetchingEnvironment.getValueFromDataLoader(TemplateCategoryDataLoader.dataLoaderName, categoryId)
}
```

### 2. Sealed Classes for Polymorphism
The `TemplateElement` uses sealed classes to represent different element types while maintaining type safety:
```kotlin
sealed class TemplateElement {
    // Base properties
    data class StaticText(...) : TemplateElement()
    data class DataText(...) : TemplateElement()
    // ... other types
}
```

### 3. Mock Data for Testing
Each model includes a `search` companion function with realistic mock data for testing and development.

### 4. Nullable Relationships
Optional relationships are properly handled with nullable types and null checks:
```kotlin
fun preDeletionCategory(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<TemplateCategory?> {
    return if (preDeletionCategoryId != null) {
        dataFetchingEnvironment.getValueFromDataLoader(TemplateCategoryDataLoader.dataLoaderName, preDeletionCategoryId)
    } else CompletableFuture.completedFuture(null)
}
```

## Integration with Existing Code

### Reusing Existing Enums
The schema models reuse existing enums from the database layer:
- `Gender` from `tables.Gender`
- `Nationality` from `tables.Nationality`

### Separate from Database Models
The GraphQL schema models are intentionally separate from the database models in `src/main/kotlin/models/` to:
- Allow for GraphQL-specific optimizations
- Support different field naming conventions
- Enable complex relationship handling
- Provide mock data for testing

## Next Steps

1. **Query Resolvers**: Implement query resolvers that use these models
2. **Mutation Resolvers**: Implement mutation resolvers for CRUD operations
3. **Database Integration**: Connect the mock data to actual database queries
4. **Authentication**: Implement authentication and authorization
5. **Validation**: Add input validation for mutations
6. **Error Handling**: Implement proper error handling and exceptions

## Usage Example

```kotlin
// In a GraphQL query resolver
class TemplateQueryResolver {
    fun template(id: String): Template? {
        return Template.search(listOf(id)).firstOrNull()
    }
}

// The GraphQL schema will automatically handle the relationships
// template(id: "1") {
//   id
//   name
//   category {
//     name
//   }
//   elements {
//     ... on StaticText {
//       content
//     }
//   }
// }
```

This implementation provides a solid foundation for the GraphQL API while maintaining compatibility with the existing codebase structure and patterns.
