import { db } from "@/db/db";
import { templates } from "@/db/schema";
import { count, eq, inArray } from "drizzle-orm";
import {
    PaginatedTemplatesResponse,
    TemplateDefinition,
    TemplateEntity,
} from "./template.types";
import logger from "@/utils/logger";
import { PaginationArgs } from "../pagintaion/pagintaion.types";
import { PaginationArgsDefault } from "../pagintaion/pagination.objects";

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
};

export const loadTemplatesByIds = async (
    ids: number[],
): Promise<(TemplateDefinition | Error)[]> => {
    if (ids.length === 0) return [];
    const filteredTemplates = await db
        .select()
        .from(templates)
        .where(inArray(templates.id, ids));

    const categories: (TemplateDefinition | Error)[] = ids.map((id) => {
        const matchingTemplate = filteredTemplates.find((c) => c.id === id);
        if (!matchingTemplate) return new Error(`Template ${id} not found`);
        return matchingTemplate;
    });
    return categories;
};

export const loadTemplatesForTemplateCategories = async (
    templateCategoryIds: number[],
): Promise<TemplateDefinition[][]> => {
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
