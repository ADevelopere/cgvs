package schema.scalars

import com.google.i18n.phonenumbers.PhoneNumberUtil
import com.google.i18n.phonenumbers.NumberParseException
import com.google.i18n.phonenumbers.Phonenumber
import graphql.GraphQLContext
import graphql.execution.CoercedVariables
import graphql.language.StringValue
import graphql.language.Value
import graphql.schema.Coercing
import graphql.schema.CoercingParseLiteralException
import graphql.schema.CoercingParseValueException
import graphql.schema.CoercingSerializeException
import graphql.schema.GraphQLScalarType
import java.util.Locale
import schema.type.PhoneNumber

val graphqlPhoneNumberType: GraphQLScalarType = GraphQLScalarType.newScalar()
    .name("PhoneNumber")
    .description("A type representing a validated phone number")
    .coercing(PhoneNumberCoercing)
    .build()

object PhoneNumberCoercing : Coercing<PhoneNumber, String> {
    private val phoneNumberUtil: PhoneNumberUtil = PhoneNumberUtil.getInstance()

    override fun parseValue(input: Any, graphQLContext: GraphQLContext, locale: Locale): PhoneNumber = runCatching {
        when (input) {
            is String -> PhoneNumber(validatePhoneNumber(input))
            else -> throw CoercingParseValueException("Expected a String but was ${input::class}")
        }
    }.getOrElse {
        throw CoercingParseValueException("Invalid phone number: $input: ${it.message}")
    }

    override fun parseLiteral(input: Value<*>, variables: CoercedVariables, graphQLContext: GraphQLContext, locale: Locale): PhoneNumber {
        val phoneNumberString = (input as? StringValue)?.value
        if (phoneNumberString == null) {
            throw CoercingParseLiteralException("Expected a non-null StringValue for PhoneNumber literal")
        }
        return runCatching {
            PhoneNumber(validatePhoneNumber(phoneNumberString))
        }.getOrElse {
            throw CoercingParseLiteralException("Invalid phone number literal: $phoneNumberString: ${it.message}")
        }
    }

    override fun serialize(dataFetcherResult: Any, graphQLContext: GraphQLContext, locale: Locale): String = runCatching {
        when (dataFetcherResult) {
            is PhoneNumber -> dataFetcherResult.number
            else -> throw CoercingSerializeException("Data fetcher result $dataFetcherResult cannot be serialized to a valid phone number")
        }
    }.getOrElse {
        throw CoercingSerializeException("Invalid phone number serialization: $dataFetcherResult: ${it.message}")
    }

    private fun validatePhoneNumber(phoneNumber: String): Phonenumber.PhoneNumber {
        return try {
            val number = phoneNumberUtil.parse(phoneNumber, null)
            if (phoneNumberUtil.isValidNumber(number)) {
                number
            } else {
                throw IllegalArgumentException("Invalid phone number")
            }
        } catch (e: NumberParseException) {
            throw IllegalArgumentException("Invalid phone number format: ${e.message}")
        }
    }
}
