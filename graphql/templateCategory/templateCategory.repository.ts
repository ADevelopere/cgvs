import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { templateCategories } from "@/db/schema";

export const findTemplateCategoryById = async (id?: number) => {
    if (!id) return null;
    const category = await db
        .select()
        .from(templateCategories)
        .where(eq(templateCategories.id, id))
        .then((res) => res[0]);
    return category || null;
};
