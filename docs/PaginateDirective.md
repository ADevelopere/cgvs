# GraphQL @paginate Directive

This document explains how to use the custom `@paginate` directive in your GraphQL Kotlin project.

## Overview

The `@paginate` directive provides pagination functionality for GraphQL fields. It supports three types of pagination:

1. **PAGINATOR** - Offset-based pagination with full pagination info (default)
2. **SIMPLE** - Simple offset-based pagination without pagination info
3. **CONNECTION** - Cursor-based pagination following Relay specification

## Installation

The directive is automatically available in your GraphQL schema once the files are added to your project.

## Directive Parameters

- `defaultCount: Int = 15` - Default number of items per page
- `maxCount: Int = 100` - Maximum number of items that can be requested per page
- `type: PaginationType = PAGINATOR` - Type of pagination to use
- `includePaginationInfo: Boolean = true` - Whether to include pagination info in response
- `edgeType: String = ""` - Name of the connection edge type for Relay-style pagination

## Usage Examples

### 1. Basic Pagination with Full Info

```kotlin
@PaginateDirective(defaultCount = 15, maxCount = 100)
fun users(
    first: Int? = null,
    skip: Int? = null,
    page: Int? = null
): PaginatedResponse<User> {
    val allUsers = userService.getAllUsers()
    return allUsers.paginate(first, skip, page)
}
```

GraphQL Query:
```graphql
query {
  users(first: 10, page: 2) {
    data {
      id
      name
      email
    }
    paginationInfo {
      count
      currentPage
      hasMorePages
      total
      perPage
      lastPage
    }
  }
}
```

### 2. Simple Pagination

```kotlin
@PaginateDirective(type = PaginationType.SIMPLE)
fun simpleUsers(
    first: Int? = null,
    skip: Int? = null
): List<User> {
    val allUsers = userService.getAllUsers()
    return allUsers.paginateSimple(first, skip)
}
```

GraphQL Query:
```graphql
query {
  simpleUsers(first: 10, skip: 20) {
    id
    name
    email
  }
}
```

### 3. Connection-Style Pagination (Relay)

```kotlin
@PaginateDirective(type = PaginationType.CONNECTION)
fun userConnection(
    first: Int? = null,
    after: String? = null,
    before: String? = null,
    last: Int? = null
): Connection<User> {
    val allUsers = userService.getAllUsers()
    return allUsers.paginateConnection(first, after, before, last)
}
```

GraphQL Query:
```graphql
query {
  userConnection(first: 10, after: "cursor123") {
    edges {
      node {
        id
        name
        email
      }
      cursor
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
```

## Pagination Utility Functions

The directive comes with utility functions that can be used directly in your resolvers:

### Extension Functions

```kotlin
// Full pagination with info
val paginatedResult = items.paginate(first = 10, page = 1)

// Simple pagination
val simpleResult = items.paginateSimple(first = 10, skip = 20)

// Connection pagination
val connectionResult = items.paginateConnection(first = 10, after = "cursor")
```

### Utility Class

```kotlin
// Using the utility class directly
val paginatedResult = PaginationUtils.paginate(items, first = 10, page = 1)
val simpleResult = PaginationUtils.paginateSimple(items, first = 10, skip = 20)
val connectionResult = PaginationUtils.paginateConnection(items, first = 10, after = "cursor")
```

## Response Types

### PaginatedResponse<T>
```kotlin
data class PaginatedResponse<T>(
    val data: List<T>,
    val paginationInfo: PaginationInfo?
)
```

### PaginationInfo
```kotlin
data class PaginationInfo(
    val count: Int,           // Number of items in current page
    val currentPage: Int,     // Current page number
    val firstItem: Int?,      // Index of first item
    val hasMorePages: Boolean,// Whether there are more pages
    val lastItem: Int?,       // Index of last item
    val lastPage: Int?,       // Last page number
    val perPage: Int,         // Items per page
    val total: Int?           // Total number of items
)
```

### Connection<T> (Relay)
```kotlin
data class Connection<T>(
    val edges: List<Edge<T>>,
    val pageInfo: PageInfo
)

data class Edge<T>(
    val node: T,
    val cursor: String
)

data class PageInfo(
    val hasNextPage: Boolean,
    val hasPreviousPage: Boolean,
    val startCursor: String?,
    val endCursor: String?
)
```

## Parameters

### Common Parameters
- `first: Int?` - Number of items to fetch
- `skip: Int?` - Number of items to skip (offset)
- `page: Int?` - Page number (1-based)

### Connection-Specific Parameters
- `after: String?` - Cursor to fetch items after
- `before: String?` - Cursor to fetch items before
- `last: Int?` - Number of items to fetch from the end

## Best Practices

1. **Set reasonable defaults** - Use appropriate `defaultCount` and `maxCount` values
2. **Use the right pagination type** - Choose based on your client needs:
   - `PAGINATOR` for web interfaces with page numbers
   - `SIMPLE` for infinite scroll without page info
   - `CONNECTION` for Relay clients or cursor-based pagination
3. **Handle large datasets** - Consider database-level pagination for better performance
4. **Validate parameters** - The directive automatically enforces `maxCount` limits

## Integration with Existing Queries

To add pagination to existing queries, simply:

1. Add the `@PaginateDirective` annotation
2. Update the return type to use pagination response types
3. Use the pagination utility functions
4. Add pagination parameters to your resolver

Example migration:
```kotlin
// Before
fun users(): List<User> {
    return userService.getAllUsers()
}

// After
@PaginateDirective()
fun users(first: Int? = null, page: Int? = null): PaginatedResponse<User> {
    val allUsers = userService.getAllUsers()
    return allUsers.paginate(first = first, page = page)
}
```
