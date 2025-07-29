package scalars

import graphql.GraphQLContext
import graphql.execution.CoercedVariables
import graphql.language.StringValue
import graphql.language.Value
import graphql.schema.Coercing
import graphql.schema.CoercingParseLiteralException
import graphql.schema.CoercingParseValueException
import graphql.schema.CoercingSerializeException
import graphql.schema.GraphQLScalarType
import kotlinx.datetime.LocalDateTime
import java.util.Locale

val graphqlLocalDateTimeType: GraphQLScalarType = GraphQLScalarType.newScalar()
    .name("LocalDateTime")
    .description("A type representing a formatted kotlinx.datetime.LocalDateTime")
    .coercing(LocalDateTimeCoercing)
    .build()

object LocalDateTimeCoercing : Coercing<LocalDateTime, String> {
    override fun parseValue(input: Any, graphQLContext: GraphQLContext, locale: Locale): LocalDateTime = runCatching {
        when (input) {
            is String -> LocalDateTime.parse(input)
            is LocalDateTime -> input
            else -> throw CoercingParseValueException("Expected LocalDateTime or String but was ${input::class}")
        }
    }.getOrElse {
        throw CoercingParseValueException("Expected valid LocalDateTime but was $input: ${it.message}")
    }

    override fun parseLiteral(input: Value<*>, variables: CoercedVariables, graphQLContext: GraphQLContext, locale: Locale): LocalDateTime {
        val dateTimeString = (input as? StringValue)?.value
        if (dateTimeString == null) {
            throw CoercingParseLiteralException("Expected a non-null StringValue for LocalDateTime literal")
        }
        return runCatching {
            LocalDateTime.parse(dateTimeString)
        }.getOrElse {
            throw CoercingParseLiteralException("Expected valid LocalDateTime literal but was $dateTimeString: ${it.message}")
        }
    }

    override fun serialize(dataFetcherResult: Any, graphQLContext: GraphQLContext, locale: Locale): String = runCatching {
        when (dataFetcherResult) {
            is LocalDateTime -> dataFetcherResult.toString()
            is String -> dataFetcherResult
            else -> throw CoercingSerializeException("Data fetcher result $dataFetcherResult cannot be serialized to a String")
        }
    }.getOrElse {
        throw CoercingSerializeException("Data fetcher result $dataFetcherResult cannot be serialized to a String: ${it.message}")
    }
}
