import { FileInfo } from "@/services/storage.types";
import { TemplateCategory } from "../templateCategory/templateCategory.types";
import { PageInfo } from "../pagintaion/pagintaion.types";
import { templates } from "@/db/schema";
import { OmitIdRelationFields } from "../helper";

export type TemplateEntity = typeof templates.$inferSelect;
export type TemplateInput = typeof templates.$inferInsert;

export type TemplateDefinition = TemplateEntity & {
    //relations
    category?: TemplateCategory;
    imageFile?: FileInfo | null;
    preSuspensionCategory?: TemplateCategory | null;
    // variables
    // recipientGroups
    // driven
    imageUrl?: string | null;
};

export type Template = OmitIdRelationFields<TemplateDefinition>;

export type TemplateCreateInput = {
    name: string;
    description?: string | null;
    categoryId: number;
};

export type TemplateUpdateInput = {
    id: number;
    name?: string;
    description?: string | null;
    categoryId?: number;
    imagePath?: bigint | null;
};

export type PaginatedTemplatesResponse = {
    data: TemplateDefinition[];
    pageInfo: PageInfo;
};
