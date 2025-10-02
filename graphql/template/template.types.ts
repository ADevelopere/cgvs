import { FileInfo } from "@/services/storage.types";
import { TemplateCategoryPothosDefintion } from "../templateCategory/templateCategory.types";
import { PageInfo } from "../pagintaion/pagintaion.types";
import { templates } from "@/db/schema";
import { OmitIdRelationFields } from "../helper";

export type TemplateSelectType = typeof templates.$inferSelect;
export type TemplateInsertInput = typeof templates.$inferInsert;

export type TemplatePothosDefintion = TemplateSelectType & {
    //relations
    category?: TemplateCategoryPothosDefintion;
    imageFile?: FileInfo | null;
    preSuspensionCategory?: TemplateCategoryPothosDefintion | null;
    // variables
    // recipientGroups
    // driven
    imageUrl?: string | null;
};

export type Template = OmitIdRelationFields<TemplatePothosDefintion>;

export type TemplateCreateInput = {
    name: string;
    description?: string | null;
    categoryId: number;
};

export type TemplateUpdateInput = {
    id: number;
    name: string;
    categoryId: number;
    description?: string | null;
    imagePath?: bigint | null;
};

export type PaginatedTemplatesResponseSelectType = {
    data: TemplateSelectType[];
    pageInfo: PageInfo;
};

export type PaginatedTemplatesResponse = {
    data: TemplatePothosDefintion[];
    pageInfo: PageInfo;
};
