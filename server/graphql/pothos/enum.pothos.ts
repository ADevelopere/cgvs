import { OrderSortDirection, Gender, CountryCode, AppLanguage } from "@/lib/enum";
import { gqlSchemaBuilder } from "../gqlSchemaBuilder";

export const OrderSortDirectionPothosObject = gqlSchemaBuilder.enumType(
  "OrderSortDirection",
  {
    values: Object.values(OrderSortDirection),
  }
);

export const GenderPothosObject = gqlSchemaBuilder.enumType("Gender", {
  values: Object.values(Gender),
});

export const CountryCodePothosObject = gqlSchemaBuilder.enumType(
  "CountryCode",
  {
    values: Object.values(CountryCode),
  }
);

export const AppLanguagePothosObject = gqlSchemaBuilder.enumType(
  "AppLanguage",
  {
    values: Object.values(AppLanguage),
  }
);
