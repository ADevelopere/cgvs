package schema.type

import kotlinx.serialization.Serializable

@Serializable
data class TemplateConfig(
    val maxBackgroundSize: Int = 10485760, // 10MB in bytes
    val allowedFileTypes: List<String> = listOf("jpg", "jpeg", "png", "pdf")
)

enum class TemplateConfigKey {
    MAX_BACKGROUND_SIZE,
    ALLOWED_FILE_TYPES
}
