package schema.mutation

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.server.operations.Mutation
import services.StorageService
import schema.model.*
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

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
}
