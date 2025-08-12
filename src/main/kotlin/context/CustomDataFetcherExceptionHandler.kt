package context

import graphql.execution.DataFetcherExceptionHandler
import graphql.execution.DataFetcherExceptionHandlerParameters
import graphql.execution.DataFetcherExceptionHandlerResult
import java.util.concurrent.CompletableFuture

class CustomDataFetcherExceptionHandler : DataFetcherExceptionHandler {
    override fun handleException(handlerParameters: DataFetcherExceptionHandlerParameters): CompletableFuture<DataFetcherExceptionHandlerResult> {
        val exception = handlerParameters.exception
        val sourceLocation = handlerParameters.sourceLocation
        val path = handlerParameters.path

        val error = when (exception) {
            is AuthenticationException -> {
                graphql.GraphqlErrorBuilder.newError()
                    .message(exception.message ?: "Authentication required")
                    .location(sourceLocation)
                    .path(path.toList())
                    .extensions(mapOf("code" to "UNAUTHENTICATED"))
                    .build()
            }
            is AuthorizationException -> {
                graphql.GraphqlErrorBuilder.newError()
                    .message(exception.message ?: "Access denied")
                    .location(sourceLocation)
                    .path(path.toList())
                    .extensions(mapOf("code" to "UNAUTHORIZED"))
                    .build()
            }
            else -> {
                graphql.GraphqlErrorBuilder.newError()
                    .message("Internal server error")
                    .location(sourceLocation)
                    .path(path.toList())
                    .extensions(mapOf("code" to "INTERNAL_ERROR"))
                    .build()
            }
        }

        return CompletableFuture.completedFuture(
            DataFetcherExceptionHandlerResult.newResult()
                .error(error)
                .build()
        )
    }
}
