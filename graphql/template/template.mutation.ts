import { schemaBuilder } from "../builder";
import { db } from "@/db/db";
import { templates, templateCategories } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
    TemplateCreateInputObject,
    TemplateObject,
    TemplateUpdateInputObject,
} from "./template.objects";
import { findTemplateByIdOrThrow } from "./template.repository";
import { validateTemplateName } from "./template.utils";
import { TemplateInput } from "./template.types";

schemaBuilder.mutationFields((t) => ({
    createTemplate: t.field({
        type: TemplateObject,
        args: {
            input: t.arg({ type: TemplateCreateInputObject, required: true }),
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
            input: t.arg({ type: TemplateUpdateInputObject, required: true }),
        },
        resolve: async (_, args) => {
            const {
                id,
                name,
                description,
                categoryId,
                //  _imagePath
            } = args.input;

            // Find existing template
            const existingTemplate = await findTemplateByIdOrThrow(id);
            validateTemplateName(name ?? existingTemplate.name);

            // TODO: Add category validation and image file handling
            // This would require implementing category queries and storage service

            const updateData: Partial<TemplateInput> = {
                updatedAt: new Date(),
            };

            if (name) updateData.name = name;
            if (description) updateData.description = description;
            if (categoryId) updateData.categoryId = categoryId;

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
        type: TemplateObject,
        nullable: true,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (_, args) => {
            const { id } = args;

            // Find existing template
            const existingTemplate = await findTemplateByIdOrThrow(id);

            // Delete the template
            await db.delete(templates).where(eq(templates.id, id));

            // Return the template data as a simple object
            return existingTemplate;
        },
    }),

    suspendTemplate: t.field({
        type: TemplateObject,
        nullable: true,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (_, args) => {
            const { id } = args;

            // Find existing template
            const existingTemplate = await findTemplateByIdOrThrow(id);

            // TODO: Implement suspension category lookup
            // This would require implementing template category queries first
            // For now, using a placeholder suspension category ID
            const suspensionCategoryId = 999; // This should be fetched from categories

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
        },
    }),

    unsuspendTemplate: t.field({
        type: TemplateObject,
        nullable: true,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (_, args) => {
            const { id } = args;

            // Find existing template
            const existingTemplate = await findTemplateByIdOrThrow(id);

            // TODO: Implement suspension and main category lookup
            // This would require implementing template category queries first
            const suspensionCategoryId = 999; // This should be fetched from categories
            const mainCategoryId = 1; // This should be fetched from categories

            if (existingTemplate.categoryId !== suspensionCategoryId) {
                throw new Error(`Template with ID ${id} is not suspended.`);
            }

            const targetCategoryId =
                existingTemplate.preSuspensionCategoryId || mainCategoryId;

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
        },
    }),
}));
