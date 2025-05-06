# Migration Plan: REST to GraphQL using Lighthouse

## Overview
This document outlines the steps needed to migrate the current REST API to GraphQL using the Lighthouse package for Laravel.

## Initial Setup Requirements

1. Install Lighthouse package:
```bash
composer require nuwave/lighthouse
```

2. Publish the configuration:
```bash
php artisan vendor:publish --tag=lighthouse-config
```

3. Create initial schema file:
```bash
php artisan lighthouse:ide-helper
```

## File Analysis and Required Changes

### Models

#### 1. User.php
Current State:
- Basic Eloquent model with relationships
- Used in REST API controllers

Required Changes:
- Add GraphQL type definition in `graphql/types/User.graphql`
- Define Query and Mutation resolvers
- Add model-specific directives for Lighthouse

#### 2. Template.php
Current State:
- Complex model with multiple relationships
- CRUD operations through REST endpoints

Required Changes:
- Create GraphQL type definition with all relationships
- Add nested mutations for template creation/updates
- Implement proper authorization using `@can` directive
- Add pagination support using `@paginate` directive

#### 3. TemplateCategory.php
Current State:
- Simple categorization model
- Basic REST CRUD operations

Required Changes:
- Create GraphQL type definition
- Add Query for category listing with filtering
- Implement category-template relationship in schema

#### 4. TemplateElement.php
Current State:
- Represents template components
- Complex REST endpoints for manipulation

Required Changes:
- Create GraphQL type with nested relationships
- Implement mutations for element CRUD operations
- Add validation directives
- Consider implementing batched mutations for bulk operations

#### 5. TemplateRecipient.php
Current State:
- Manages recipient information
- REST endpoints for recipient management

Required Changes:
- Create GraphQL type definition
- Implement recipient-specific queries
- Add mutations for recipient management
- Include authorization checks

#### 6. TemplateVariable.php
Current State:
- Handles dynamic template variables
- REST endpoints for variable management

Required Changes:
- Create GraphQL type for variables
- Implement variable-specific queries
- Add mutations for variable CRUD operations
- Include validation rules

#### 7. RecipientVariableValue.php
Current State:
- Stores recipient-specific variable values
- REST endpoints for value management

Required Changes:
- Create GraphQL type definition
- Implement value-specific queries
- Add mutations for value management
- Include proper relationship handling in schema

### Exceptions

#### TabAccessDeniedException.php & TemplateStorageException.php
Current State:
- Custom exceptions for REST API error handling

Required Changes:
- Create GraphQL error handling system
- Implement proper error types in schema
- Add error handling directives
- Modify exceptions to work with GraphQL error formatter

### Policies

#### TemplatePolicy.php
Current State:
- Authorization logic for REST endpoints

Required Changes:
- Adapt policies to work with Lighthouse's `@can` directive
- Implement field-level authorization
- Add policy checks to GraphQL schema

## Schema Structure

Create the following schema files:
1. `graphql/schema.graphql` - Main schema file
2. `graphql/types/*.graphql` - Type definitions
3. `graphql/queries/*.graphql` - Query definitions
4. `graphql/mutations/*.graphql` - Mutation definitions

## Implementation Steps

1. Base Setup
   - Install and configure Lighthouse
   - Set up schema structure
   - Configure error handling

2. Type Definitions
   - Create types for all models
   - Define relationships
   - Add input types for mutations

3. Queries
   - Implement queries for all current REST GET endpoints
   - Add filtering, pagination, and sorting
   - Implement proper authorization

4. Mutations
   - Create mutations for all current REST POST/PUT/DELETE endpoints
   - Implement validation
   - Add proper error handling

5. Authorization
   - Implement field-level authorization
   - Add policy checks
   - Configure authentication middleware

6. Testing
   - Create GraphQL-specific tests
   - Test all queries and mutations
   - Verify authorization rules

## API Routes Changes

1. Remove old REST routes from `routes/api.php`
2. Configure GraphQL endpoint in `config/lighthouse.php`
3. Set up any necessary middleware

## Frontend Changes Required

1. Install GraphQL client (Apollo recommended)
2. Replace REST API calls with GraphQL queries/mutations
3. Update error handling
4. Implement proper caching strategy

## Performance Considerations

1. Implement DataLoader for N+1 query prevention
2. Configure proper caching
3. Set up persisted queries if needed
4. Monitor query complexity

## Security Considerations

1. Set up proper validation
2. Implement rate limiting
3. Configure field security
4. Set up proper error masking

## Routes Analysis and GraphQL Migration

### api.php Analysis

Current REST Endpoints to Convert:

#### Authentication Routes
- POST `/login` → Convert to GraphQL mutation `login(email: String!, password: String!): AuthPayload`
- POST `/logout` → Convert to GraphQL mutation `logout: Boolean!`
- GET `/user` → Convert to GraphQL query `me: User!`

#### Admin Dashboard
- GET `/admin/dashboard` → Convert to GraphQL query `adminDashboard: DashboardData!`

#### Template Categories
Current REST endpoints:
- GET/POST/PUT/DELETE `/admin/template-categories` (Resource routes)
- POST `/admin/template-categories/reorder`

GraphQL Conversions Needed:
```graphql
type Query {
  templateCategories: [TemplateCategory!]! @paginate
  templateCategory(id: ID! @eq): TemplateCategory! @find
}

type Mutation {
  createTemplateCategory(input: TemplateCategoryInput! @spread): TemplateCategory! @create
  updateTemplateCategory(id: ID!, input: TemplateCategoryInput! @spread): TemplateCategory! @update
  deleteTemplateCategory(id: ID!): TemplateCategory! @delete
  reorderTemplateCategories(input: [ReorderInput!]!): [TemplateCategory!]!
}
```

#### Templates
Current REST endpoints:
- GET/POST/PUT/DELETE `/admin/templates` (Resource routes)
- GET `/admin/templates/config`
- POST `/admin/templates/reorder`

GraphQL Conversions Needed:
```graphql
type Query {
  templates: [Template!]! @paginate
  template(id: ID! @eq): Template! @find
  templateConfig: TemplateConfig!
}

type Mutation {
  createTemplate(input: TemplateInput! @spread): Template! @create
  updateTemplate(id: ID!, input: TemplateInput! @spread): Template! @update
  deleteTemplate(id: ID!): Template! @delete
  reorderTemplates(input: [ReorderInput!]!): [Template!]!
}
```

#### Template Variables
Current REST endpoints:
- GET/POST `/admin/templates/{template}/variables`
- GET/PUT/DELETE `/admin/variables/{id}`
- POST `/admin/templates/{template}/variables/reorder`

GraphQL Conversions Needed:
```graphql
type Query {
  templateVariables(templateId: ID! @eq): [TemplateVariable!]! @paginate
  templateVariable(id: ID! @eq): TemplateVariable! @find
}

type Mutation {
  createTemplateVariable(templateId: ID!, input: TemplateVariableInput! @spread): TemplateVariable! @create
  updateTemplateVariable(id: ID!, input: TemplateVariableInput! @spread): TemplateVariable! @update
  deleteTemplateVariable(id: ID!): TemplateVariable! @delete
  reorderTemplateVariables(templateId: ID!, input: [ReorderInput!]!): [TemplateVariable!]!
}
```

#### Template Recipients
Current REST endpoints:
- GET/POST/PUT/DELETE operations on `/admin/templates/{template}/recipients`
- GET `/admin/templates/{template}/recipients/template`
- POST `/admin/templates/{template}/recipients/validate`
- POST `/admin/templates/{template}/recipients/import`

GraphQL Conversions Needed:
```graphql
type Query {
  templateRecipients(templateId: ID! @eq): [TemplateRecipient!]! @paginate
  templateRecipientTemplate(templateId: ID!): String! # Returns download URL
}

type Mutation {
  createTemplateRecipient(templateId: ID!, input: TemplateRecipientInput! @spread): TemplateRecipient! @create
  updateTemplateRecipient(id: ID!, input: TemplateRecipientInput! @spread): TemplateRecipient! @update
  deleteTemplateRecipient(id: ID!): TemplateRecipient! @delete
  validateTemplateRecipients(templateId: ID!, file: Upload!): ValidationResult!
  importTemplateRecipients(templateId: ID!, file: Upload!): ImportResult!
}
```

### web.php Analysis

The web.php file only contains a catch-all route for the SPA frontend. No GraphQL conversion needed as this route will continue to serve the frontend application that will consume the GraphQL API.

## Implementation Priority Order

1. Set up Lighthouse and base schema
2. Convert Authentication endpoints
3. Convert Template Categories (simplest resource)
4. Convert Templates
5. Convert Template Variables
6. Convert Template Recipients (most complex due to file uploads)
7. Convert Dashboard queries
8. Implement error handling and authorization

## File Upload Handling

For endpoints that handle file uploads (template recipients), we'll need to:
1. Install and configure `mll-lab/laravel-graphql-upload`
2. Modify the schema to handle multipart form data
3. Update frontend code to use GraphQL file uploads

## Authentication Changes

1. Configure Lighthouse to work with Laravel Sanctum
2. Add auth directives to schema
3. Implement login/logout mutations
4. Add middleware configurations for GraphQL endpoint

## Providers Analysis and Changes

### AppServiceProvider.php
Current State:
- Default Laravel service provider
- Currently empty register and boot methods

Required Changes:
1. Add Lighthouse-specific service registrations:
```php
public function register(): void
{
    // Register custom scalar types if needed
    // Register custom directive classes
    // Register custom field resolver classes
}

public function boot(): void
{
    // Register custom validation rules for GraphQL input types
    // Configure Lighthouse global middleware
    // Set up any custom field resolver mappings
}
```

### AuthServiceProvider.php
Current State:
- Handles policy mappings (Template -> TemplatePolicy)
- Defines custom gates:
  - 'admin' gate for admin access
  - 'manage-recipients' gate for recipient management

Required Changes:
1. Update policy mappings to work with GraphQL:
```php
protected $policies = [
    Template::class => TemplatePolicy::class,
    // Add any new model-policy mappings needed for GraphQL
];
```

2. Add GraphQL-specific authorization:
```php
public function boot(): void
{
    $this->registerPolicies();

    // Keep existing gates
    Gate::define('admin', function ($user) {
        return $user->isAdmin();
    });

    Gate::define('manage-recipients', function ($user) {
        return true;
    });

    // Add new GraphQL-specific gates
    Gate::define('viewGraphQLPlayground', function ($user) {
        return $user->isAdmin(); // Restrict GraphQL playground access to admins
    });

    Gate::define('graphql.validation', function ($user, $query) {
        // Add query validation logic
        return true;
    });

    Gate::define('graphql.introspection', function ($user) {
        // Control who can perform introspection queries
        return $user->isAdmin();
    });
}
```

3. Create New GraphQLServiceProvider:
Create a new service provider `app/Providers/GraphQLServiceProvider.php` to handle GraphQL-specific configurations:

```php
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Nuwave\Lighthouse\Schema\TypeRegistry;
use Nuwave\Lighthouse\Schema\Types\LaravelEnumType;

class GraphQLServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Register custom GraphQL types
        $this->app->afterResolving(TypeRegistry::class, function (TypeRegistry $typeRegistry): void {
            // Register custom scalars
            // Register custom enums
            // Register custom interfaces
        });
    }

    public function boot(): void
    {
        // Configure GraphQL middleware
        // Set up custom field resolvers
        // Configure error handling
        // Set up custom validation rules
    }
}
```

## Provider Implementation Steps

1. AppServiceProvider Changes:
   - Add Lighthouse service registrations
   - Configure global middleware
   - Set up custom validation rules

2. AuthServiceProvider Changes:
   - Update policy mappings for GraphQL
   - Add GraphQL-specific gates
   - Configure introspection permissions
   - Set up query validation

3. New GraphQLServiceProvider:
   - Create the new provider class
   - Register it in `config/app.php`
   - Implement custom type registrations
   - Set up GraphQL-specific configurations

4. Update Laravel Configuration:
```php
// config/app.php
'providers' => [
    // ...existing providers...
    App\Providers\GraphQLServiceProvider::class,
],
```

# Controllers Analysis and GraphQL Migration

## Admin Controllers Analysis

### DashboardController
Current State:
- Simple controller returning dashboard statistics
- Returns totalTemplates, totalCertificates, and recentActivity

GraphQL Changes Needed:
```graphql
type DashboardStats {
  totalTemplates: Int!
  totalCertificates: Int!
  recentActivity: [Activity!]!
}

type Activity {
  id: ID!
  type: String!
  description: String!
  timestamp: DateTime!
}

type Query {
  adminDashboard: DashboardStats! @guard @can(ability: "admin")
}
```

Implementation:
1. Create `graphql/types/DashboardStats.graphql`
2. Create resolver in `app/GraphQL/Queries/AdminDashboard.php`
3. Move logic from controller to resolver

### TemplateCategoryController
Current State:
- Full CRUD operations for template categories
- Complex validation rules
- Parent-child relationship handling
- Special category types handling
- Order management

GraphQL Changes Needed:
```graphql
type TemplateCategory {
  id: ID!
  name: String!
  description: String
  parentCategory: TemplateCategory @belongsTo
  childCategories: [TemplateCategory!]! @hasMany
  templates: [Template!]! @hasMany
  order: Int!
  specialType: String
}

input CreateTemplateCategoryInput {
  name: String! @rules(apply: ["required", "string", "min:3", "max:255"])
  description: String
  parentCategoryId: ID @rules(apply: ["exists:template_categories,id"])
}

input UpdateTemplateCategoryInput {
  name: String @rules(apply: ["string", "min:3", "max:255"])
  description: String
  parentCategoryId: ID @rules(apply: ["exists:template_categories,id"])
}

input ReorderCategoriesInput {
  id: ID!
  order: Int!
}

type Mutation {
  createTemplateCategory(input: CreateTemplateCategoryInput! @spread): TemplateCategory! 
    @guard 
    @can(ability: "admin")
    @validator
  
  updateTemplateCategory(id: ID!, input: UpdateTemplateCategoryInput! @spread): TemplateCategory! 
    @guard 
    @can(ability: "admin")
    @validator
  
  deleteTemplateCategory(id: ID!): TemplateCategory! 
    @guard 
    @can(ability: "admin")
  
  reorderTemplateCategories(input: [ReorderCategoriesInput!]!): [TemplateCategory!]! 
    @guard 
    @can(ability: "admin")
}
```

### TemplateController
Current State:
- Complex CRUD operations
- File uploads for backgrounds
- Configuration management
- Tab permission middleware
- Storage handling

GraphQL Changes Needed:
```graphql
scalar Upload

type Template {
  id: ID!
  name: String!
  description: String
  backgroundUrl: String
  category: TemplateCategory! @belongsTo
  elements: [TemplateElement!]! @hasMany
  variables: [TemplateVariable!]! @hasMany
  recipients: [TemplateRecipient!]! @hasMany
}

type TemplateConfig {
  maxBackgroundSize: Int!
  allowedFileTypes: [String!]!
}

input CreateTemplateInput {
  name: String! @rules(apply: ["required", "string", "max:255"])
  description: String
  categoryId: ID! @rules(apply: ["required", "exists:template_categories,id"])
  background: Upload
}

type Query {
  templates: [Template!]! @paginate @guard @can(ability: "viewTemplates")
  template(id: ID! @eq): Template! @find @guard @can(ability: "viewTemplate", find: "id")
  templateConfig: TemplateConfig! @guard
}

type Mutation {
  createTemplate(input: CreateTemplateInput! @spread): Template! 
    @guard 
    @can(ability: "createTemplate")
    @validator
  
  updateTemplate(id: ID!, input: UpdateTemplateInput! @spread): Template! 
    @guard 
    @can(ability: "updateTemplate", find: "id")
    @validator
  
  deleteTemplate(id: ID!): Template! 
    @guard 
    @can(ability: "deleteTemplate", find: "id")
}
```

### TemplateVariableController
Current State:
- Variable CRUD operations
- Type-specific validation
- Parent template relationship

GraphQL Changes Needed:
```graphql
enum VariableType {
  TEXT
  DATE
  NUMBER
  GENDER
}

type TemplateVariable {
  id: ID!
  name: String!
  type: VariableType!
  description: String
  previewValue: String
  template: Template! @belongsTo
  order: Int!
}

input CreateTemplateVariableInput {
  templateId: ID!
  name: String! @rules(apply: ["required", "string", "max:255"])
  type: VariableType! @rules(apply: ["required"])
  description: String
  previewValue: String
}

type Mutation {
  createTemplateVariable(input: CreateTemplateVariableInput! @spread): TemplateVariable!
    @guard
    @can(ability: "createVariable")
    @validator
  
  updateTemplateVariable(id: ID!, input: UpdateTemplateVariableInput! @spread): TemplateVariable!
    @guard
    @can(ability: "updateVariable", find: "id")
    @validator
}
```

### TemplateRecipientsController
Current State:
- Complex recipient management
- Excel file handling
- Batch operations
- Validation and import functionality

GraphQL Changes Needed:
```graphql
type TemplateRecipient {
  id: ID!
  templateId: ID!
  isValid: Boolean!
  validationErrors: [String!]
  data: JSON!
}

type ValidationResult {
  isValid: Boolean!
  errors: [String!]
  preview: [JSON!]
}

type ImportResult {
  success: Boolean!
  importedCount: Int!
  errors: [String!]
}

type Mutation {
  validateRecipients(templateId: ID!, file: Upload!): ValidationResult!
    @guard
    @can(ability: "manageRecipients")
  
  importRecipients(templateId: ID!, file: Upload!): ImportResult!
    @guard
    @can(ability: "manageRecipients")
  
  updateRecipient(id: ID!, input: UpdateRecipientInput! @spread): TemplateRecipient!
    @guard
    @can(ability: "updateRecipient", find: "id")
}

type Query {
  templateRecipients(templateId: ID! @eq): [TemplateRecipient!]! 
    @paginate
    @guard
    @can(ability: "viewRecipients")
}
```

## Implementation Steps for Controllers

1. Create Base Types:
   - Set up all base GraphQL types in `graphql/types/`
   - Define enums for variable types and other constants
   - Create input types for all mutations

2. Create Resolvers:
   - Move controller logic to dedicated resolver classes
   - Implement field resolvers for complex computations
   - Set up proper error handling

3. File Upload Handling:
   - Implement custom scalar for Upload type
   - Create file upload directives
   - Configure multipart request handling

4. Validation:
   - Move validation rules to GraphQL schema
   - Create custom validation directives where needed
   - Implement complex validation in resolver classes

5. Authorization:
   - Add @guard and @can directives to queries/mutations
   - Move middleware logic to directives
   - Implement field-level authorization

6. Testing:
   - Create GraphQL-specific test cases
   - Test file upload functionality
   - Verify authorization rules

7. Documentation:
   - Add descriptions to all types and fields
   - Document validation rules
   - Create usage examples

These changes will replace all REST controller functionality with equivalent GraphQL operations while maintaining existing business logic and security measures.

# Auth Controllers Analysis and GraphQL Migration

## AuthController Analysis

### Current State:
- Handles user authentication with Laravel Sanctum
- Three main endpoints:
  1. `login`: Email/password authentication
  2. `logout`: Token revocation
  3. `user`: Current user retrieval
- Custom validation messages
- Error handling for invalid credentials
- Token creation and management

### GraphQL Changes Needed:

1. Create Auth Types:
```graphql
type User {
  id: ID!
  email: String!
  name: String
  isAdmin: Boolean!
  created_at: DateTime!
  updated_at: DateTime!
}

type AuthPayload {
  token: String!
  user: User!
}

type LogoutResponse {
  message: String!
}
```

2. Create Auth Mutations and Queries:
```graphql
type Mutation {
  login(
    email: String! @rules(apply: ["required", "email", "exists:users,email"])
    password: String! @rules(apply: ["required", "min:6"])
  ): AuthPayload! @field(resolver: "AuthMutator@login")

  logout: LogoutResponse! 
    @guard 
    @field(resolver: "AuthMutator@logout")
}

type Query {
  me: User! 
    @guard 
    @auth
    @field(resolver: "AuthQuery@me")
}
```

3. Create GraphQL Resolvers:

Create `app/GraphQL/Mutations/AuthMutator.php`:
```php
<?php

namespace App\GraphQL\Mutations;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthMutator
{
    public function login($root, array $args)
    {
        $user = User::where('email', $args['email'])->first();

        if (!$user || !Hash::check($args['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return [
            'token' => $token,
            'user' => $user,
        ];
    }

    public function logout($root, array $args, $context)
    {
        $context->user()->currentAccessToken()->delete();

        return [
            'message' => 'Logged out successfully'
        ];
    }
}
```

Create `app/GraphQL/Queries/AuthQuery.php`:
```php
<?php

namespace App\GraphQL\Queries;

class AuthQuery
{
    public function me($root, array $args, $context)
    {
        return $context->user();
    }
}
```

4. Add Custom Error Handling:
```php
<?php

namespace App\GraphQL\Errors;

use GraphQL\Error\Error;
use Nuwave\Lighthouse\Execution\ErrorHandler;

class AuthenticationErrorHandler implements ErrorHandler
{
    public function handle(Error $error, \Closure $next)
    {
        if ($error->getPrevious() instanceof ValidationException) {
            return null;
        }

        return $next($error);
    }
}
```

5. Update Lighthouse Configuration:
```php
// config/lighthouse.php

'guards' => [
    'api' => 'sanctum',
],

'error_handlers' => [
    \App\GraphQL\Errors\AuthenticationErrorHandler::class,
],
```

## Implementation Steps

1. Authentication Setup:
   - Configure Lighthouse with Sanctum
   - Set up error handlers
   - Create authentication directives

2. Type Definitions:
   ```bash
   php artisan lighthouse:type User
   php artisan lighthouse:type AuthPayload
   ```

3. Create Resolvers:
   ```bash
   php artisan lighthouse:mutation AuthMutator
   php artisan lighthouse:query AuthQuery
   ```

4. Error Handling:
   - Implement custom error handler
   - Set up validation error formatting
   - Add proper error messages

5. Testing:
   - Create auth-specific test cases
   - Test token management
   - Verify error scenarios

## Security Considerations

1. Token Management:
   - Implement token expiration
   - Add refresh token functionality if needed
   - Configure token scopes

2. Rate Limiting:
   - Add rate limiting for login attempts
   - Implement throttling middleware

3. Validation:
   - Move all validation rules to schema
   - Implement custom validation messages
   - Add proper error responses

4. Session Handling:
   - Configure proper session management
   - Handle multiple devices/tokens
   - Implement token revocation

# Database Migrations Analysis

## 1. Users Tables (000001_create_users_tables.php)

### Current State:
- Creates three tables:
  1. users
  2. password_reset_tokens
  3. sessions

### Required Changes for GraphQL:
1. User Table Schema - No changes needed, but needs GraphQL type definitions:
```graphql
type User {
  id: ID!
  name: String!
  email: String!
  emailVerifiedAt: DateTime
  isAdmin: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

2. Password Reset - Add GraphQL mutations:
```graphql
type Mutation {
  requestPasswordReset(email: String! @rules(apply: ["required", "email"])): PasswordResetResponse!
  resetPassword(
    email: String! @rules(apply: ["required", "email"])
    token: String! @rules(apply: ["required"])
    password: String! @rules(apply: ["required", "min:8", "confirmed"])
  ): PasswordResetResult!
}

type PasswordResetResponse {
  message: String!
  success: Boolean!
}

type PasswordResetResult {
  message: String!
  success: Boolean!
}
```

3. Sessions - Add GraphQL queries:
```graphql
type Session {
  id: ID!
  userId: ID
  ipAddress: String
  userAgent: String
  lastActivity: DateTime!
}

type Query {
  userSessions: [Session!]! @auth @can(ability: "viewSessions")
}

type Mutation {
  deleteSession(id: ID!): Boolean! @auth @can(ability: "deleteSession", find: "id")
  deleteAllSessions: Boolean! @auth @can(ability: "deleteAllSessions")
}
```

## 2. Templates Tables (000005_create_templates_tables.php)

### Current State:
- Creates template_categories table with:
  - Hierarchical structure (parent-child)
  - Special categories (main, deleted)
  - Order management
  - Soft deletes
  - Name length constraints
  - Special initial categories

### Required Changes for GraphQL:
1. Template Categories Schema:
```graphql
type TemplateCategory {
  id: ID!
  name: String! @rules(apply: ["min:3"])
  description: String
  parentCategory: TemplateCategory @belongsTo
  childCategories: [TemplateCategory!]! @hasMany
  order: Int
  specialType: TemplateCategoryType
  createdAt: DateTime!
  updatedAt: DateTime!
  deletedAt: DateTime
}

enum TemplateCategoryType {
  DELETED
  MAIN
}

input CreateTemplateCategoryInput {
  name: String! @rules(apply: ["required", "min:3"])
  description: String
  parentCategoryId: ID @rules(apply: ["exists:template_categories,id"])
  order: Int
}
```

2. Special Category Handling:
```graphql
extend type Query {
  mainCategory: TemplateCategory! @field(resolver: "TemplateCategoryQuery@mainCategory")
  deletedCategory: TemplateCategory! @field(resolver: "TemplateCategoryQuery@deletedCategory")
}

extend type Mutation {
  moveToDeletedCategory(templateId: ID!): Template! 
    @guard 
    @can(ability: "deleteTemplate")
    @field(resolver: "TemplateMutation@moveToDeleted")
}
```

3. Custom Validation Directives:
```php
namespace App\GraphQL\Directives;

class ValidateTemplateCategoryNameDirective extends BaseDirective
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'min:3'],
            'special_type' => [
                'prohibited_if:parent_category_id,!null',
                Rule::unique('template_categories')->ignore($this->argument('id')),
            ],
        ];
    }
}
```

## Implementation Steps for Database Changes

1. Schema Changes:
   - No direct database schema changes needed
   - Focus on GraphQL schema implementation

2. Data Access Layer:
   - Implement model resolvers
   - Add field resolvers for complex computations
   - Set up proper N+1 query prevention

3. Validation:
   - Move database constraints to GraphQL validation
   - Implement custom validation directives
   - Handle special category rules

4. Special Categories:
   - Implement special category resolvers
   - Add protection for special categories
   - Handle soft deletes properly

## Security Considerations

1. Data Validation:
   - Maintain database constraints
   - Add GraphQL-level validation
   - Implement custom validation rules

2. Access Control:
   - Protect special categories
   - Implement proper authorization
   - Handle soft deletes securely

3. Performance:
   - Add proper indexing
   - Implement DataLoader for relationships
   - Handle N+1 query problems

These changes will ensure that the database structure works seamlessly with GraphQL while maintaining data integrity and performance.
