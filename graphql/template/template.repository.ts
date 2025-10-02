import { db } from "@/db/db";
import { templateCategories, templates } from "@/db/schema";
import { count, eq, inArray, max } from "drizzle-orm";
import {
    PaginatedTemplatesResponse,
    TemplateCreateInput,
    TemplatePothosDefintion,
    TemplateSelectType,
    TemplateInsertInput,
    TemplateUpdateInput,
} from "./template.types";
import logger from "@/utils/logger";
import { PaginationArgs } from "../pagintaion/pagintaion.types";
import { PaginationArgsDefault } from "../pagintaion/pagination.objects";
import { validateTemplateName } from "./template.utils";
import {
    findMainTemplateCategory,
    findSuspensionTemplateCategory,
    findTemplateCategoryById,
} from "../templateCategory/templateCategory.repository";

export const findTemplateByIdOrThrow = async (
    id: number,
): Promise<TemplateSelectType> => {
    try {
        return await db
            .select()
            .from(templates)
            .where(eq(templates.id, id))
            .then((res) => {
                const t = res[0];
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

export const templatesTotalCount = async (): Promise<number> => {
    const [{ total }] = await db.select({ total: count() }).from(templates);
    return total;
};

export const findTemplates = async (opts: {
    limit: number;
    offset: number;
}): Promise<TemplateSelectType[]> => {
    return await db
        .select()
        .from(templates)
        .orderBy()
        .limit(opts.limit)
        .offset(opts.offset);
};

export const loadTemplatesByIds = async (
    ids: number[],
): Promise<(TemplatePothosDefintion | Error)[]> => {
    if (ids.length === 0) return [];
    const filteredTemplates = await db
        .select()
        .from(templates)
        .where(inArray(templates.id, ids));

    const categories: (TemplatePothosDefintion | Error)[] = ids.map((id) => {
        const matchingTemplate = filteredTemplates.find((c) => c.id === id);
        if (!matchingTemplate) return new Error(`Template ${id} not found`);
        return matchingTemplate;
    });
    return categories;
};

export const loadTemplatesForTemplateCategories = async (
    templateCategoryIds: number[],
): Promise<TemplatePothosDefintion[][]> => {
    if (templateCategoryIds.length === 0) return [];
    const templatesList = await db
        .select()
        .from(templates)
        .where(inArray(templates.categoryId, templateCategoryIds))
        .orderBy(templates.order);

    return templateCategoryIds.map((categoryId) =>
        templatesList.filter((template) => template.categoryId === categoryId),
    );
};

export const findTemplatesPaginated = async (
    paginationArgs?: PaginationArgs | null,
): Promise<PaginatedTemplatesResponse> => {
    const { first, skip, page, maxCount } = paginationArgs ?? {};

    const total = await templatesTotalCount();

    // Figure out pagination
    const perPage = Math.min(
        first ?? PaginationArgsDefault.first,
        maxCount ?? PaginationArgsDefault.maxCount,
    );
    const currentPage = page ?? (skip ? Math.floor(skip / perPage) + 1 : 1);
    const offset = (currentPage - 1) * perPage;

    const templates = await findTemplates({
        limit: perPage,
        offset,
    });

    const length = templates.length;
    const lastPage = Math.ceil(total / perPage);
    const hasMorePages = currentPage < lastPage;

    const result: PaginatedTemplatesResponse = {
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

export const findMaxOrderByCategoryId = async (
    categoryId: number,
): Promise<number> => {
    const [{ maxOrder }] = await db
        .select({ maxOrder: max(templates.order) })
        .from(templates)
        .where(eq(templates.categoryId, categoryId));
    return maxOrder ?? 0;
};

export const createTemplate = async (
    input: TemplateCreateInput,
): Promise<TemplateSelectType> => {
    const { name, description, categoryId } = input;

    // Validate name length
    if (name.length < 3 || name.length > 255) {
        throw new Error(
            "Template name must be between 3 and 255 characters long.",
        );
    }
    const newOrder = (await findMaxOrderByCategoryId(categoryId)) + 1;

    const category = await db
        .select({
            id: templateCategories.id,
            specialType: templateCategories.specialType,
        })
        .from(templateCategories)
        .where(eq(templateCategories.id, categoryId))
        .then((res) => res[0]);

    // Validate category exists
    if (!category) {
        throw new Error(`Category with ID ${categoryId} does not exist.`);
    }

    // Validate not suspension category
    if (category.specialType === "Suspension") {
        throw new Error("Cannot create template in a suspension category.");
    }

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
};

export const updateTemplate = async (
    input: TemplateUpdateInput,
): Promise<TemplateSelectType> => {
    const {
        id,
        name,
        categoryId: newCategoryId,
        description,
        //  _imagePath
    } = input;
    // Find existing template
    const existingTemplate = await findTemplateByIdOrThrow(id);
    validateTemplateName(existingTemplate.name);

    const currentCategoryId = existingTemplate.categoryId;
    if (currentCategoryId != newCategoryId) {
        // Validate category exists if provided
        const category = await findTemplateCategoryById(newCategoryId);
        if (!category) {
            throw new Error(
                `Category with ID ${newCategoryId} does not exist.`,
            );
        }

        // Validate not suspension category
        if (category.specialType === "Suspension") {
            throw new Error(
                "updateTemplate: Cannot move template to a suspension category.",
            );
        }
    }

    // TODO: Add image file handling
    // This would require implementing storage service

    const updateData: Partial<TemplateInsertInput> = {
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

export const deleteTemplateById = async (
    id: number,
): Promise<TemplateSelectType> => {
    const existingTemplate = await findTemplateByIdOrThrow(id);

    // Delete the template
    await db.delete(templates).where(eq(templates.id, id));

    // Return the template data as a simple object
    return existingTemplate;
};

export const suspendTemplateById = async (
    id: number,
): Promise<TemplateSelectType> => {
    // Find existing template
    const existingTemplate = await findTemplateByIdOrThrow(id);

    const suspensionCategory = await findSuspensionTemplateCategory();

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

export const unsuspendTemplateById = async (
    id: number,
): Promise<TemplateSelectType> => {
    // Find existing template
    const existingTemplate = await findTemplateByIdOrThrow(id);

    const suspensionCategoryId = (await findSuspensionTemplateCategory()).id;
    const mainCategoryId = (await findMainTemplateCategory()).id;

    // Validate it is suspended
    if (existingTemplate.categoryId !== suspensionCategoryId) {
        throw new Error(`Template with ID ${id} is not suspended.`);
    }

    const preSuspensionCategory = await findTemplateCategoryById(
        existingTemplate.preSuspensionCategoryId,
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
