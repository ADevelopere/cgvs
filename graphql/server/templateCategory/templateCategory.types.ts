import {
    templateCategories,
    templatecategorySpecialTypeEnum,
} from "@/db/schema";
import { TemplatePothosDefintion } from "../template/template.types";
import { OmitIdRelationFields } from "../gqlHelper";

export type TemplateSpecialCategoryType =
    (typeof templatecategorySpecialTypeEnum.enumValues)[number];

export type TemplateCategorySelectType = typeof templateCategories.$inferSelect;
export type TemplateCategoryInsertInput =
    typeof templateCategories.$inferInsert;

export type TemplateCategoryPothosDefintion = TemplateCategorySelectType & {
    templates?: TemplatePothosDefintion[];
    parentCategory?: TemplateCategoryPothosDefintion | null;
    subCategories?: TemplateCategoryPothosDefintion[];
};

export type TemplateCategory =
    OmitIdRelationFields<TemplateCategoryPothosDefintion>;

export type TemplateCategoryCreateInput = {
    name: string;
    description?: string | null;
    parentCategoryId?: number | null;
};

export type TemplateCategoryUpdateInput = {
    id: number;
    name: string;
    description?: string | null;
    parentCategoryId?: number | null;
};
