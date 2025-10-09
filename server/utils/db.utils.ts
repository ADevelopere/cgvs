import { pgEnum } from "drizzle-orm/pg-core";

export function createPgEnumFromEnum<T extends Record<string, string>>(
    enumName: string,
    enumObject: T,
) {
    return pgEnum(enumName, Object.values(enumObject) as [string, ...string[]]);
}
