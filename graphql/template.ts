import { schemaBuilder } from "./builder";
import { db } from "@/db/db";
import {
    PaginationArgs,
    PaginationArgsDefault,
    PaginationInfo,
} from "./pagination";
import { templates, templateCategories, storageFiles } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import logger from "@/utils/logger";

type TemplateSelectModel = InferSelectModel<typeof templates>;
type TemplateInsertModel = InferInsertModel<typeof templates>;

const TemplateSelectModelRef = schemaBuilder.objectRef<TemplateSelectModel>(
    "TemplateSelectModel",
);

const TemplateSelectModelObject = TemplateSelectModelRef.implement({
    fields: (t) => ({
        id: t.exposeID("id"),
        name: t.exposeString("name"),
        description: t.exposeString("description", { nullable: true }),
        categoryId: t.exposeInt("categoryId"),
        order: t.exposeInt("order"),
        createdAt: t.expose("createdAt", { type: "DateTime" }),
        updatedAt: t.expose("updatedAt", { type: "DateTime" }),
        preSuspensionCategoryId: t.exposeInt("preSuspensionCategoryId", {
            nullable: true,
        }),
    }),
});

// Define the Template object type
export const TemplateObject = schemaBuilder.drizzleObject("templates", {
    name: "Template",
    select: {
        columns: {
            id: true,
        },
    },
    fields: (t) => ({
        id: t.exposeID("id"),
        name: t.exposeString("name"),
        imageUrl: t.string({
            nullable: true,
            resolve: async ({ id: templateId }) => {
                const template = await findByIdOrThrow(templateId);
                if (template.imageFileId) {
                    const file = await db
                        .select()
                        .from(storageFiles)
                        .where(eq(storageFiles.id, template.imageFileId))
                        .then((res) => res[0]);

                    return file?.path || null;
                }
                return null;
            },
        }),
        createdAt: t.expose("createdAt", { type: "DateTime" }),
        updatedAt: t.expose("updatedAt", { type: "DateTime" }),
        // relations
        category: t.relation("category"),
        // templateVariables: t.relation("templateVariables"),
        // elements: t.relation("elements"),
    }),
});

const PaginatedTemplatesResponse = schemaBuilder.simpleObject(
    "PaginatedTemplatesResponse",
    {
        fields: (t) => ({
            data: t.field({ type: [TemplateObject] }),
            paginationInfo: t.field({ type: PaginationInfo, nullable: true }),
        }),
    },
);

const CreateTemplateInput = schemaBuilder.inputType("CreateTemplateInput", {
    fields: (t) => ({
        name: t.string({ required: true }),
        description: t.string({ required: false }),
        categoryId: t.int({ required: true }),
    }),
});

const UpdateTemplateInput = schemaBuilder.inputType("UpdateTemplateInput", {
    fields: (t) => ({
        id: t.int({ required: true }),
        name: t.string({ required: false }),
        description: t.string({ required: false }),
        categoryId: t.int({ required: true }),
        imagePath: t.string({ required: false }),
    }),
});

// // Add template queries to the Query type
schemaBuilder.queryFields((t) => ({
    template: t.drizzleField({
        type: "templates",
        nullable: true,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (query, _parent, args) => {
            return await db.query.templates.findFirst({
                ...query,
                where: { id: args.id },
            });
        },
    }),

    templates: t.field({
        type: PaginatedTemplatesResponse,
        args: {
            pagination: t.arg({
                type: PaginationArgs,
            }),
        },
        resolve: async (_, args) => {
            const { first, skip, page, maxCount } = args.pagination ?? {};

            // Count total
            const [{ value: total }] = await db
                .select({ value: count() })
                .from(templates);

            // Figure out pagination
            const perPage = Math.min(
                first ?? PaginationArgsDefault.first,
                maxCount ?? PaginationArgsDefault.maxCount,
            );
            const currentPage =
                page ?? (skip ? Math.floor(skip / perPage) + 1 : 1);
            const offset = (currentPage - 1) * perPage;

            // Query data
            const data = await db.query.templates.findMany({
                orderBy: (templates, { desc }) => [desc(templates.createdAt)],
                limit: perPage,
                offset,
            });

            const length = data.length;
            const lastPage = Math.ceil(total / perPage);
            const firstItem = offset + 1;
            const lastItem = offset + length;
            const hasMorePages = currentPage < lastPage;

            return {
                data,
                paginationInfo: {
                    count: length,
                    currentPage,
                    firstItem: length > 0 ? firstItem : null,
                    lastItem: length > 0 ? lastItem : null,
                    hasMorePages,
                    lastPage,
                    perPage,
                    total,
                },
            };
        },
    }),
}));


schemaBuilder.mutationFields((t) => ({
    createTemplate: t.field({
        type: TemplateObject,
        args: {
            input: t.arg({ type: CreateTemplateInput, required: true }),
        },
        resolve: async (_, args) => {
            const { name, description, categoryId } = args.input;

            // Validate name length
            if (name.length < 3 || name.length > 255) {
                throw new Error(
                    "Template name must be between 3 and 255 characters long.",
                );
            }

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
                throw new Error(
                    `Category with ID ${categoryId} does not exist.`,
                );
            }

            // Validate not suspension category
            if (category.specialType === "Suspension") {
                throw new Error(
                    "Cannot create template in a suspension category.",
                );
            }

            const [newTemplate] = await db
                .insert(templates)
                .values({
                    name,
                    description,
                    categoryId,
                    order: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
                .returning();

            return newTemplate;
        },
    }),

    updateTemplate: t.field({
        type: TemplateObject,
        nullable: true,
        args: {
            input: t.arg({ type: UpdateTemplateInput, required: true }),
        },
        resolve: async (_, args) => {
            const { id, name, description, categoryId, imagePath } = args.input;

            // Find existing template
            const existingTemplate = await findByIdOrThrow(id);
            validateTemplateName(name ?? existingTemplate.name);

            // TODO: Add category validation and image file handling
            // This would require implementing category queries and storage service

            const updateData: Partial<TemplateInsertModel> = {
                updatedAt: new Date(),
            };

            if (name !== undefined) updateData.name = name ?? undefined;
            if (description !== undefined) updateData.description = description;
            if (categoryId !== undefined) updateData.categoryId = categoryId;

            // TODO: Handle imagePath -> imageFileId conversion

            const [updatedTemplate] = await db
                .update(templates)
                .set(updateData)
                .where(eq(templates.id, id))
                .returning();

            return updatedTemplate;
        },
    }),

    deleteTemplate: t.field({
        type: TemplateSelectModelObject,
        nullable: true,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (_, args) => {
            const { id } = args;

            // Find existing template
            const existingTemplate = await findByIdOrThrow(id);

            // Delete the template
            await db.delete(templates).where(eq(templates.id, id));

            // Return the template data as a simple object
            return existingTemplate;
        },
    }),

    // suspendTemplate: t.field({
    //     type: Template,
    //     nullable: true,
    //     args: {
    //         id: t.arg.int({ required: true }),
    //     },
    //     resolve: async (_, args) => {
    //         const { id } = args;

    //         // Find existing template
    //         const existingTemplate = await db.query.templates.findFirst({
    //             where: (templates, { eq }) => eq(templates.id, id),
    //         });

    //         if (!existingTemplate) {
    //             throw new Error(`Template with ID ${id} does not exist.`);
    //         }

    //         // TODO: Implement suspension category lookup
    //         // This would require implementing template category queries first
    //         // For now, using a placeholder suspension category ID
    //         const suspensionCategoryId = 999; // This should be fetched from categories

    //         if (existingTemplate.categoryId === suspensionCategoryId) {
    //             throw new Error(`Template with ID ${id} is already suspended.`);
    //         }

    //         const [updatedTemplate] = await db
    //             .update(templates)
    //             .set({
    //                 categoryId: suspensionCategoryId,
    //                 preSuspensionCategoryId: existingTemplate.categoryId,
    //                 updatedAt: new Date(),
    //             })
    //             .where(eq(templates.id, id))
    //             .returning();

    //         return updatedTemplate;
    //     },
    // }),

    // unsuspendTemplate: t.field({
    //     type: Template,
    //     nullable: true,
    //     args: {
    //         id: t.arg.int({ required: true }),
    //     },
    //     resolve: async (_, args) => {
    //         const { id } = args;

    //         // Find existing template
    //         const existingTemplate = await db.query.templates.findFirst({
    //             where: (templates, { eq }) => eq(templates.id, id),
    //         });

    //         if (!existingTemplate) {
    //             throw new Error(`Template with ID ${id} does not exist.`);
    //         }

    //         // TODO: Implement suspension and main category lookup
    //         // This would require implementing template category queries first
    //         const suspensionCategoryId = 999; // This should be fetched from categories
    //         const mainCategoryId = 1; // This should be fetched from categories

    //         if (existingTemplate.categoryId !== suspensionCategoryId) {
    //             throw new Error(`Template with ID ${id} is not suspended.`);
    //         }

    //         const targetCategoryId = existingTemplate.preSuspensionCategoryId || mainCategoryId;

    //         const [updatedTemplate] = await db
    //             .update(templates)
    //             .set({
    //                 categoryId: targetCategoryId,
    //                 preSuspensionCategoryId: null,
    //                 updatedAt: new Date(),
    //             })
    //             .where(eq(templates.id, id))
    //             .returning();

    //         return updatedTemplate;
    //     },
    // }),
}));

const findByIdOrThrow = async (id: number) => {
    try {
        const template = await db
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
        logger.log(template);
        return template;
    } catch (e) {
        throw e;
    }
};

const validateTemplateName = (name: string) => {
    if (name.length < 3 || name.length > 255) {
        throw new Error(
            "Template name must be between 3 and 255 characters long.",
        );
    }
};
