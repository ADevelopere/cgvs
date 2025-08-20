package schema.query

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.server.operations.Query
import services.StorageService
import schema.model.*
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

@Suppress("unused")
class StorageQuery : Query, KoinComponent {
    private val storageService: StorageService by inject()

    @GraphQLDescription("List files and folders with pagination and filtering")
    fun listFiles(
        input: ListFilesInput
    ): StorageObjectList {
        return storageService.listFiles(input)
    }

    fun getFileInfo(
        path: String
    ): FileInfo? {
        return storageService.getFileInfoByPath(path)
    }

    fun getFolderInfo(
        path: String
    ): FolderInfo? {
        return storageService.getFolderInfoByPath(path)
    }

    fun searchFiles(
        searchTerm: String,
        @GraphQLDescription("File type filter (optional)")
        fileType: String? = null,
        @GraphQLDescription("Folder to search in (optional, searches entire bucket if not specified)")
        folder: String? = null,
        @GraphQLDescription("Maximum number of results")
        limit: Int = 50
    ): StorageObjectList {
        val input = ListFilesInput(
            path = folder ?: "",
            limit = limit,
            searchTerm = searchTerm,
            fileType = fileType
        )
        return storageService.listFiles(input)
    }

    @GraphQLDescription("Get storage statistics")
    fun getStorageStats(
        @GraphQLDescription("Folder path to get stats for (optional, gets stats for entire bucket if not specified)")
        path: String? = null
    ): StorageStats {
        return storageService.getStorageStatistics(path)
    }
}
