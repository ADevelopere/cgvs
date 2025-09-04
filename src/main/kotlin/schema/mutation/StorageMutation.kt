package schema.mutation

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.server.operations.Mutation
import services.StorageService
import services.StorageDbService
import schema.model.*
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

@Suppress("unused")
class StorageMutation : Mutation, KoinComponent {
    private val storageService: StorageService by inject()
    private val storageDbService: StorageDbService by inject()

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
    suspend fun moveStorageItems(
        input: MoveStorageItemsInput
    ): BulkOperationResult {
        return storageService.moveItems(input)
    }

    @GraphQLDescription("Copy multiple files/folders to a new location")
    suspend fun copyStorageItems(
        input: CopyStorageItemsInput
    ): BulkOperationResult {
        return storageService.copyItems(input)
    }

    @GraphQLDescription("Delete multiple files/folders")
    suspend fun deleteStorageItems(
        input: DeleteItemsInput
    ): BulkOperationResult {
        return storageService.deleteItems(input)
    }

    @GraphQLDescription("Update directory permissions")
    suspend fun updateDirectoryPermissions(
        input: UpdateDirectoryPermissionsInput
    ): FileOperationResult {
        return storageDbService.updateDirectoryPermissions(input)
    }

    @GraphQLDescription("Set protection for files or directories")
    suspend fun setStorageItemProtection(
        input: SetStorageItemProtectionInput
    ): FileOperationResult {
        return storageDbService.setProtection(input)
    }
}
