# Storage Management System

This is a comprehensive file storage management system for the CGSV application that provides location-aware file uploads and management.

## Overview

The storage system is designed around predefined upload locations defined in the backend. The frontend shows these locations as entry points in the storage interface, starting from the `public` directory.

## Architecture

### Backend Integration
- **UploadLocation Enum**: Defined in `src/main/kotlin/schema/model/FileManagement.kt`
- Each location has a path (e.g., `public/templateCover`) and allowed content types
- Currently supports: `TEMPLATE_COVER` location for certificate template covers

### Frontend Structure

#### Core Components
- **StorageManagementContext**: Main context for storage operations
- **StorageGraphQLContext**: GraphQL operations wrapper
- **useStorageLocation**: Hook for location-aware utilities

#### Key Features
1. **Location-Aware Navigation**: Root shows predefined locations as cards
2. **Smart Upload Detection**: Uploads only allowed in valid locations
3. **Path Translation**: Converts between display paths and backend storage paths
4. **Type Safety**: Full TypeScript integration with GraphQL types

#### Components
- `LocationGrid`: Shows available storage locations at root
- `UploadLocationInfo`: Displays current location info and allowed file types
- `StorageToolbar`: Upload controls with location validation
- `StorageBreadcrumbs`: Navigation with location-aware labels
- `EmptyState`: Context-aware empty state messages

## Usage

### Adding New Storage Locations

1. **Backend**: Add new enum value to `UploadLocation` in FileManagement.kt
```kotlin
enum class UploadLocation(val path: String, val allowedContentTypes: List<ContentType>) {
    TEMPLATE_COVER("public/templateCover", listOf(ContentType.JPEG, ContentType.PNG, ContentType.WEBP)),
    CERTIFICATES("public/certificates", listOf(ContentType.PDF, ContentType.JPEG, ContentType.PNG))
}
```

2. **Frontend**: Update the location definitions in `storage.location.ts`
```typescript
export const UPLOAD_LOCATIONS: Record<Graphql.UploadLocation, LocationInfo> = {
    TEMPLATE_COVER: {
        key: "TEMPLATE_COVER",
        label: "Template Covers",
        description: "Cover images for certificate templates",
        path: "public/templateCover",
        allowedContentTypes: ["JPEG", "PNG", "WEBP"],
        icon: "Image",
    },
    CERTIFICATES: {
        key: "CERTIFICATES", 
        label: "Certificates",
        description: "Generated certificate files",
        path: "public/certificates",
        allowedContentTypes: ["PDF", "JPEG", "PNG"],
        icon: "Description",
    },
};
```

3. **Regenerate Types**: Run the GraphQL code generation to update TypeScript types

### Navigation Flow

1. **Root Level**: Shows predefined locations as clickable cards
2. **Location Level**: Shows files/folders within the selected location
3. **Subfolder Level**: Standard file management with upload capability

### Upload Behavior

- **At Root**: No upload button (user must select a location)
- **In Valid Location**: Upload button enabled with file type restrictions
- **In Invalid Path**: Upload button disabled with helpful tooltip

## File Structure

```
contexts/storage/
├── index.ts                    # Main exports
├── storage.type.ts            # TypeScript type definitions
├── storage.constant.ts        # Constants and mappings
├── storage.util.ts           # Utility functions
├── storage.location.ts       # Location definitions and helpers
├── useStorageLocation.ts     # Location-aware hook
├── StorageManagementContext.tsx    # Main storage context
└── StorageGraphQLContext.tsx      # GraphQL operations context

views/storage/
├── StorageManagementPage.tsx      # Main page component
└── components/
    ├── LocationGrid.tsx           # Root location selector
    ├── UploadLocationInfo.tsx     # Current location info
    ├── StorageToolbar.tsx         # Upload and filter controls
    ├── StorageBreadcrumbs.tsx     # Navigation breadcrumbs
    ├── EmptyState.tsx            # Empty state with context
    └── ... (other components)
```

## Key Concepts

### Path Handling
- **Display Path**: What users see (e.g., `templateCover`)
- **Storage Path**: Backend path (e.g., `public/templateCover`)
- **Translation**: Automatic conversion between the two

### Location Validation
- Upload location determined by current path
- File types validated against location rules
- Smart error messages for invalid operations

### State Management
- Centralized storage state in React Context
- Location-aware utilities via custom hook
- GraphQL integration with proper error handling

## Security & Validation

- All uploads restricted to predefined locations
- File type validation on both frontend and backend
- Path traversal protection through location enum
- Content type inference and validation

This architecture ensures a secure, scalable, and user-friendly file management system that grows with your application's needs.
