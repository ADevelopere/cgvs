import { db } from "@/server/db/drizzleDb";
import { eq, inArray, max, isNull, count } from "drizzle-orm";
import { templateCategories, templates } from "@/server/db/schema";
import {
    TemplateCategoryCreateInput,
    TemplateCategoryInsertInput,
    TemplateCategorySelectType,
    TemplateCategoryUpdateInput,
} from "./templateCategory.types";
import { validateTemplateCategoryName } from "./templateCategory.utils";

export namespace TemplateCategoryRepository {
    export const findById = async (
        id?: number | null,
    ): Promise<TemplateCategorySelectType | null> => {
        if (!id) return null;
        const category = await db
            .select()
            .from(templateCategories)
            .where(eq(templateCategories.id, id))
            .then((res) => res[0]);
        return category || null;
    };

    export const findAll = async (): Promise<
        TemplateCategorySelectType[]
    > => {
        return db
            .select()
            .from(templateCategories)
            .orderBy(templateCategories.order);
    };

    export const loadByIds = async (
        ids: number[],
    ): Promise<(TemplateCategorySelectType | Error)[]> => {
        if (ids.length === 0) return [];
        const filteredCategories = await db
            .select()
            .from(templateCategories)
            .where(inArray(templateCategories.id, ids));

        const categories: (TemplateCategorySelectType | Error)[] = ids.map(
            (id) => {
                const matchingCategory: TemplateCategorySelectType | undefined =
                    filteredCategories.find((c) => c.id === id);
                if (!matchingCategory)
                    return new Error(`TemplateCategory ${id} not found`);
                return matchingCategory;
            },
        );
        return categories;
    };

    export const loadSubForParents = async (
        parentCategoryIds: number[],
    ): Promise<TemplateCategorySelectType[][]> => {
        if (parentCategoryIds.length === 0) return [];
        const subCategories = await db
            .select()
            .from(templateCategories)
            .where(
                inArray(templateCategories.parentCategoryId, parentCategoryIds),
            )
            .orderBy(templateCategories.order);

        return parentCategoryIds.map((parentId) =>
            subCategories.filter((cat) => cat.parentCategoryId === parentId),
        );
    };

    export const findTemplatesMainCategory =
        async (): Promise<TemplateCategorySelectType> => {
            const category = await db
                .select()
                .from(templateCategories)
                .where(eq(templateCategories.specialType, "Main"))
                .then((res) => res[0]);
            if (!category) {
                throw new Error("Main category not found.");
            }
            return category;
        };

    export const findTemplatesSuspensionCategory =
        async (): Promise<TemplateCategorySelectType> => {
            const category = await db
                .select()
                .from(templateCategories)
                .where(eq(templateCategories.specialType, "Suspension"))
                .then((res) => res[0]);
            if (!category) {
                throw new Error("Suspension category not found.");
            }
            return category;
        };

    export const create = async (
        input: TemplateCategoryCreateInput,
    ): Promise<TemplateCategorySelectType> => {
        validateTemplateCategoryName(input.name);

        let newOrder: number;

        // Validate parent category ID if provided
        if (input.parentCategoryId != null) {
            const parentCategoryId = input.parentCategoryId;
            if (parentCategoryId <= 0) {
                throw new Error(
                    "Parent category ID must be a positive integer.",
                );
            }

            // Check if the parent category exists
            const existingParentCategory =
                await findById(parentCategoryId);
            if (!existingParentCategory) {
                throw new Error(
                    `Parent category with ID ${input.parentCategoryId} does not exist.`,
                );
            }

            // Validate not suspension category
            if (existingParentCategory.specialType === "Suspension") {
                throw new Error(
                    "Cannot create a category under the suspension category.",
                );
            }

            // Find the new category order by getting the max order of the parent category
            const maxOrderResult =
                await findTemplateCategoryMaxOrderByParentCategoryId(
                    parentCategoryId,
                );
            newOrder = maxOrderResult + 1;
        } else {
            // For root categories (no parent)
            const maxOrderResult =
                await findTemplateCategoryMaxOrderByParentCategoryId(null);
            newOrder = maxOrderResult + 1;
        }

        const inputData: TemplateCategoryInsertInput = {
            name: input.name,
            description: input.description,
            parentCategoryId: input.parentCategoryId,
            order: newOrder,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // Create the category
        const [category] = await db
            .insert(templateCategories)
            .values(inputData)
            .returning();

        if (!category) {
            throw new Error("Failed to create category.");
        }

        return category;
    };

    export const update = async (
        input: TemplateCategoryUpdateInput,
    ): Promise<TemplateCategorySelectType> => {
        const existingCategory = await findById(input.id);
        if (!existingCategory) {
            throw new Error(`Category with ID ${input.id} does not exist.`);
        }

        validateTemplateCategoryName(input.name);

        const newParentCategoryId = input.parentCategoryId;

        // Validate parent category ID if provided
        if (newParentCategoryId) {
            // Check if the parent category exists
            const existingParentCategory =
                await findById(newParentCategoryId);
            if (!existingParentCategory) {
                throw new Error(
                    `Parent category with ID ${newParentCategoryId} does not exist.`,
                );
            }

            // Validate not suspension category
            if (existingParentCategory.specialType === "Suspension") {
                throw new Error(
                    "Cannot set the parent category to the suspension category.",
                );
            }

            // check if the parent category is not the same as the current category
            if (newParentCategoryId === existingCategory.id) {
                throw new Error("A category cannot be its own parent.");
            }
        }

        let newOrder = existingCategory.order;
        if (existingCategory.parentCategoryId !== newParentCategoryId) {
            // Parent category changed, need to recalculate order
            if (newParentCategoryId != null) {
                const maxOrderResult =
                    await findTemplateCategoryMaxOrderByParentCategoryId(
                        newParentCategoryId,
                    );
                newOrder = maxOrderResult + 1;
            } else {
                // For root categories (no parent)
                const maxOrderResult =
                    await findTemplateCategoryMaxOrderByParentCategoryId(null);
                newOrder = maxOrderResult + 1;
            }
        }

        const inputData: TemplateCategoryInsertInput = {
            name: input.name,
            description: input.description,
            parentCategoryId: input.parentCategoryId,
            order: newOrder,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const [updatedCategory] = await db
            .update(templateCategories)
            .set(inputData)
            .where(eq(templateCategories.id, input.id))
            .returning();

        return updatedCategory;
    };

    export const deleteById = async (
        id: number,
    ): Promise<TemplateCategorySelectType> => {
        const existingCategory = await findById(id);

        if (!existingCategory) {
            throw new Error(`Category with ID ${id} does not exist.`);
        }

        // Prevent deletion of special categories
        if (existingCategory.specialType === "Main") {
            throw new Error("Cannot delete the main category.");
        } else if (existingCategory.specialType === "Suspension") {
            throw new Error("Cannot delete the suspension category.");
        }

        // Check if the category has sub-categories
        const subCategoryCountResult = await db
            .select({ count: count() })
            .from(templateCategories)
            .where(eq(templateCategories.parentCategoryId, id))
            .then((res) => res[0]);

        if (subCategoryCountResult.count > 0) {
            throw new Error(
                "Cannot delete category with existing sub-categories. Please remove or reassign sub-categories first.",
            );
        }

        // Check if the category has templates
        const templateCountResult = await db
            .select({ count: count() })
            .from(templates)
            .where(eq(templates.categoryId, id))
            .then((res) => res[0]);

        if (templateCountResult.count > 0) {
            throw new Error(
                "Cannot delete category with existing templates. Please remove or reassign templates first.",
            );
        }

        // Proceed to delete the category
        const [deletedCategory] = await db
            .delete(templateCategories)
            .where(eq(templateCategories.id, id))
            .returning();

        return deletedCategory;
    };

    export const findTemplateCategoryMaxOrderByParentCategoryId = async (
        categoryId: number | null,
    ): Promise<number> => {
        const [{ maxOrder }] = await db
            .select({ maxOrder: max(templateCategories.order) })
            .from(templateCategories)
            .where(
                categoryId === null
                    ? isNull(templateCategories.parentCategoryId)
                    : eq(templateCategories.parentCategoryId, categoryId),
            );
        return maxOrder ?? 0;
    };
}
