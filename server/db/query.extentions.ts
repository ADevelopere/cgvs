import { PgSelect } from "drizzle-orm/pg-core";
import { PaginationArgs } from "../graphql/pagintaion/pagintaion.types";

export function queryWithPagination<T extends PgSelect>(
    qb: T,
    args: PaginationArgs | null,
) {
    if (!args) return qb;
    return qb.limit(args.perPage).offset(args.offset);
}
