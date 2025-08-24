package repositories.utils

import org.jetbrains.exposed.v1.core.Expression
import org.jetbrains.exposed.v1.core.Op
import org.jetbrains.exposed.v1.jdbc.QueryBuilder

// Represents a full-text search query in PostgreSQL
class TsQuery(val text: String, val config: String = "simple") : Expression<String>() {
    override fun toQueryBuilder(queryBuilder: QueryBuilder) = queryBuilder {
        // Use plainto_tsquery to safely handle user input
        append("plainto_tsquery('", config, "', '", text.replace("'", "''"), "')")
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