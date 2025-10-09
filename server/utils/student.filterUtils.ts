import * as Types from "@/server/types";
import { OrderSortDirection } from "@/lib/enum";
import { students } from "@/server/db/schema";
import {
    eq,
    notLike,
    like,
    not,
    or,
    isNull,
    gt,
    gte,
    lt,
    lte,
    asc,
    desc,
} from "drizzle-orm";
import { PgSelect } from "drizzle-orm/pg-core";
import { fullTextSearch } from "@/server/db/query.extentions";

export namespace StudentFilterUtils {
    export function applyFilters<T extends PgSelect>(
        qb: T,
        args?: Types.StudentFilterArgs | null,
    ) {
        if (!args) return qb;
        const ftsLang = "simple"; // Use "simple" for language-agnostic, or "english", "arabic" etc.

        // Name filters
        if (args.name) {
            const ftsCondition = fullTextSearch(
                students.name,
                args.name,
                ftsLang,
            );
            if (ftsCondition) {
                qb = qb.where(ftsCondition);
            }
        }
        if (args.nameNotContains) {
            qb = qb.where(notLike(students.name, `%${args.nameNotContains}%`));
        }
        if (args.nameEquals) {
            qb = qb.where(eq(students.name, args.nameEquals));
        }
        if (args.nameNotEquals) {
            qb = qb.where(not(eq(students.name, args.nameNotEquals)));
        }
        if (args.nameStartsWith) {
            qb = qb.where(like(students.name, `${args.nameStartsWith}%`));
        }
        if (args.nameEndsWith) {
            qb = qb.where(like(students.name, `%${args.nameEndsWith}`));
        }
        if (args.nameIsEmpty) {
            qb = qb.where(eq(students.name, ""));
        }
        if (args.nameIsNotEmpty) {
            qb = qb.where(not(eq(students.name, "")));
        }

        // Email filters (contains)
        if (args.email) {
            qb = qb.where(like(students.email, `%${args.email}%`));
        }
        if (args.emailNotContains) {
            qb = qb.where(
                notLike(students.email, `%${args.emailNotContains}%`),
            );
        }
        if (args.emailEquals?.value) {
            qb = qb.where(eq(students.email, args.emailEquals.value));
        }
        if (args.emailNotEquals) {
            qb = qb.where(not(eq(students.email, args.emailNotEquals)));
        }
        if (args.emailStartsWith) {
            qb = qb.where(like(students.email, `${args.emailStartsWith}%`));
        }
        if (args.emailEndsWith) {
            qb = qb.where(like(students.email, `%${args.emailEndsWith}`));
        }
        if (args.emailIsEmpty) {
            qb = qb.where(or(eq(students.email, ""), isNull(students.email)));
        }
        if (args.emailIsNotEmpty) {
            qb = qb.where(not(isNull(students.email)));
        }

        // Phone number filter (contains)
        if (args.phoneNumber?.number) {
            qb = qb.where(
                like(students.phoneNumber, `%${args.phoneNumber.number}%`),
            );
        }

        // Gender filter
        if (args.gender) {
            qb = qb.where(eq(students.gender, args.gender));
        }

        // Nationality filter
        if (args.nationality) {
            qb = qb.where(eq(students.nationality, args.nationality));
        }

        // Created at filters
        if (args.createdAt) {
            qb = qb.where(eq(students.createdAt, args.createdAt));
        }
        if (args.createdAtNot) {
            qb = qb.where(not(eq(students.createdAt, args.createdAtNot)));
        }
        if (args.createdAtFrom) {
            qb = qb.where(gte(students.createdAt, args.createdAtFrom));
        }
        if (args.createdAtTo) {
            qb = qb.where(lte(students.createdAt, args.createdAtTo));
        }
        if (args.createdAtAfter) {
            qb = qb.where(gt(students.createdAt, args.createdAtAfter));
        }
        if (args.createdAtBefore) {
            qb = qb.where(lt(students.createdAt, args.createdAtBefore));
        }
        if (args.createdAtOnOrAfter) {
            qb = qb.where(gte(students.createdAt, args.createdAtOnOrAfter));
        }
        if (args.createdAtOnOrBefore) {
            qb = qb.where(lte(students.createdAt, args.createdAtOnOrBefore));
        }
        if (args.createdAtIsEmpty) {
            qb = qb.where(isNull(students.createdAt));
        }
        if (args.createdAtIsNotEmpty) {
            qb = qb.where(not(isNull(students.createdAt)));
        }

        // Birthdate filters (dateOfBirth is Date)
        if (args.birthDate) {
            qb = qb.where(eq(students.dateOfBirth, args.birthDate));
        }
        if (args.birthDateNot) {
            qb = qb.where(not(eq(students.dateOfBirth, args.birthDateNot)));
        }
        if (args.birthDateFrom) {
            qb = qb.where(gte(students.dateOfBirth, args.birthDateFrom));
        }
        if (args.birthDateTo) {
            qb = qb.where(lte(students.dateOfBirth, args.birthDateTo));
        }
        if (args.birthDateAfter) {
            qb = qb.where(gt(students.dateOfBirth, args.birthDateAfter));
        }
        if (args.birthDateBefore) {
            qb = qb.where(lt(students.dateOfBirth, args.birthDateBefore));
        }
        if (args.birthDateOnOrAfter) {
            qb = qb.where(gte(students.dateOfBirth, args.birthDateOnOrAfter));
        }
        if (args.birthDateOnOrBefore) {
            qb = qb.where(lte(students.dateOfBirth, args.birthDateOnOrBefore));
        }
        if (args.birthDateIsEmpty) {
            qb = qb.where(isNull(students.dateOfBirth));
        }
        if (args.birthDateIsNotEmpty) {
            qb = qb.where(not(isNull(students.dateOfBirth)));
        }

        return qb;
    }

    export function applyOrdering<T extends PgSelect>(
        qb: T,
        orderBy?: Types.StudentsOrderByClause[] | null,
    ) {
        if (!orderBy || orderBy.length === 0) return qb;

        orderBy.forEach((clause) => {
            let column;
            switch (clause.column) {
                case Types.StudentsOrderByColumn.ID:
                    column = students.id;
                    break;
                case Types.StudentsOrderByColumn.NAME:
                    column = students.name;
                    break;
                case Types.StudentsOrderByColumn.EMAIL:
                    column = students.email;
                    break;
                case Types.StudentsOrderByColumn.DATE_OF_BIRTH:
                    column = students.dateOfBirth;
                    break;
                case Types.StudentsOrderByColumn.GENDER:
                    column = students.gender;
                    break;
                case Types.StudentsOrderByColumn.CREATED_AT:
                    column = students.createdAt;
                    break;
                case Types.StudentsOrderByColumn.UPDATED_AT:
                    column = students.updatedAt;
                    break;
                default:
                    return;
            }
            qb = qb.orderBy(
                clause.order === OrderSortDirection.ASC
                    ? asc(column)
                    : desc(column),
            );
        });
        return qb;
    }
}
