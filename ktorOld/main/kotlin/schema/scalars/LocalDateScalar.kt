package schema.scalars

import graphql.GraphQLContext
import graphql.execution.CoercedVariables
import graphql.language.StringValue
import graphql.language.Value
import graphql.schema.Coercing
import graphql.schema.CoercingParseLiteralException
import graphql.schema.CoercingParseValueException
import graphql.schema.CoercingSerializeException
import graphql.schema.GraphQLScalarType
import kotlinx.datetime.LocalDate
import java.util.Locale

val graphqlLocalDateType: GraphQLScalarType = GraphQLScalarType.newScalar()
    .name("LocalDate")
    .description("A type representing a formatted kotlinx.datetime.LocalDate")
    .coercing(LocalDateCoercing)
    .build()

object LocalDateCoercing : Coercing<LocalDate, String> {
    override fun parseValue(input: Any, graphQLContext: GraphQLContext, locale: Locale): LocalDate = runCatching {
        when (input) {
            is String -> LocalDate.parse(input)
            is LocalDate -> input
            else -> throw CoercingParseValueException("Expected LocalDate or String but was ${input::class}")
        }
    }.getOrElse {
        throw CoercingParseValueException("Expected valid LocalDate but was $input: ${it.message}")
    }

    override fun parseLiteral(input: Value<*>, variables: CoercedVariables, graphQLContext: GraphQLContext, locale: Locale): LocalDate {
        val dateString = (input as? StringValue)?.value
        if (dateString == null) {
            throw CoercingParseLiteralException("Expected a non-null StringValue for LocalDate literal")
        }
        return runCatching {
            LocalDate.parse(dateString)
        }.getOrElse {
            throw CoercingParseLiteralException("Expected valid LocalDate literal but was $dateString: ${it.message}")
        }
    }

    override fun serialize(dataFetcherResult: Any, graphQLContext: GraphQLContext, locale: Locale): String = runCatching {
        when (dataFetcherResult) {
            is LocalDate -> dataFetcherResult.toString()
            is String -> dataFetcherResult
            else -> throw CoercingSerializeException("Data fetcher result $dataFetcherResult cannot be serialized to a String")
        }
    }.getOrElse {
        throw CoercingSerializeException("Data fetcher result $dataFetcherResult cannot be serialized to a String: ${it.message}")
    }
}
