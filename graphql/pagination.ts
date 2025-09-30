import { schemaBuilder } from "./builder";

export const PaginationInfo = schemaBuilder.simpleObject("PaginationInfo", {
    fields: (t) => ({
        count: t.int(),
        currentPage: t.int(),
        firstItem: t.int({ nullable: true }),
        hasMorePages: t.boolean(),
        lastItem: t.int({ nullable: true }),
        lastPage: t.int(),
        perPage: t.int(),
        total: t.int(),
    }),
});

export const PaginationArgsDefault = {
    first: 10,
    maxCount: 100,
};

export const PaginationArgs = schemaBuilder.inputType("PaginationArgs", {
    fields: (t) => ({
        first: t.int({ defaultValue: PaginationArgsDefault.first }),
        skip: t.int(),
        last: t.int(),
        page: t.int(),
        maxCount: t.int({ defaultValue: PaginationArgsDefault.maxCount }),
    }),
});
