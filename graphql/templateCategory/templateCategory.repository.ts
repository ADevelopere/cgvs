import { db } from "@/db/db";
import { eq, inArray } from "drizzle-orm";
import { templateCategories } from "@/db/schema";
import { TemplateCategory } from "./templateCategory.types";

export const findTemplateCategoryById = async (id?: number) => {
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
