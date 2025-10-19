import { db } from "@/server/db/drizzleDb";
import {
  templateCategories,
  templates,
  templatesConfigs,
} from "@/server/db/schema";
import { count, eq, inArray, max, sql, asc } from "drizzle-orm";
import {
  TemplateEntity,
  PaginatedTemplatesEntityResponse,
  TemplateEntityInput,
  TemplateCreateInput,
  TemplateUpdateInput,
  TemplatesConfigSelectType,
  TemplatesWithFiltersResponse,
  TemplatePothosDefintion,
} from "@/server/types";
import logger from "@/lib/logger";
import { PaginationArgs } from "../../types/pagination.types";
import { PaginationArgsDefault } from "../../graphql/pothos/pagination.objects";
import {
  TemplateUtils,
  TemplateFilterUtils,
  PaginationUtils,
} from "@/server/utils";
import { TemplateCategoryRepository } from "./templateCategory.repository";
import { getStorageService } from "@/server/storage/storage.service";
import * as Types from "@/server/types";
import { queryWithPagination } from "@/server/db/query.extentions";

export namespace TemplateRepository {
  export const findById = async (
    id: number
  ): Promise<TemplateEntity | null> => {
    try {
      return await db
        .select()
        .from(templates)
        .where(eq(templates.id, id))
        .then(res => {
          const t = res[0];
          if (!t) {
            return null;
          }
          return t;
        });
    } catch {
      return null;
    }
  };

  export const findByIdOrThrow = async (
    id: number
  ): Promise<TemplateEntity> => {
    try {
      return await findById(id).then(t => {
        if (!t) {
          throw new Error(`Template with ID ${id} does not exist.`);
        }
        return t;
      });
    } catch (e) {
      logger.error("findTemplateByIdOrThrow error:", e);
      throw e;
    }
  };

  export const totalCount = async (): Promise<number> => {
    const [{ total }] = await db.select({ total: count() }).from(templates);
    return total;
  };

  export const findAll = async (opts: {
    limit: number;
    offset: number;
  }): Promise<TemplateEntity[]> => {
    return await db
      .select()
      .from(templates)
      .orderBy()
      .limit(opts.limit)
      .offset(opts.offset);
  };

  export const loadByIds = async (
    ids: number[]
  ): Promise<(TemplateEntity | Error)[]> => {
    if (ids.length === 0) return [];
    const filteredTemplates = await db
      .select()
      .from(templates)
      .where(inArray(templates.id, ids));

    const templateList: (TemplateEntity | Error)[] = ids.map(id => {
      const matchingTemplate = filteredTemplates.find(c => c.id === id);
      if (!matchingTemplate) return new Error(`Template ${id} not found`);
      return matchingTemplate;
    });
    return templateList;
  };

  export const findByCategoryId = async (
    categoryId: number
  ): Promise<TemplateEntity[]> => {
    const templatesList = await db
      .select()
      .from(templates)
      .where(eq(templates.categoryId, categoryId));

    return templatesList;
  };

  export const suspendedTemplates = async (): Promise<TemplateEntity[]> => {
    const suspensionCategory =
      await TemplateCategoryRepository.findTemplatesSuspensionCategory();
    const templatesList = await db
      .select()
      .from(templates)
      .where(eq(templates.categoryId, suspensionCategory.id));

    return templatesList;
  };

  export const loadForTemplateCategories = async (
    templateCategoryIds: number[]
  ): Promise<TemplateEntity[][]> => {
    if (templateCategoryIds.length === 0) return [];
    const templatesList = await db
      .select()
      .from(templates)
      .where(inArray(templates.categoryId, templateCategoryIds))
      .orderBy(templates.order);

    return templateCategoryIds.map(categoryId =>
      templatesList.filter(template => template.categoryId === categoryId)
    );
  };

  export const findAllPaginated = async (
    paginationArgs?: PaginationArgs | null
  ): Promise<PaginatedTemplatesEntityResponse> => {
    const { first, skip, page, maxCount } = paginationArgs ?? {};

    const total = await totalCount();

    // Figure out pagination
    const perPage = Math.min(
      first ?? PaginationArgsDefault.first,
      maxCount ?? PaginationArgsDefault.maxCount
    );
    const currentPage = page ?? (skip ? Math.floor(skip / perPage) + 1 : 1);
    const offset = (currentPage - 1) * perPage;

    const templates = await findAll({
      limit: perPage,
      offset,
    });

    const length = templates.length;
    const lastPage = Math.ceil(total / perPage);
    const hasMorePages = currentPage < lastPage;

    const result: PaginatedTemplatesEntityResponse = {
      data: templates,
      pageInfo: {
        count: length,
        currentPage,
        firstItem: length > 0 ? offset + 1 : null,
        lastItem: length > 0 ? offset + length : null,
        hasMorePages,
        lastPage,
        perPage,
        total,
      },
    };

    return result;
  };

  export const findMaxOrderInCategory = async (
    categoryId: number
  ): Promise<number> => {
    const [{ maxOrder }] = await db
      .select({ maxOrder: max(templates.order) })
      .from(templates)
      .where(eq(templates.categoryId, categoryId));
    return maxOrder ?? 0;
  };

  export const create = async (
    input: TemplateCreateInput
  ): Promise<TemplateEntity> => {
    const { name, description, categoryId } = input;

    // Validate name length
    if (name.length < 3 || name.length > 255) {
      throw new Error(
        "Template name must be between 3 and 255 characters long."
      );
    }
    const newOrder = (await findMaxOrderInCategory(categoryId)) + 1;

    const category = await db
      .select({
        id: templateCategories.id,
        specialType: templateCategories.specialType,
      })
      .from(templateCategories)
      .where(eq(templateCategories.id, categoryId))
      .then(res => res[0]);

    // Validate category exists
    if (!category) {
      throw new Error(`Category with ID ${categoryId} does not exist.`);
    }

    // Validate not suspension category
    if (category.specialType === "Suspension") {
      throw new Error("Cannot create template in a suspension category.");
    }

    try {
      const [newTemplate] = await db
        .insert(templates)
        .values({
          name,
          description,
          categoryId,
          order: newOrder,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return newTemplate;
    } catch (err) {
      logger.error(err);
      throw new Error(`Failed to create template with name: ${input.name}`);
    }
  };

  type TemplateCreateInputWithImageFileId = TemplateCreateInput & {
    imageFileId: bigint;
  };

  export const internalCreateWithImageFileId = async (
    input: TemplateCreateInputWithImageFileId
  ): Promise<TemplateEntity> => {
    const storageService = await getStorageService();
    const file = await storageService.fileInfoByDbFileId(input.imageFileId);
    if (!file) {
      throw new Error("Image file not found.");
    }

    if (
      file.isFromBucket &&
      file.isPublic &&
      file.contentType === "image/jpeg"
    ) {
      try {
        const template = await create({ ...input });
        const [reult] = await db
          .update(templates)
          .set({
            imageFileId: input.imageFileId,
          })
          .where(eq(templates.id, template.id))
          .returning();
        return reult;
      } catch (err) {
        logger.error(err);
      }
    }

    throw new Error(
      `Failed to create template, name: ${input.name}, imageFileId: ${input.imageFileId}`
    );
  };

  export const update = async (
    input: TemplateUpdateInput
  ): Promise<TemplateEntity> => {
    const {
      id,
      name,
      categoryId: newCategoryId,
      description,
      //  _imagePath
    } = input;
    // Find existing template
    const existingTemplate = await findByIdOrThrow(id);
    TemplateUtils.validateName(existingTemplate.name);

    const currentCategoryId = existingTemplate.categoryId;
    if (currentCategoryId != newCategoryId) {
      // Validate category exists if provided
      const category = await TemplateCategoryRepository.findById(newCategoryId);
      if (!category) {
        throw new Error(`Category with ID ${newCategoryId} does not exist.`);
      }

      // Validate not suspension category
      if (category.specialType === "Suspension") {
        throw new Error(
          "updateTemplate: Cannot move template to a suspension category."
        );
      }
    }

    // TODO: Add image file handling
    // This would require implementing storage service

    const updateData: Partial<TemplateEntityInput> = {
      name: name,
      categoryId: newCategoryId,
      updatedAt: new Date(),
      description: description,
      // TODO: Handle imagePath -> imageFileId conversion
    };

    const [updatedTemplate] = await db
      .update(templates)
      .set(updateData)
      .where(eq(templates.id, id))
      .returning();

    return updatedTemplate;
  };

  export const deleteById = async (id: number): Promise<TemplateEntity> => {
    const existingTemplate = await findByIdOrThrow(id);

    // todo: check dependancies before delete

    // Delete the template
    await db.delete(templates).where(eq(templates.id, id));

    // Return the template data as a simple object
    return existingTemplate;
  };

  export const suspendById = async (id: number): Promise<TemplateEntity> => {
    // Find existing template
    const existingTemplate = await findByIdOrThrow(id);

    const suspensionCategory =
      await TemplateCategoryRepository.findTemplatesSuspensionCategory();

    const suspensionCategoryId = suspensionCategory.id;

    if (existingTemplate.categoryId === suspensionCategoryId) {
      throw new Error(`Template with ID ${id} is already suspended.`);
    }

    const [updatedTemplate] = await db
      .update(templates)
      .set({
        categoryId: suspensionCategoryId,
        preSuspensionCategoryId: existingTemplate.categoryId,
        updatedAt: new Date(),
      })
      .where(eq(templates.id, id))
      .returning();

    return updatedTemplate;
  };

  export const unsuspendById = async (id: number): Promise<TemplateEntity> => {
    // Find existing template
    const existingTemplate = await findByIdOrThrow(id);

    const suspensionCategoryId = (
      await TemplateCategoryRepository.findTemplatesSuspensionCategory()
    ).id;
    const mainCategoryId = (
      await TemplateCategoryRepository.findTemplatesMainCategory()
    ).id;

    // Validate it is suspended
    if (existingTemplate.categoryId !== suspensionCategoryId) {
      throw new Error(`Template with ID ${id} is not suspended.`);
    }

    const preSuspensionCategory = await TemplateCategoryRepository.findById(
      existingTemplate.preSuspensionCategoryId
    );

    const targetCategoryId = preSuspensionCategory?.id || mainCategoryId;

    const [updatedTemplate] = await db
      .update(templates)
      .set({
        categoryId: targetCategoryId,
        preSuspensionCategoryId: null,
        updatedAt: new Date(),
      })
      .where(eq(templates.id, id))
      .returning();

    return updatedTemplate;
  };

  export const allConfigs = async (): Promise<TemplatesConfigSelectType[]> => {
    return await db
      .select()
      .from(templatesConfigs)
      .then(res => res);
  };

  export const existsById = async (id: number): Promise<boolean> => {
    return (await db.$count(templates, eq(templates.id, id))) > 0;
  };

  export const fetchByCategoryIdWithFilters = async (
    categoryId?: number | null,
    paginationArgs?: Types.PaginationArgs | null,
    filters?: Types.TemplateFilterArgs | null,
    orderBy?: Types.TemplatesOrderByClause[] | null
  ): Promise<TemplatesWithFiltersResponse> => {
    // Build base query
    let baseQuery = db
      .select({
        template: templates,
        total: sql<number>`cast(count(*) over() as int)`,
      })
      .from(templates)
      .$dynamic();

    // Apply categoryId filter if provided
    if (categoryId !== null && categoryId !== undefined) {
      baseQuery = baseQuery.where(eq(templates.categoryId, categoryId));
    }

    // Apply name filters
    let processedQuery = TemplateFilterUtils.applyFilters(baseQuery, filters);

    // Apply ordering - with conditional defaults
    if (!orderBy || orderBy.length === 0) {
      // Apply default ordering based on categoryId
      if (categoryId === null || categoryId === undefined) {
        // If no categoryId, sort by name
        processedQuery = processedQuery.orderBy(asc(templates.name));
      } else {
        // If categoryId provided, sort by order
        processedQuery = processedQuery.orderBy(asc(templates.order));
      }
    } else {
      // Apply user-specified ordering
      processedQuery = TemplateFilterUtils.applyOrdering(
        processedQuery,
        orderBy
      );
    }

    // Apply pagination
    processedQuery = queryWithPagination(processedQuery, paginationArgs);

    const results = await processedQuery;

    const total = (results[0] as { total: number })?.total ?? 0;
    const items: TemplatePothosDefintion[] = results.map(r => {
      const t: TemplateEntity = (r as { template: TemplateEntity }).template;
      return t;
    });

    const pageInfo = PaginationUtils.buildPageInfoFromArgs(
      paginationArgs,
      items.length,
      total
    );

    return {
      data: items,
      pageInfo: pageInfo,
    };
  };
}
