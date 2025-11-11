import { PgSelect } from "drizzle-orm/pg-core";
import { fontVariant } from "@/server/db/schema/font";
import { and, eq, ilike, gte, lte, asc, desc } from "drizzle-orm";
import { FontVariantFilterArgs, FontVariantsOrderByClause, FontVariantsOrderByColumn } from "@/server/types/font.types";
import { OrderSortDirection } from "@/lib/enum";

export namespace FontFilterUtils {
  export const applyFilters = <T extends PgSelect>(query: T, filters?: FontVariantFilterArgs | null): T => {
    if (!filters) return query;

    const conditions = [];

    // Family ID filter
    if (filters.familyId) {
      conditions.push(eq(fontVariant.familyId, filters.familyId));
    }

    // Variant filters
    if (filters.variant) {
      conditions.push(eq(fontVariant.variant, filters.variant));
    }
    if (filters.variantContains) {
      conditions.push(ilike(fontVariant.variant, `%${filters.variantContains}%`));
    }

    // CreatedAt filters
    if (filters.createdAtFrom && filters.createdAtTo) {
      conditions.push(
        and(gte(fontVariant.createdAt, filters.createdAtFrom), lte(fontVariant.createdAt, filters.createdAtTo))
      );
    } else if (filters.createdAtFrom) {
      conditions.push(gte(fontVariant.createdAt, filters.createdAtFrom));
    } else if (filters.createdAtTo) {
      conditions.push(lte(fontVariant.createdAt, filters.createdAtTo));
    }

    return conditions.length > 0 ? query.where(and(...conditions)) : query;
  };

  export const applyOrdering = <T extends PgSelect>(query: T, orderBy?: FontVariantsOrderByClause[] | null): T => {
    if (!orderBy || orderBy.length === 0) {
      return query.orderBy(asc(fontVariant.variant));
    }

    const orderClauses = orderBy.map(clause => {
      const direction = clause.order === OrderSortDirection.DESC ? desc : asc;

      switch (clause.column) {
        case FontVariantsOrderByColumn.ID:
          return direction(fontVariant.id);
        case FontVariantsOrderByColumn.VARIANT:
          return direction(fontVariant.variant);
        case FontVariantsOrderByColumn.CREATED_AT:
          return direction(fontVariant.createdAt);
        case FontVariantsOrderByColumn.UPDATED_AT:
          return direction(fontVariant.updatedAt);
        default:
          return asc(fontVariant.variant);
      }
    });

    return query.orderBy(...orderClauses);
  };
}
