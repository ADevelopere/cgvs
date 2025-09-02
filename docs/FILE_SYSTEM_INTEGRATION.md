# File System Integration Guide

This document describes the updated file system integration for templates that now use database-stored file references instead of string filenames.

## Changes Made

### 1. Database Schema Updates
- **Templates table**: Changed `image_file_name` (varchar) to `image_file_id` (foreign key to storage_files)
- **New storage tables**: 
  - `storage_directories`: Manages directory structure and permissions
  - `storage_files`: Stores file metadata and references
  - `file_usages`: Tracks which entities are using which files

### 2. Model Updates
- **Template model**: Now uses `imageFileId: Long?` instead of `imageFileName: String?`
- **New FileInfo model**: Represents file metadata with permissions and usage tracking
- **StorageFile DataLoader**: Efficient batch loading of file information

### 3. Service Layer Updates
- **StorageService**: Enhanced with file management by ID
- **FileInitializationService**: Handles directory creation and demo file uploads
- **TemplateService**: Updated to work with file IDs

### 4. Demo Data Seeder Updates
- **Automatic file system setup**: Creates required directories on startup
- **Demo file upload**: Uploads demo template images from `src/main/resources/img/`
- **File usage tracking**: Registers template-file relationships

## Setup Instructions

### 1. Database Migration
Run the migration script to update your database schema:

```sql
-- Execute the migration in database/migrations/000007_update_templates_file_references.sql
```

### 2. Configuration
Copy and customize the configuration file:

```bash
cp application.conf.example src/main/resources/application.conf
```

Update the configuration with your database and GCS settings:

```hocon
app {
    seedDemoData = true  # Set to true for initial setup
}

database {
    url = "jdbc:mysql://localhost:3306/cgsv"
    user = "your_db_user"
    password = "your_db_password"
}

gcs {
    bucketName = "your-bucket-name"
    credentialsPath = "path/to/service-account-key.json"
}
```

### 3. Demo Images
Ensure demo images are present in `src/main/resources/img/`:
- demo1.jpg
- demo2.jpg  
- demo3.jpg
- demo4.jpg

### 4. Application Startup
When you start the application with `seedDemoData = true`, it will:

1. **Initialize file system**:
   - Create required directories (`public/templates/covers`, etc.)
   - Upload demo images from resources to GCS bucket
   - Register directories and files in database

2. **Seed demo data**:
   - Create admin user
   - Create template categories
   - Create templates with file references
   - Register file usage relationships
   - Create sample students

## File System Structure

The application creates the following directory structure:

```
bucket/
├── public/
│   ├── templates/
│   │   └── covers/          # Template cover images
│   ├── certificates/        # Generated certificates
│   └── uploads/            # User uploaded files
└── private/
    └── temp/               # Temporary files
```

## Directory Permissions

Each directory has configurable permissions:
- `allowUploads`: Whether files can be uploaded to this directory
- `allowDelete`: Whether the directory can be deleted
- `allowMove`: Whether the directory can be moved
- `allowCreateSubdirs`: Whether subdirectories can be created
- `allowDeleteFiles`: Whether files in this directory can be deleted
- `allowMoveFiles`: Whether files in this directory can be moved

Root directories (`public/`, `private/`) are protected by default.

## File Usage Tracking

The system tracks file usage to prevent accidental deletion:
- Template cover images are registered with usage type `template_cover`
- References include the table name and entity ID
- Files with active usage cannot be deleted without explicit force

## GraphQL API Updates

### Template Type
```graphql
type Template {
    id: Int!
    name: String!
    description: String
    imageFile: FileInfo        # New: Direct file access
    imageUrl: String          # Updated: Uses file path from database
    category: TemplateCategory!
    # ... other fields
}

type FileInfo {
    id: Long!
    path: String!
    name: String!
    size: Long!
    contentType: String
    created: DateTime!
    lastModified: DateTime!
    # ... other metadata
}
```

### Mutations
```graphql
# Template creation/update now uses file IDs
input UpdateTemplateInput {
    id: Int!
    name: String
    description: String
    categoryId: Int!
    imageFileId: Long         # New: File ID instead of filename
}
```

## Migration from Old System

If you have existing templates with `image_file_name` values:

1. **Backup your database** before running the migration
2. The migration script will:
   - Create storage tables
   - Add `image_file_id` column to templates
   - Migrate existing filenames to file records
   - Register file usage relationships
3. **Verify the migration** using the provided verification queries
4. Only after verification, drop the old `image_file_name` column

## Troubleshooting

### Demo Files Not Found
Ensure demo images are in `src/main/resources/img/`:
```bash
ls -la src/main/resources/img/
# Should show demo1.jpg, demo2.jpg, demo3.jpg, demo4.jpg
```

### GCS Permission Issues
Verify your service account has the required permissions:
- Storage Object Admin (for file operations)
- Storage Bucket Admin (for bucket operations)

### Database Connection Issues
Check your database configuration and ensure:
- Database exists and is accessible
- User has CREATE/ALTER/INSERT/UPDATE permissions
- Connection string is correct

### File Upload Failures
Check:
- GCS bucket exists and is accessible
- Bucket permissions allow uploads
- File size within limits (100MB default)
- Content type is supported

## Development Notes

### Adding New File Types
To support new file types, update the `ContentType` enum in `StorageManagement.kt`:

```kotlin
enum class ContentType(val value: String) {
    // ... existing types
    NEW_TYPE("new/mime-type")
}
```

### Custom Directory Structure
Modify `FileInitializationService.createRequiredDirectories()` to add new directories:

```kotlin
val customDir = DirectoryInfo(
    path = "public/custom", 
    description = "Custom files",
    parentPath = "public"
)
```

### File Processing Hooks
Extend `StorageService` to add processing hooks for uploaded files:

```kotlin
override fun uploadFile(...): FileUploadResult {
    val result = super.uploadFile(...)
    if (result.success) {
        // Add custom processing here
        processUploadedFile(result.fileInfo)
    }
    return result
}
```