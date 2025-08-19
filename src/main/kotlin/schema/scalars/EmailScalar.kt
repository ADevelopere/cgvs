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
import schema.model.Email
import java.util.Locale

val graphqlEmailType: GraphQLScalarType = GraphQLScalarType.newScalar()
    .name("Email")
    .description("A type representing a validated email address")
    .coercing(EmailCoercing)
    .build()

object EmailCoercing : Coercing<Email, String> {
    override fun parseValue(input: Any, graphQLContext: GraphQLContext, locale: Locale): Email = runCatching {
        when (input) {
            is String -> Email(input)
            else -> throw CoercingParseValueException("Expected a String but was ${input::class}")
        }
    }.getOrElse {
        throw CoercingParseValueException("Invalid email address: $input: ${it.message}")
    }

    override fun parseLiteral(input: Value<*>, variables: CoercedVariables, graphQLContext: GraphQLContext, locale: Locale): Email {
        val emailString = (input as? StringValue)?.value
        if (emailString == null) {
            throw CoercingParseLiteralException("Expected a non-null StringValue for Email literal")
        }
        return runCatching {
            Email(emailString)
        }.getOrElse {
            throw CoercingParseLiteralException("Invalid email address literal: $emailString: ${it.message}")
        }
    }

    override fun serialize(dataFetcherResult: Any, graphQLContext: GraphQLContext, locale: Locale): String = runCatching {
        when (dataFetcherResult) {
            is Email -> dataFetcherResult.value
            else -> throw CoercingSerializeException("Data fetcher result $dataFetcherResult cannot be serialized to a valid email address")
        }
    }.getOrElse {
        throw CoercingSerializeException("Invalid email address serialization: $dataFetcherResult: ${it.message}")
    }
}

