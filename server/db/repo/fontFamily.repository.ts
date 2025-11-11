import { db } from "@/server/db/drizzleDb";
import { eq, ilike, sql } from "drizzle-orm";
import { fontFamily, fontVariant } from "@/server/db/schema/font";
import {
  FontFamilySelectType,
  FontFamilyCreateInput,
  FontFamilyUpdateInput,
  FontFamilyUsageCheckResult,
  FontFamiliesWithFiltersResponse,
  FontFamilyFilterArgs,
  FontFamiliesOrderByClause,
} from "@/server/types/font.types";
import * as Types from "@/server/types";
import logger from "@/server/lib/logger";
import { PaginationUtils } from "@/server/utils";
import { queryWithPagination } from "@/server/db/query.extentions";

export namespace FontFamilyRepository {
  export const findById = async (id: number): Promise<FontFamilySelectType | null> => {
    const result = await db.select().from(fontFamily).where(eq(fontFamily.id, id)).limit(1);
    return result[0] || null;
  };

  export const findByName = async (name: string): Promise<FontFamilySelectType | null> => {
    const result = await db.select().from(fontFamily).where(eq(fontFamily.name, name)).limit(1);
    return result[0] || null;
  };

  export const findAll = async (): Promise<FontFamilySelectType[]> => {
    return db.select().from(fontFamily).orderBy(fontFamily.name);
  };

  export const fetchWithFilters = async (
    paginationArgs: Types.PaginationArgs | null,
    filters?: FontFamilyFilterArgs | null,
    _orderBy?: FontFamiliesOrderByClause[] | null
  ): Promise<FontFamiliesWithFiltersResponse> => {
    let query = db
      .select({
        family: fontFamily,
        total: sql<number>`cast(count(*) over() as int)`,
      })
      .from(fontFamily)
      .$dynamic();

    if (filters?.nameContains) {
      query = query.where(ilike(fontFamily.name, `%${filters.nameContains}%`));
    }

    query = queryWithPagination(query, paginationArgs);
    const results = await query;

    const total = (results[0] as { total: number })?.total ?? 0;
    const items: FontFamilySelectType[] = results.map(r => (r as { family: FontFamilySelectType }).family);
    const pageInfo = PaginationUtils.buildPageInfoFromArgs(paginationArgs, items.length, total);

    return { data: items, pageInfo };
  };

  export const create = async (input: FontFamilyCreateInput): Promise<FontFamilySelectType> => {
    const existing = await findByName(input.name);
    if (existing) {
      throw new Error(`Font family "${input.name}" already exists.`);
    }

    const [newFamily] = await db.insert(fontFamily).values(input).returning();
    if (!newFamily) throw new Error("Failed to create font family.");

    logger.info(`Font family created: ${newFamily.name} (ID: ${newFamily.id})`);
    return newFamily;
  };

  export const update = async (input: FontFamilyUpdateInput): Promise<FontFamilySelectType> => {
    const existing = await findById(input.id);
    if (!existing) throw new Error(`Font family with ID ${input.id} does not exist.`);

    const [updated] = await db.update(fontFamily).set(input).where(eq(fontFamily.id, input.id)).returning();
    if (!updated) throw new Error("Failed to update font family.");

    logger.info(`Font family updated: ${updated.name} (ID: ${updated.id})`);
    return updated;
  };

  export const checkUsage = async (id: number): Promise<FontFamilyUsageCheckResult> => {
    const variants = await db.select().from(fontVariant).where(eq(fontVariant.familyId, id));
    const totalVariants = variants.length;

    if (totalVariants === 0) {
      return {
        isInUse: false,
        variantsInUse: 0,
        totalVariants: 0,
        canDelete: true,
      };
    }

    return {
      isInUse: true,
      variantsInUse: totalVariants,
      totalVariants,
      canDelete: false,
      deleteBlockReason: `Font family has ${totalVariants} variant(s). Delete all variants first.`,
    };
  };

  export const deleteById = async (id: number): Promise<FontFamilySelectType> => {
    const usageCheck = await checkUsage(id);
    if (usageCheck.isInUse) {
      throw new Error(usageCheck.deleteBlockReason || "Cannot delete font family.");
    }

    const [deleted] = await db.delete(fontFamily).where(eq(fontFamily.id, id)).returning();
    if (!deleted) throw new Error("Failed to delete font family.");

    logger.info(`Font family deleted: ${deleted.name} (ID: ${deleted.id})`);
    return deleted;
  };
}
