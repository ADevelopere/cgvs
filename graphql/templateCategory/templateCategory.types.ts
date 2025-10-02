import {
    templateCategories,
    templatecategorySpecialTypeEnum,
} from "@/db/schema";
import { TemplateDefinition } from "../template/template.types";

export type TemplateSpecialCategoryType =
    (typeof templatecategorySpecialTypeEnum.enumValues)[number];

export type TemplateCategoryEntity = typeof templateCategories.$inferSelect;
export type TemplateCategoryInput = typeof templateCategories.$inferInsert;

export type TemplateCategory = TemplateCategoryEntity & {
    templates?: TemplateDefinition[];
    // parentCategory: TemplateCategory | null;
    // subCategories: TemplateCategory[];
};

export type TemplateCategoryCreateInput = {
    name: string;
    description?: string | null;
    parentCategoryId?: number | null;
};

export type TemplateCategoryUpdateInput = {
    id: number;
    name?: string;
    description?: string | null;
    parentCategoryId?: number | null;
};
