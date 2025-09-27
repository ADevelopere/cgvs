package repositories.utils

import org.jetbrains.exposed.v1.core.Expression
import org.jetbrains.exposed.v1.core.Op
import org.jetbrains.exposed.v1.core.QueryBuilder
import org.jetbrains.exposed.v1.core.append

// Represents a full-text search query in PostgreSQL
class TsQuery(val text: String, val config: String = "simple") : Expression<String>() {
    override fun toQueryBuilder(queryBuilder: QueryBuilder) = queryBuilder {
        // For prefix matching (partial words), we need to use to_tsquery
        // and append ':*' to the search terms. plainto_tsquery does not support this.

        // 1. Sanitize and split the search text into words.
        val words = text.trim().split(Regex("\\s+")).filter { it.isNotBlank() }

        // 2. For each word, remove FTS special characters and append the prefix operator.
        val queryParts = words.mapNotNull { word ->
            // Remove characters that have special meaning in tsquery, but keep apostrophes.
            val sanitizedWord = word.replace(Regex("[&|!():]"), "")
            if (sanitizedWord.isNotBlank()) {
                // Append prefix operator for partial matching
                "$sanitizedWord:*"
            } else {
                null
            }
        }

        // 3. Join the parts with the 'AND' operator and escape for SQL.
        val tsQueryString = queryParts.joinToString(" & ")
        append("to_tsquery('", config, "', '", tsQueryString.replace("'", "''"), "')")
    }
}

// Represents a tsvector column or expression
class TsVector(val expression: Expression<*>, val config: String = "simple") : Expression<String>() {
    override fun toQueryBuilder(queryBuilder: QueryBuilder) = queryBuilder {
        append("to_tsvector('", config, "', ", expression, ")")
    }
}

// Custom operator `@@` for matching a tsvector against a tsquery
infix fun Expression<*>.matches(query: TsQuery): Op<Boolean> = TsQueryMatchOp(this, query)

private class TsQueryMatchOp(private val expr1: Expression<*>, private val expr2: Expression<*>) : Op<Boolean>() {
    override fun toQueryBuilder(queryBuilder: QueryBuilder) = queryBuilder {
        append(expr1, " @@ ", expr2)
    }
}
