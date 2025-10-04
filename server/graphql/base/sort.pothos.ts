import { gqlSchemaBuilder } from "../gqlSchemaBuilder";

export enum SortDirectionServerType {
    ASC = "ASC",
    DESC = "DESC",
}

const SortDirectionValues = Object.values(SortDirectionServerType);

export const SortDirectionPothosObject = gqlSchemaBuilder.enumType(
    "SortDirection",
    {
        values: SortDirectionValues,
    },
);