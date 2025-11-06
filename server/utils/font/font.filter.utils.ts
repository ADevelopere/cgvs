import { PgSelect } from "drizzle-orm/pg-core";
import { font } from "@/server/db/schema/font";
import { and, eq, ilike, gte, lte, gt, lt, ne, asc, desc, sql } from "drizzle-orm";
import { FontFilterArgs, FontsOrderByClause, FontsOrderByColumn } from "@/server/types/font.types";
import { OrderSortDirection } from "@/lib/enum";

export namespace FontFilterUtils {
  export const applyFilters = <T extends PgSelect>(query: T, filters?: FontFilterArgs | null): T => {
    if (!filters) return query;

    const conditions = [];

    // Name filters
    if (filters.name) {
      conditions.push(ilike(font.name, `%${filters.name}%`));
    }
    if (filters.nameNotContains) {
      conditions.push(ilike(font.name, `%${filters.nameNotContains}%`));
    }
    if (filters.nameEquals) {
      conditions.push(eq(font.name, filters.nameEquals));
    }
    if (filters.nameNotEquals) {
      conditions.push(ne(font.name, filters.nameNotEquals));
    }
    if (filters.nameStartsWith) {
      conditions.push(ilike(font.name, `${filters.nameStartsWith}%`));
    }
    if (filters.nameEndsWith) {
      conditions.push(ilike(font.name, `%${filters.nameEndsWith}`));
    }
    if (filters.nameIsEmpty) {
      conditions.push(eq(font.name, ""));
    }
    if (filters.nameIsNotEmpty) {
      conditions.push(ne(font.name, ""));
    }

    // Locale filter - check if JSONB array contains the locale
    if (filters.locale) {
      conditions.push(sql`${font.locale}::jsonb ? ${filters.locale}`);
    }

    // CreatedAt filters
    if (filters.createdAt) {
      conditions.push(eq(font.createdAt, filters.createdAt));
    }
    if (filters.createdAtFrom && filters.createdAtTo) {
      conditions.push(and(gte(font.createdAt, filters.createdAtFrom), lte(font.createdAt, filters.createdAtTo)));
    } else if (filters.createdAtFrom) {
      conditions.push(gte(font.createdAt, filters.createdAtFrom));
    } else if (filters.createdAtTo) {
      conditions.push(lte(font.createdAt, filters.createdAtTo));
    }
    if (filters.createdAtAfter) {
      conditions.push(gt(font.createdAt, filters.createdAtAfter));
    }
    if (filters.createdAtBefore) {
      conditions.push(lt(font.createdAt, filters.createdAtBefore));
    }

    // UpdatedAt filters
    if (filters.updatedAt) {
      conditions.push(eq(font.updatedAt, filters.updatedAt));
    }
    if (filters.updatedAtFrom && filters.updatedAtTo) {
      conditions.push(and(gte(font.updatedAt, filters.updatedAtFrom), lte(font.updatedAt, filters.updatedAtTo)));
    } else if (filters.updatedAtFrom) {
      conditions.push(gte(font.updatedAt, filters.updatedAtFrom));
    } else if (filters.updatedAtTo) {
      conditions.push(lte(font.updatedAt, filters.updatedAtTo));
    }

    return conditions.length > 0 ? query.where(and(...conditions)) : query;
  };

  export const applyOrdering = <T extends PgSelect>(query: T, orderBy?: FontsOrderByClause[] | null): T => {
    if (!orderBy || orderBy.length === 0) {
      return query.orderBy(asc(font.name));
    }

    const orderClauses = orderBy.map(clause => {
      const direction = clause.order === OrderSortDirection.DESC ? desc : asc;

      switch (clause.column) {
        case FontsOrderByColumn.ID:
          return direction(font.id);
        case FontsOrderByColumn.NAME:
          return direction(font.name);
        case FontsOrderByColumn.CREATED_AT:
          return direction(font.createdAt);
        case FontsOrderByColumn.UPDATED_AT:
          return direction(font.updatedAt);
        default:
          return asc(font.name);
      }
    });

    return query.orderBy(...orderClauses);
  };
}
