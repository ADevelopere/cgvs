import { db } from "@/db/db";
import { eq, inArray } from "drizzle-orm";
import { templateCategories } from "@/db/schema";
import { TemplateCategory } from "./templateCategory.types";

export const findTemplateCategoryById = async (id?: number | null) => {
    if (!id) return null;
    const category = await db
        .select()
        .from(templateCategories)
        .where(eq(templateCategories.id, id))
        .then((res) => res[0]);
    return category || null;
};

export const loadTemplateCategoriesByIds = async (
    ids: number[],
): Promise<(TemplateCategory | Error)[]> => {
    if (ids.length === 0) return [];
    const filteredCategories = await db
        .select()
        .from(templateCategories)
        .where(inArray(templateCategories.id, ids));

    const categories: (TemplateCategory | Error)[] = ids.map((id) => {
        const matchingCategory = filteredCategories.find((c) => c.id === id);
        if (!matchingCategory)
            return new Error(`TemplateCategory ${id} not found`);
        return matchingCategory;
    });
    return categories;
};

export const loadSubTemplateCategoriesForCategories = async (
    parentCategoryIds: number[],
): Promise<TemplateCategory[][]> => {
    if (parentCategoryIds.length === 0) return [];
    const subCategories = await db
        .select()
        .from(templateCategories)
        .where(inArray(templateCategories.parentCategoryId, parentCategoryIds))
        .orderBy(templateCategories.order);

    return parentCategoryIds.map((parentId) =>
        subCategories.filter((cat) => cat.parentCategoryId === parentId),
    );
};

export const findMainTemplateCategory = async (): Promise<TemplateCategory> => {
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

export const findSuspensionTemplateCategory =
    async (): Promise<TemplateCategory> => {
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
