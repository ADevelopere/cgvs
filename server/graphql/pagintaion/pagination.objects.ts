import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import { PageInfo } from "./pagintaion.types";

const PageInfoRef = gqlSchemaBuilder.objectRef<PageInfo>("PageInfo");

export const PageInfoObject = PageInfoRef.implement({
    fields: (t) => ({
        count: t.exposeInt("count"),
        currentPage: t.exposeInt("currentPage"),
        firstItem: t.exposeInt("firstItem", { nullable: true }),
        hasMorePages: t.exposeBoolean("hasMorePages"),
        lastItem: t.exposeInt("lastItem", { nullable: true }),
        lastPage: t.exposeInt("lastPage"),
        perPage: t.exposeInt("perPage"),
        total: t.exposeInt("total"),
    }),
});

export const PaginationArgsDefault = {
    first: 10,
    maxCount: 100,
};

type PaginationArgs = {
    first: number | null;
    skip: number | null;
    last: number | null;
    page: number | null;
    maxCount: number | null;
};

const PaginationArgsRef =
    gqlSchemaBuilder.inputRef<PaginationArgs>("PaginationArgs");

export const PaginationArgsObject = PaginationArgsRef.implement({
    fields: (t) => ({
        first: t.int({ defaultValue: PaginationArgsDefault.first }),
        skip: t.int(),
        last: t.int(),
        page: t.int(),
        maxCount: t.int({ defaultValue: PaginationArgsDefault.maxCount }),
    }),
});
