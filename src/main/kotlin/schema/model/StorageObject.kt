package schema.model

import java.net.URL

interface StorageObject {
    val name: String
    val path: String
}

data class File(
    override val name: String,
    override val path: String,
    val size: Long,
    val contentType: String?,
    val updated: String,
    val url: URL
) : StorageObject
