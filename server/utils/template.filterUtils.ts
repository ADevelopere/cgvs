import * as Types from "@/server/types";
import { OrderSortDirection } from "@/lib/enum";
import { templates } from "@/server/db/schema";
import { asc, desc } from "drizzle-orm";
import { PgSelect } from "drizzle-orm/pg-core";
import { fullTextSearch } from "@/server/db/query.extentions";

export namespace TemplateFilterUtils {
  export function applyFilters<T extends PgSelect>(
    qb: T,
    args?: Types.TemplateFilterArgs | null,
  ) {
    if (!args) return qb;
    const ftsLang = "simple"; // Use "simple" for language-agnostic

    // Name filter (full-text search)
    if (args.name) {
      const ftsCondition = fullTextSearch(templates.name, args.name, ftsLang);
      if (ftsCondition) {
        qb = qb.where(ftsCondition);
      }
    }

    return qb;
  }

  export function applyOrdering<T extends PgSelect>(
    qb: T,
    orderBy?: Types.TemplatesOrderByClause[] | null,
  ) {
    if (!orderBy || orderBy.length === 0) return qb;

    orderBy.forEach((clause) => {
      let column;
      switch (clause.column) {
        case Types.TemplatesOrderByColumn.NAME:
          column = templates.name;
          break;
        case Types.TemplatesOrderByColumn.ORDER:
          column = templates.order;
          break;
        case Types.TemplatesOrderByColumn.CREATED_AT:
          column = templates.createdAt;
          break;
        case Types.TemplatesOrderByColumn.UPDATED_AT:
          column = templates.updatedAt;
          break;
        default:
          return;
      }
      qb = qb.orderBy(
        clause.order === OrderSortDirection.ASC ? asc(column) : desc(column),
      );
    });
    return qb;
  }
}
