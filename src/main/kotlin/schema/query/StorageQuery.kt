package schema.query

import com.expediagroup.graphql.server.operations.Query
import features.storage.StorageService
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import java.net.URL

class StorageQuery : Query, KoinComponent {

    private val storageService: StorageService by inject()

    fun getSignedUrlForPath(path: String): URL {
        return storageService.getSignedUrl(path)
    }
}
