package hooks

import com.expediagroup.graphql.generator.hooks.SchemaGeneratorHooks
import graphql.schema.GraphQLType
import kotlinx.datetime.LocalDate
import kotlinx.datetime.LocalDateTime
import org.koin.core.Koin
import org.koin.core.component.KoinComponent
import schema.scalars.graphqlLocalDateTimeType
import schema.scalars.graphqlLocalDateType
import schema.scalars.graphqlEmailType
import schema.scalars.graphqlPhoneNumberType
import schema.model.Email
import schema.model.PhoneNumber
import kotlin.reflect.KClass
import kotlin.reflect.KFunction
import kotlin.reflect.KProperty
import kotlin.reflect.KType

val customSchemaGeneratorHooks = object : SchemaGeneratorHooks {
    override fun willGenerateGraphQLType(type: KType): GraphQLType? = when (type.classifier as? KClass<*>) {
        LocalDateTime::class -> graphqlLocalDateTimeType
        LocalDate::class -> graphqlLocalDateType
        PhoneNumber::class -> graphqlPhoneNumberType
        Email::class -> graphqlEmailType
        Koin::class -> null  // Explicitly exclude Koin type
        KoinComponent::class -> null  // Explicitly exclude KoinComponent type
        else -> null
    }

    override fun isValidProperty(kClass: KClass<*>, property: KProperty<*>): Boolean {
        return when {
            // Exclude Koin-related properties
            property.name == "koin" -> false
            property.returnType.classifier == Koin::class -> false
            property.returnType.classifier?.toString()?.contains("org.koin") == true -> false
            else -> super.isValidProperty(kClass, property)
        }
    }

    override fun isValidSuperclass(kClass: KClass<*>): Boolean {
        return when {
            // Exclude KoinComponent interface from GraphQL schema
            kClass == KoinComponent::class -> false
            else -> super.isValidSuperclass(kClass)
        }
    }


    override fun isValidFunction(kClass: KClass<*>, function: KFunction<*>): Boolean {
        return when {
            // Exclude Koin-related functions
            function.name == "getKoin" -> false
            function.returnType.classifier == Koin::class -> false
            function.returnType.classifier?.toString()?.contains("org.koin") == true -> false
            else -> super.isValidFunction(kClass, function)
        }
    }
}
