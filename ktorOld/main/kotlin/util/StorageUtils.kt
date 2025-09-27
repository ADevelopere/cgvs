package util

import schema.model.*

/**
 * Utility functions for storage validation and operations
 */

const val MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
//val PATH_PATTERN = Regex("^[a-zA-Z0-9._/-]+$")
val PATH_PATTERN = Regex("^[a-zA-Z0-9._/\\- ()]+$")

/**
 * Validates a file path for security and format compliance
 * @param path The file path to validate
 * @return Error message if invalid, null if valid
 */
fun validatePath(path: String): String? {
    if (path.contains("..") || path.contains("//")) {
        return "Path contains invalid directory traversal patterns"
    }
    if (!PATH_PATTERN.matches(path)) {
        return "Path contains invalid characters"
    }
    if (path.length > 1024) {
        return "Path is too long (max 1024 characters)"
    }
    return null
}

/**
 * Validates file type against allowed types for a specific upload location
 * @param contentType The content type of the file
 * @param location The upload location with its allowed content types
 * @return Error message if invalid, null if valid
 */
fun validateFileType(contentType: ContentType?, location: UploadLocation): String? {
    if (contentType == null) {
        return "Content type is required"
    }
    if (!location.allowedContentTypes.contains(contentType)) {
        return "File type not allowed for this location: ${contentType.value}"
    }
    return null
}

/**
 * Validates file size against maximum allowed size
 * @param size The file size in bytes
 * @return Error message if invalid, null if valid
 */
fun validateFileSize(size: Long): String? {
    if (size > MAX_FILE_SIZE) {
        return "File size exceeds maximum allowed size (${MAX_FILE_SIZE / 1024 / 1024}MB)"
    }
    return null
}

/**
 * Checks if a file type matches a given filter string
 * @param fileType The file type to check
 * @param filter The filter string (e.g., "image", "document")
 * @return true if the file type matches the filter, false otherwise
 */
fun matchesFileType(fileType: FileType, filter: String): Boolean {
    return when (filter.lowercase()) {
        "image" -> fileType == FileType.IMAGE
        "document" -> fileType == FileType.DOCUMENT
        "video" -> fileType == FileType.VIDEO
        "audio" -> fileType == FileType.AUDIO
        "archive" -> fileType == FileType.ARCHIVE
        else -> true
    }
}

/**
 * Determines the file type based on content type
 * @param contentType The content type of the file
 * @return The corresponding FileType enum value
 */
fun determineFileType(contentType: ContentType?): FileType {
    return when (contentType) {
        ContentType.JPEG, ContentType.PNG, ContentType.GIF, ContentType.SVG, ContentType.WEBP -> FileType.IMAGE
        ContentType.PDF, ContentType.TEXT, ContentType.JSON -> FileType.DOCUMENT
        else -> FileType.OTHER
    }
}
