import { db } from "@/db/db";
import { schemaBuilder } from "../builder";
import { TemplateCategory } from "./templateCategory.types";
import { templateCategories } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { TemplateSpecialCategoryType } from "./templateCategory.types";

export const TemplateCategoryObject = schemaBuilder.loadableObject<
    TemplateCategory | Error, // LoadResult
    number, // Key
    [], // Interfaces
    "TemplateCategory" // NameOrRef
>("TemplateCategory", {
    load: async (ids: number[]) => {
        const categories = await db
            .select()
            .from(templateCategories)
            .where(inArray(templateCategories.id, ids));

        return ids.map((id) => {
            const category = categories.find((c) => c.id === id);
            if (!category) return new Error(`TemplateCategory ${id} not found`);

            return {
                ...category,
                specialType:
                    category.specialType as TemplateSpecialCategoryType | null,
            };
        });
    },
    fields: (t) => ({
        id: t.exposeInt("id"),
        name: t.exposeString("name"),
        description: t.exposeString("description", { nullable: true }),
        order: t.exposeInt("order", { nullable: true }),
        specialType: t.exposeString("specialType", { nullable: true }),
        createdAt: t.expose("createdAt", { type: "DateTime" }),
        updatedAt: t.expose("updatedAt", { type: "DateTime" }),
    }),
});
