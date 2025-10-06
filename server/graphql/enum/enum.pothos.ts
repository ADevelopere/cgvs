import { OrderSortDirection, Gender, CountryCode } from "@/server/lib";
import { gqlSchemaBuilder } from "../gqlSchemaBuilder";

const OrderSortDirectionValues = Object.values(OrderSortDirection);
export const SortDirectionPothosObject = gqlSchemaBuilder.enumType(
    "SortDirection",
    {
        values: OrderSortDirectionValues,
    },
);

const GenderValues = Object.values(Gender);
export const GenderPothosObject = gqlSchemaBuilder.enumType("Gender", {
    values: GenderValues,
});

const CountryCodeValues = Object.values(CountryCode);
export const CountryCodePothosObject = gqlSchemaBuilder.enumType(
    "CountryCode",
    {
        values: CountryCodeValues,
    },
);
