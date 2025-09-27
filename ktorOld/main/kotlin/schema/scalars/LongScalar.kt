package schema.scalars

import graphql.GraphQLContext
import graphql.execution.CoercedVariables
import graphql.language.IntValue
import graphql.language.StringValue
import graphql.language.Value
import graphql.schema.Coercing
import graphql.schema.CoercingParseLiteralException
import graphql.schema.CoercingParseValueException
import graphql.schema.CoercingSerializeException
import graphql.schema.GraphQLScalarType
import java.util.Locale

val graphqlLongType: GraphQLScalarType = GraphQLScalarType.newScalar()
    .name("Long")
    .description("A type representing a Kotlin Long value")
    .coercing(LongCoercing)
    .build()

object LongCoercing : Coercing<Long, Long> {
    override fun parseValue(input: Any, graphQLContext: GraphQLContext, locale: Locale): Long = runCatching {
        when (input) {
            is Long -> input
            is Int -> input.toLong()
            is String -> input.toLong()
            else -> throw CoercingParseValueException("Expected Long, Int, or String but was ${input::class}")
        }
    }.getOrElse {
        throw CoercingParseValueException("Expected valid Long but was $input: ${it.message}")
    }

    override fun parseLiteral(input: Value<*>, variables: CoercedVariables, graphQLContext: GraphQLContext, locale: Locale): Long {
        return when (input) {
            is IntValue -> input.value.toLong()
            is StringValue -> input.value.toLongOrNull() ?: throw CoercingParseLiteralException("Invalid Long literal: ${input.value}")
            else -> throw CoercingParseLiteralException("Expected IntValue or StringValue for Long literal")
        }
    }

    override fun serialize(dataFetcherResult: Any, graphQLContext: GraphQLContext, locale: Locale): Long = runCatching {
        when (dataFetcherResult) {
            is Long -> dataFetcherResult
            is Int -> dataFetcherResult.toLong()
            is String -> dataFetcherResult.toLong()
            else -> throw CoercingSerializeException("Data fetcher result $dataFetcherResult cannot be serialized to Long")
        }
    }.getOrElse {
        throw CoercingSerializeException("Data fetcher result $dataFetcherResult cannot be serialized to Long: ${it.message}")
    }
}

