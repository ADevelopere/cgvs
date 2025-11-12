import { db } from "@/server/db/drizzleDb";
import { eq, inArray, sql } from "drizzle-orm";
import { fontVariant } from "@/server/db/schema/font";
import {
  certificateElement,
  elementTextProps,
  textElement,
  dateElement,
  numberElement,
  countryElement,
  genderElement,
  storageFiles,
  templates,
} from "@/server/db/schema";
import {
  FontVariantSelectType,
  FontVariantCreateInput,
  FontVariantUpdateInput,
  FontVariantUsageCheckResult,
  FontUsageReference,
  FontVariantsWithFiltersResponse,
  FontVariantFilterArgs,
  FontVariantsOrderByClause,
} from "@/server/types/font.types";
import * as Types from "@/server/types";
import logger from "@/server/lib/logger";
import { PaginationUtils } from "@/server/utils";
import { queryWithPagination } from "@/server/db/query.extentions";

export namespace FontVariantRepository {
  export const findById = async (id: number): Promise<FontVariantSelectType | null> => {
    const result = await db.select().from(fontVariant).where(eq(fontVariant.id, id)).limit(1);
    return result[0] || null;
  };

  export const findByFamilyId = async (familyId: number): Promise<FontVariantSelectType[]> => {
    return db.select().from(fontVariant).where(eq(fontVariant.familyId, familyId)).orderBy(fontVariant.variant);
  };

  export const findAll = async (): Promise<FontVariantSelectType[]> => {
    return db.select().from(fontVariant).orderBy(fontVariant.variant);
  };

  export const fetchWithFilters = async (
    paginationArgs: Types.PaginationArgs | null,
    filters?: FontVariantFilterArgs | null,
    _orderBy?: FontVariantsOrderByClause[] | null
  ): Promise<FontVariantsWithFiltersResponse> => {
    let query = db
      .select({
        variant: fontVariant,
        total: sql<number>`cast(count(*) over() as int)`,
      })
      .from(fontVariant)
      .$dynamic();

    if (filters?.familyId) {
      query = query.where(eq(fontVariant.familyId, filters.familyId));
    }

    query = queryWithPagination(query, paginationArgs);
    const results = await query;

    const total = (results[0] as { total: number })?.total ?? 0;
    const items: FontVariantSelectType[] = results.map(r => (r as { variant: FontVariantSelectType }).variant);
    const pageInfo = PaginationUtils.buildPageInfoFromArgs(paginationArgs, items.length, total);

    return { data: items, pageInfo };
  };

  const getOrCreateStorageFileId = async (filePath: string): Promise<number> => {
    const existingFile = await db
      .select({ id: storageFiles.id })
      .from(storageFiles)
      .where(eq(storageFiles.path, filePath))
      .limit(1);

    if (existingFile.length > 0 && existingFile[0]) {
      return Number(existingFile[0].id);
    }

    const [newFile] = await db.insert(storageFiles).values({ path: filePath, isProtected: false }).returning();
    if (!newFile) throw new Error(`Failed to create storage file record for path: ${filePath}`);

    return Number(newFile.id);
  };

  export const create = async (input: FontVariantCreateInput): Promise<FontVariantSelectType> => {
    const storageFileId = await getOrCreateStorageFileId(input.storageFilePath);

    const [newVariant] = await db
      .insert(fontVariant)
      .values({
        familyId: input.familyId,
        variant: input.variant.trim(),
        storageFileId,
      })
      .returning();

    if (!newVariant) throw new Error("Failed to create font variant.");

    logger.info(`Font variant created: ${newVariant.variant} (ID: ${newVariant.id})`);
    return newVariant;
  };

  export const update = async (input: FontVariantUpdateInput): Promise<FontVariantSelectType> => {
    const existing = await findById(input.id);
    if (!existing) throw new Error(`Font variant with ID ${input.id} does not exist.`);

    const storageFileId = await getOrCreateStorageFileId(input.storageFilePath);

    const [updated] = await db
      .update(fontVariant)
      .set({
        variant: input.variant.trim(),
        storageFileId,
      })
      .where(eq(fontVariant.id, input.id))
      .returning();

    if (!updated) throw new Error("Failed to update font variant.");

    logger.info(`Font variant updated: ${updated.variant} (ID: ${updated.id})`);
    return updated;
  };

  export const checkUsage = async (id: number): Promise<FontVariantUsageCheckResult> => {
    const textPropsWithFont = await db
      .select({ id: elementTextProps.id })
      .from(elementTextProps)
      .where(eq(elementTextProps.fontVariantId, id));

    if (textPropsWithFont.length === 0) {
      return { isInUse: false, usageCount: 0, usedBy: [], canDelete: true };
    }

    const textPropsIds = textPropsWithFont.map(tp => tp.id);

    const [textElements, dateElements, numberElements, countryElements, genderElements] = await Promise.all([
      db
        .select({
          elementId: textElement.elementId,
          type: certificateElement.type,
          templateId: certificateElement.templateId,
        })
        .from(textElement)
        .innerJoin(certificateElement, eq(certificateElement.id, textElement.elementId))
        .where(inArray(textElement.textPropsId, textPropsIds)),
      db
        .select({
          elementId: dateElement.elementId,
          type: certificateElement.type,
          templateId: certificateElement.templateId,
        })
        .from(dateElement)
        .innerJoin(certificateElement, eq(certificateElement.id, dateElement.elementId))
        .where(inArray(dateElement.textPropsId, textPropsIds)),
      db
        .select({
          elementId: numberElement.elementId,
          type: certificateElement.type,
          templateId: certificateElement.templateId,
        })
        .from(numberElement)
        .innerJoin(certificateElement, eq(certificateElement.id, numberElement.elementId))
        .where(inArray(numberElement.textPropsId, textPropsIds)),
      db
        .select({
          elementId: countryElement.elementId,
          type: certificateElement.type,
          templateId: certificateElement.templateId,
        })
        .from(countryElement)
        .innerJoin(certificateElement, eq(certificateElement.id, countryElement.elementId))
        .where(inArray(countryElement.textPropsId, textPropsIds)),
      db
        .select({
          elementId: genderElement.elementId,
          type: certificateElement.type,
          templateId: certificateElement.templateId,
        })
        .from(genderElement)
        .innerJoin(certificateElement, eq(certificateElement.id, genderElement.elementId))
        .where(inArray(genderElement.textPropsId, textPropsIds)),
    ]);

    const allUsages = [...textElements, ...dateElements, ...numberElements, ...countryElements, ...genderElements];

    if (allUsages.length === 0) {
      return { isInUse: false, usageCount: 0, usedBy: [], canDelete: true };
    }

    const templateIds = [...new Set(allUsages.map(u => u.templateId).filter((id): id is number => id !== null))];
    const templateNames =
      templateIds.length > 0
        ? await db
            .select({ id: templates.id, name: templates.name })
            .from(templates)
            .where(inArray(templates.id, templateIds))
        : [];
    const templateMap = new Map(templateNames.map(t => [t.id, t.name]));

    const usedBy: FontUsageReference[] = allUsages.map(usage => ({
      elementId: usage.elementId,
      elementType: usage.type,
      templateId: usage.templateId,
      templateName: usage.templateId ? templateMap.get(usage.templateId) || null : null,
    }));

    return {
      isInUse: true,
      usageCount: allUsages.length,
      usedBy,
      canDelete: false,
      deleteBlockReason: `Font variant is used in ${allUsages.length} element(s). Remove from elements before deleting.`,
    };
  };

  export const deleteById = async (id: number): Promise<FontVariantSelectType> => {
    const usageCheck = await checkUsage(id);
    if (usageCheck.isInUse) {
      throw new Error(usageCheck.deleteBlockReason || "Cannot delete font variant.");
    }

    const [deleted] = await db.delete(fontVariant).where(eq(fontVariant.id, id)).returning();
    if (!deleted) throw new Error("Failed to delete font variant.");

    logger.info(`Font variant deleted: ${deleted.variant} (ID: ${deleted.id})`);
    return deleted;
  };

  export const loadByIds = async (ids: number[]): Promise<(FontVariantSelectType | Error)[]> => {
    if (ids.length === 0) return [];
    const variants = await db.select().from(fontVariant).where(inArray(fontVariant.id, ids));
    return ids.map(id => variants.find(v => v.id === id) || new Error(`Font variant with ID ${id} not found`));
  };
}
