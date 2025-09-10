package repositories.utils

import org.jetbrains.exposed.v1.core.or
import org.jetbrains.exposed.v1.jdbc.Query
import org.jetbrains.exposed.v1.jdbc.andWhere
import schema.model.OrderStudentsByClause
import schema.model.OrderStudentsByColumn
import schema.model.PaginationArgs
import schema.model.SortDirection
import schema.model.StudentFilterArgs
import tables.Students
import kotlin.collections.forEach

/**
 * Applies filtering to a student query based on the provided filter arguments.
 *
 * @param filterArgs The filter arguments to apply.
 * @return The query with the filters applied.
 */
fun Query.applyStudentFilters(filterArgs: StudentFilterArgs?): Query = also {
    filterArgs?.let { args ->
        val ftsLang = "simple" // Use "simple" for language-agnostic, or "english", "arabic" etc.

        // Name filters
        args.name?.let {
            if (it.isNotBlank()) {
                andWhere { TsVector(Students.name, ftsLang) matches TsQuery(it, ftsLang) }
            }
        }
        args.nameNotContains?.let { andWhere { Students.name notLike "%$it%" } }
        args.nameEquals?.let { andWhere { Students.name eq it } }
        args.nameNotEquals?.let { andWhere { Students.name neq it } }
        args.nameStartsWith?.let { andWhere { Students.name like "$it%" } }
        args.nameEndsWith?.let { andWhere { Students.name like "%$it" } }
        args.nameIsEmpty?.let { if (it) andWhere { Students.name eq "" } } // Name is not nullable
        args.nameIsNotEmpty?.let { if (it) andWhere { Students.name neq "" } }

        // Email filters
        args.email?.let {
            if (it.isNotBlank()) {
                andWhere { TsVector(Students.email, ftsLang) matches TsQuery(it, ftsLang) }
            }
        }
        args.emailNotContains?.let { andWhere { Students.email notLike "%$it%" } }
        args.emailEquals?.let { andWhere { Students.email eq it.value } }
        args.emailNotEquals?.let { andWhere { Students.email neq it } }
        args.emailStartsWith?.let { andWhere { Students.email like "$it%" } }
        args.emailEndsWith?.let { andWhere { Students.email like "%$it" } }
        args.emailIsEmpty?.let {
            if (it) andWhere { Students.email.isNull() or (Students.email eq "") }
        }
        args.emailIsNotEmpty?.let { if (it) andWhere { Students.email.isNotNull() } }

        // Phone number filter
        args.phoneNumber?.let { andWhere { Students.phoneNumber eq it.number } }

        // Gender filter
        args.gender?.let { andWhere { Students.gender eq it } }

        // Nationality filter
        args.nationality?.let { andWhere { Students.nationality eq it } }

        // Created at filters
        args.createdAt?.let { andWhere { Students.createdAt eq it } }
        args.createdAtNot?.let { andWhere { Students.createdAt neq it } }
        args.createdAtFrom?.let { andWhere { Students.createdAt greaterEq it } }
        args.createdAtTo?.let { andWhere { Students.createdAt lessEq it } }
        args.createdAtAfter?.let { andWhere { Students.createdAt greater it } }
        args.createdAtBefore?.let { andWhere { Students.createdAt less it } }
        args.createdAtOnOrAfter?.let { andWhere { Students.createdAt greaterEq it } }
        args.createdAtOnOrBefore?.let { andWhere { Students.createdAt lessEq it } }
        args.createdAtIsEmpty?.let { if (it) andWhere { Students.createdAt.isNull() } }
        args.createdAtIsNotEmpty?.let { if (it) andWhere { Students.createdAt.isNotNull() } }

        // Birthdate filters (dateOfBirth is LocalDate, birthDate fields are LocalDateTime)
        args.birthDate?.let { andWhere { Students.dateOfBirth eq it.date } }
        args.birthDateNot?.let { andWhere { Students.dateOfBirth neq it.date } }
        args.birthDateFrom?.let { andWhere { Students.dateOfBirth greaterEq it.date } }
        args.birthDateTo?.let { andWhere { Students.dateOfBirth lessEq it.date } }
        args.birthDateAfter?.let { andWhere { Students.dateOfBirth greater it.date } }
        args.birthDateBefore?.let { andWhere { Students.dateOfBirth less it.date } }
        args.birthDateOnOrAfter?.let { andWhere { Students.dateOfBirth greaterEq it.date } }
        args.birthDateOnOrBefore?.let { andWhere { Students.dateOfBirth lessEq it.date } }
        args.birthDateIsEmpty?.let { if (it) andWhere { Students.dateOfBirth.isNull() } }
        args.birthDateIsNotEmpty?.let { if (it) andWhere { Students.dateOfBirth.isNotNull() } }
    }
}

/**
 * Applies ordering to a student query based on the provided order by clauses.
 *
 * @param orderBy The list of order by clauses.
 * @return The query with ordering applied.
 */
fun Query.applyStudentOrdering(orderBy: List<OrderStudentsByClause>?): Query = also {
    orderBy?.forEach { clause ->
        val sortDirection = when (clause.order) {
            SortDirection.ASC -> org.jetbrains.exposed.v1.core.SortOrder.ASC
            SortDirection.DESC -> org.jetbrains.exposed.v1.core.SortOrder.DESC
        }

        when (clause.column) {
            OrderStudentsByColumn.ID -> orderBy(Students.id, sortDirection)
            OrderStudentsByColumn.NAME -> orderBy(Students.name, sortDirection)
            OrderStudentsByColumn.EMAIL -> orderBy(Students.email, sortDirection)
            OrderStudentsByColumn.DATE_OF_BIRTH -> orderBy(Students.dateOfBirth, sortDirection)

            OrderStudentsByColumn.GENDER -> orderBy(Students.gender, sortDirection)
            OrderStudentsByColumn.CREATED_AT -> orderBy(Students.createdAt, sortDirection)
            OrderStudentsByColumn.UPDATED_AT -> orderBy(Students.updatedAt, sortDirection)
        }
    }
}

fun Query.paginate(args: PaginationArgs): Query = also {
    limit(args.perPage).offset(args.offset.toLong())
}
