import { schemaBuilder } from "../builder";
import {
    PaginatedTemplatesResponse,
    TemplateDefinition,
    TemplateCreateInput,
    TemplateUpdateInput,
} from "./template.types";
import { PageInfoObject } from "../pagintaion/pagination.objects";
import { TemplateCategoryObject } from "../templateCategory/templateCategory.objects";

const TemplateRef = schemaBuilder.objectRef<TemplateDefinition>("Template");

export const TemplateObject = TemplateRef.implement({
    fields: (t) => ({
        id: t.exposeID("id"),
        name: t.exposeString("name"),
        description: t.exposeString("description", { nullable: true }),
        order: t.exposeInt("order"),
        createdAt: t.expose("createdAt", { type: "DateTime" }),
        updatedAt: t.expose("updatedAt", { type: "DateTime" }),
        // relations
        // imageFile: FileInfo | null;
        category: t.loadable({
            type: TemplateCategoryObject,
            load: (ids: number[]) =>
                TemplateCategoryObject.getDataloader(ids).loadMany(ids),
            resolve: (root) => root.categoryId,
        }),
        preSuspensionCategory: t.loadable({
            type: TemplateCategoryObject,
            load: (ids: number[]) =>
                TemplateCategoryObject.getDataloader(ids).loadMany(ids),
            resolve: (root) => root.preSuspensionCategoryId,
        }),
        // variables
        // recipientGroups
        // driven
        // imageUrl: t.string({
        //     nullable: true,
        //     resolve: async ({ id: templateId }) => {
        //         const template = await findTemplateByIdOrThrow(templateId);
        //         if (template.imageFileId) {
        //             const file = await db
        //                 .select()
        //                 .from(storageFiles)
        //                 .where(eq(storageFiles.id, template.imageFileId))
        //                 .then((res) => res[0]);

        //             return file?.path || null;
        //         }
        //         return null;
        //     },
        // }),
    }),
});

const TemplateCreateInputRef = schemaBuilder.inputRef<TemplateCreateInput>(
    "TemplateCreateInput",
);

export const TemplateCreateInputObject = TemplateCreateInputRef.implement({
    fields: (t) => ({
        name: t.string({ required: true }),
        description: t.string({ required: false }),
        categoryId: t.int({ required: true }),
    }),
});

const TemplateUpdateInputRef = schemaBuilder.inputRef<TemplateUpdateInput>(
    "UpdateTemplateInput",
);

export const TemplateUpdateInputObject = TemplateUpdateInputRef.implement({
    fields: (t) => ({
        id: t.int({ required: true }),
        name: t.string({ required: false }),
        description: t.string({ required: false }),
        categoryId: t.int({ required: true }),
    }),
});

const PaginatedTemplatesResponseRef =
    schemaBuilder.objectRef<PaginatedTemplatesResponse>(
        "PaginatedTemplatesResponse",
    );

export const PaginatedTemplatesResponseObject =
    PaginatedTemplatesResponseRef.implement({
        fields: (t) => ({
            data: t.expose("data", { type: [TemplateObject] }),
            pageInfo: t.expose("pageInfo", { type: PageInfoObject }),
        }),
    });
