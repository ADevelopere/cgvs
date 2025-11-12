import { TemplateCategoryPothosDefintion } from "./templateCategory.types";
import { PageInfo } from "./pagination.types";
import { templates, templatesConfigs, templatesConfigsKeyEnum } from "@/server/db/schema";
import { OrderSortDirection } from "@/lib/enum";

export type TemplateEntity = typeof templates.$inferSelect;
export type TemplateEntityInput = typeof templates.$inferInsert;

export type TemplatePothosDefintion = TemplateEntity & {
  //relations
  category?: TemplateCategoryPothosDefintion;
  // imageFile?: FileInfo | null;
  preSuspensionCategory?: TemplateCategoryPothosDefintion | null;
  // variables
  // recipientGroups
  // driven
  imageUrl?: string | null;
};

export type TemplateCreateInput = {
  name: string;
  description?: string | null | undefined;
  categoryId: number;
};

export type TemplateUpdateInput = {
  id: number;
  name: string;
  categoryId: number;
  description?: string | null | undefined;
  imagePath?: string | null | undefined;
};

export type PaginatedTemplatesEntityResponse = {
  data: TemplateEntity[];
  pageInfo: PageInfo;
};

export type PaginatedTemplatesResponse = {
  data: TemplatePothosDefintion[];
  pageInfo: PageInfo;
};

export type TemplatesConfigsKey = (typeof templatesConfigsKeyEnum.enumValues)[number];
export const TemplatesConfigsKeyValues = templatesConfigsKeyEnum.enumValues;

export type TemplatesConfigSelectType = typeof templatesConfigs.$inferSelect;
export type TemplatesCongigInsertInput = typeof templatesConfigs.$inferInsert;
export type TemplatesConfigPothosDefinition = TemplatesConfigSelectType;

export type TemplatesConfigsPothosDefinition = {
  configs: TemplatesConfigSelectType[];
};

export type TemplatesWithFiltersResponse = {
  data: TemplatePothosDefintion[];
  pageInfo: PageInfo;
};

export type TemplateFilterArgs = {
  name?: string | null | undefined;
};

/**
 * Represents a clause for ordering template results.
 */
export type TemplatesOrderByClause = {
  column: TemplatesOrderByColumn;
  order?: OrderSortDirection | null | undefined;
};

export enum TemplatesOrderByColumn {
  NAME = "NAME",
  ORDER = "ORDER",
  CREATED_AT = "CREATED_AT",
  UPDATED_AT = "UPDATED_AT",
}
