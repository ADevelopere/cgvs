import { AppLanguage } from "@/lib/enum";
import { templateConfig } from "../db";

export type TemplateConfigEntity = typeof templateConfig.$inferSelect;
export type TemplateConfigInsert = typeof templateConfig.$inferInsert;

export type TemplateConfig = Omit<TemplateConfigEntity, "language"> & {
  language: AppLanguage;
};

export type TemplateConfigInput = Omit<
  TemplateConfigInsert,
  "id" | "language" | "createdAt" | "updatedAt"
> & {
  language: AppLanguage;
};

export type TemplateConfigUpdateInput = Omit<
  TemplateConfigInput,
  "templateId"
> & {
  id: number;
};
