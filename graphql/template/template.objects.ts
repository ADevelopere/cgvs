import { schemaBuilder } from "../builder";
import {
    PaginatedTemplatesResponse,
    TemplatePothosDefintion,
    TemplateCreateInput,
    TemplateUpdateInput,
} from "./template.types";
import { PageInfoObject } from "../pagintaion/pagination.objects";
import { TemplateCategoryObject } from "../templateCategory/templateCategory.objects";
import { loadTemplatesByIds } from "./template.repository";

const TemplateObjectRef = schemaBuilder.loadableObjectRef<
    TemplatePothosDefintion,
    number
>("Template", {
    load: async (ids: number[]) => loadTemplatesByIds(ids),
    sort: (t) => t.id,
});

export const TemplatePothosObject = TemplateObjectRef.implement({
    fields: (t) => ({
        id: t.exposeID("id"),
        name: t.exposeString("name"),
        description: t.exposeString("description", { nullable: true }),
        order: t.exposeInt("order"),
        createdAt: t.expose("createdAt", { type: "DateTime" }),
        updatedAt: t.expose("updatedAt", { type: "DateTime" }),
        // relations
        // imageFile: FileInfo | null;
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

schemaBuilder.objectFields(TemplatePothosObject, (t) => ({
    category: t.loadable({
        type: TemplateCategoryObject,
        load: (ids: number[]) =>
            TemplateCategoryObject.getDataloader(ids).loadMany(ids),
        resolve: (template) => template.categoryId,
    }),
    preSuspensionCategory: t.loadable({
        type: TemplateCategoryObject,
        load: (ids: number[]) =>
            TemplateCategoryObject.getDataloader(ids).loadMany(ids),
        resolve: (template) => template.preSuspensionCategoryId,
    }),
}));

const TemplateCreateInputRef = schemaBuilder.inputRef<TemplateCreateInput>(
    "TemplateCreateInput",
);

export const TemplateCreateInputPothosObject = TemplateCreateInputRef.implement({
    fields: (t) => ({
        name: t.string({ required: true }),
        description: t.string({ required: false }),
        categoryId: t.int({ required: true }),
    }),
});

const TemplateUpdateInputRef = schemaBuilder.inputRef<TemplateUpdateInput>(
    "UpdateTemplateInput",
);

export const TemplateUpdateInputPothosObject = TemplateUpdateInputRef.implement({
    fields: (t) => ({
        id: t.int({ required: true }),
        name: t.string({ required: true }),
        categoryId: t.int({ required: true }),
        description: t.string({ required: false }),
    }),
});

const PaginatedTemplatesResponseRef =
    schemaBuilder.objectRef<PaginatedTemplatesResponse>(
        "PaginatedTemplatesResponse",
    );

export const PaginatedTemplatesResponsePothosObject =
    PaginatedTemplatesResponseRef.implement({
        fields: (t) => ({
            data: t.expose("data", { type: [TemplatePothosObject] }),
            pageInfo: t.expose("pageInfo", { type: PageInfoObject }),
        }),
    });
