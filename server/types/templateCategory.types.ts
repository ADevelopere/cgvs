import { templateCategories, templatecategorySpecialTypeEnum } from "@/server/db/schema";
import { TemplatePothosDefintion } from "@/server/types";

export type TemplateSpecialCategoryType = (typeof templatecategorySpecialTypeEnum.enumValues)[number];

export type TemplateCategorySelectType = typeof templateCategories.$inferSelect;
export type TemplateCategoryInsertInput = typeof templateCategories.$inferInsert;

export type TemplateCategoryPothosDefintion = TemplateCategorySelectType & {
  templates?: TemplatePothosDefintion[];
  parentCategory?: TemplateCategoryPothosDefintion | null;
  subCategories?: TemplateCategoryPothosDefintion[];
};

export type TemplateCategoryCreateInput = {
  name: string;
  description?: string | null | undefined;
  parentCategoryId?: number | null | undefined;
};

export type TemplateCategoryUpdateInput = {
  id: number;
  name: string;
  description?: string | null | undefined;
  parentCategoryId?: number | null | undefined;
};

export type TemplateCategoryWithParentTree = TemplateCategorySelectType & {
  parentTree: number[]; // [currentId, parentId, grandparentId, ...]
};
