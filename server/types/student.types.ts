import { students } from "@/server/db/schema";
import { PageInfo } from "./pagination.types";
import { Email, PhoneNumber } from "@/server/lib";
import { CountryCode, Gender, OrderSortDirection } from "@/lib/enum";

export type StudentEntity = typeof students.$inferSelect;
export type StudentEntityInput = typeof students.$inferInsert;

export type StudentDto = {
    id: number;
    name: string;
    email?: string | null;
    phoneNumber?: PhoneNumber | null;
    dateOfBirth?: Date | null;
    gender?: Gender | null;
    nationality?: CountryCode | null;
    createdAt: Date;
    updatedAt: Date;
};


export type StudentCreateInput = {
    name: string;
    email?: Email | null;
    phoneNumber?: PhoneNumber | null;
    dateOfBirth?: Date | null;
    gender?: Gender | null;
    nationality?: CountryCode | null;
};

export type PartialStudentUpdateInput = {
    id: number;
    name?: string | null;
    email?: Email | null;
    phoneNumber?: PhoneNumber | null;
    dateOfBirth?: Date | null;
    gender?: Gender | null;
    nationality?: CountryCode | null;
};

export type StudentsWithFiltersResponse = {
    data: StudentDto[];
    pageInfo: PageInfo;
};

export type StudentFilterArgs = {
    name?: string | null;
    nameNotContains?: string | null;
    nameEquals?: string | null;
    nameNotEquals?: string | null;
    nameStartsWith?: string | null;
    nameEndsWith?: string | null;
    nameIsEmpty?: boolean | null;
    nameIsNotEmpty?: boolean | null;

    email?: string | null;
    emailNotContains?: string | null;
    emailEquals?: Email | null;
    emailNotEquals?: string | null;
    emailStartsWith?: string | null;
    emailEndsWith?: string | null;
    emailIsEmpty?: boolean | null;
    emailIsNotEmpty?: boolean | null;

    phoneNumber?: PhoneNumber | null;
    gender?: Gender | null;
    nationality?: CountryCode | null;

    createdAt?: Date | null;
    createdAtNot?: Date | null;
    createdAtFrom?: Date | null;
    createdAtTo?: Date | null;
    createdAtAfter?: Date | null;
    createdAtBefore?: Date | null;
    createdAtOnOrAfter?: Date | null;
    createdAtOnOrBefore?: Date | null;
    createdAtIsEmpty?: boolean | null;
    createdAtIsNotEmpty?: boolean | null;

    birthDate?: Date | null;
    birthDateNot?: Date | null;
    birthDateFrom?: Date | null;
    birthDateTo?: Date | null;
    birthDateAfter?: Date | null;
    birthDateBefore?: Date | null;
    birthDateOnOrAfter?: Date | null;
    birthDateOnOrBefore?: Date | null;
    birthDateIsEmpty?: boolean | null;
    birthDateIsNotEmpty?: boolean | null;
};

/**
 * Represents a clause for ordering student results.
 */
export type StudentsOrderByClause = {
    column: StudentsOrderByColumn;
    order?: OrderSortDirection | null;
};

export enum StudentsOrderByColumn {
    ID = "ID",
    NAME = "NAME",
    EMAIL = "EMAIL",
    DATE_OF_BIRTH = "DATE_OF_BIRTH",
    GENDER = "GENDER",
    CREATED_AT = "CREATED_AT",
    UPDATED_AT = "UPDATED_AT",
}
