import { OrderSortDirection, Gender, CountryCode, AppLanguage } from "@/lib/enum";
import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import { FontFamily } from "@/lib/font/google";

export const OrderSortDirectionPothosObject = gqlSchemaBuilder.enumType(OrderSortDirection, {
  name: "OrderSortDirection",
});

export const GenderPothosObject = gqlSchemaBuilder.enumType(Gender, {
  name: "Gender",
});

export const CountryCodePothosObject = gqlSchemaBuilder.enumType(CountryCode, {
  name: "CountryCode",
});

export const AppLanguagePothosObject = gqlSchemaBuilder.enumType(AppLanguage, {
  name: "AppLanguage",
});

export const FontFamilyPothosObject = gqlSchemaBuilder.enumType(FontFamily, {
  name: "FontFamilyName",
});
