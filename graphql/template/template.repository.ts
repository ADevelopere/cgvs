import { db } from "@/db/db";
import { templates } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import { TemplateEntity } from "./template.types";
import logger from "@/utils/logger";

export const findTemplateByIdOrThrow = async (
    id: number,
): Promise<TemplateEntity> => {
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
}): Promise<TemplateEntity[]> => {
    return await db
        .select()
        .from(templates)
        .orderBy()
        .limit(opts.limit)
        .offset(opts.offset);
}