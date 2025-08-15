package hooks

import com.expediagroup.graphql.generator.directives.KotlinDirectiveWiringFactory
import com.expediagroup.graphql.generator.directives.KotlinSchemaDirectiveWiring
import com.expediagroup.graphql.generator.hooks.SchemaGeneratorHooks
import graphql.schema.GraphQLType
import kotlinx.datetime.LocalDateTime
import org.koin.core.Koin
import org.koin.core.component.KoinComponent
import scalars.graphqlLocalDateTimeType
import schema.directive.PaginateDirectiveWiring
import kotlin.reflect.KClass
import kotlin.reflect.KFunction
import kotlin.reflect.KProperty
import kotlin.reflect.KType

val customSchemaGeneratorHooks = object : SchemaGeneratorHooks {
    override fun willGenerateGraphQLType(type: KType): GraphQLType? = when (type.classifier as? KClass<*>) {
        LocalDateTime::class -> graphqlLocalDateTimeType
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
    val customWiringFactory = KotlinDirectiveWiringFactory(
        manualWiring = mapOf<String, KotlinSchemaDirectiveWiring>("paginate" to PaginateDirectiveWiring()))

    override val wiringFactory: KotlinDirectiveWiringFactory
        get() = customWiringFactory
}
