import { CountryCode } from "@/lib/enum";
import { templateConfig } from "../db";

export type TemplateConfigEntity = typeof templateConfig.$inferSelect;
export type TemplateConfigInsert = typeof templateConfig.$inferInsert;

export type TemplateConfig = Omit<TemplateConfigEntity, "locale"> & {
  locale: CountryCode;
};

export type TemplateConfigInput = Omit<
  TemplateConfigInsert,
  "id" | "locale" | "createdAt" | "updatedAt"
> & {
  locale: CountryCode;
};

export type TemplateConfigUpdateInput = Omit<
  TemplateConfigInput,
  "templateId"
> & {
  id: number;
};
