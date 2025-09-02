package schema.mutation

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.server.operations.Mutation
import services.StorageService
import schema.model.*
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import kotlinx.datetime.Clock
import kotlinx.datetime.TimeZone
import kotlinx.datetime.toLocalDateTime

@Suppress("unused")
class StorageMutation : Mutation, KoinComponent {
    private val storageService: StorageService by inject()

    @GraphQLDescription("Rename a file")
    fun renameFile(
        input: RenameFileInput
    ): FileOperationResult {
        return storageService.renameFile(input)
    }

    @GraphQLDescription("Delete a single file")
    fun deleteFile(
        path: String
    ): FileOperationResult {
        return storageService.deleteFile(path)
    }

    @GraphQLDescription("Generate a signed URL for file upload")
    fun generateUploadSignedUrl(
        input: GenerateUploadSignedUrlInput
    ): String {
        val path = "${input.location.path}/${input.fileName}"
        return storageService.generateUploadSignedUrl(path, input.contentType)
    }

    @GraphQLDescription("Create a new folder")
    fun createFolder(
        input: CreateFolderInput
    ): FileOperationResult {
        return storageService.createFolder(input)
    }

    @GraphQLDescription("Move multiple files/folders to a new location")
    suspend fun moveItems(
        input: MoveItemsInput
    ): BulkOperationResult {
        return storageService.moveItems(input)
    }

    @GraphQLDescription("Copy multiple files/folders to a new location")
    suspend fun copyItems(
        input: CopyItemsInput
    ): BulkOperationResult {
        return storageService.copyItems(input)
    }

    @GraphQLDescription("Delete multiple files/folders")
    suspend fun deleteItems(
        input: DeleteItemsInput
    ): BulkOperationResult {
        return storageService.deleteItems(input)
    }

    @GraphQLDescription("Update directory permissions")
    suspend fun updateDirectoryPermissions(
        input: UpdateDirectoryPermissionsInput
    ): FileOperationResult {
        return storageService.updateDirectoryPermissions(input)
    }

    @GraphQLDescription("Set protection for files or directories")
    suspend fun setProtection(
        input: SetProtectionInput
    ): FileOperationResult {
        return storageService.setProtection(input)
    }

    @GraphQLDescription("Register file usage to track dependencies")
    suspend fun registerFileUsage(
        input: RegisterFileUsageInput
    ): FileOperationResult {
        return try {
            val storageRepository = org.koin.core.context.GlobalContext.get().get<repositories.StorageRepository>()
            val usage = FileUsage(
                filePath = input.filePath,
                usageType = input.usageType,
                referenceId = input.referenceId,
                referenceTable = input.referenceTable,
                created = Clock.System.now().toLocalDateTime(TimeZone.currentSystemDefault())
            )
            storageRepository.registerFileUsage(usage)
            FileOperationResult(true, "File usage registered successfully", null)
        } catch (e: Exception) {
            FileOperationResult(false, "Failed to register file usage: ${e.message}", null)
        }
    }

    @GraphQLDescription("Unregister file usage to remove dependencies")
    suspend fun unregisterFileUsage(
        input: UnregisterFileUsageInput
    ): FileOperationResult {
        return try {
            val storageRepository = org.koin.core.context.GlobalContext.get().get<repositories.StorageRepository>()
            val removed = storageRepository.unregisterFileUsage(input.filePath, input.usageType, input.referenceId)
            if (removed) {
                FileOperationResult(true, "File usage unregistered successfully", null)
            } else {
                FileOperationResult(false, "File usage not found", null)
            }
        } catch (e: Exception) {
            FileOperationResult(false, "Failed to unregister file usage: ${e.message}", null)
        }
    }
}
