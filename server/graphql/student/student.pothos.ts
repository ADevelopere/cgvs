import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import * as StTypes from "./student.types";
import { PageInfoObject } from "../pagintaion/pagination.objects";
import { loadStudetnsByIds } from "./student.repository";
import {
    CountryCodePothosObject,
    GenderPothosObject,
} from "../enum/enum.pothos";

export const StudentPothosObject = gqlSchemaBuilder
    .loadableObjectRef<StTypes.StudentPothosDefintion, number>("Student", {
        load: async (ids: number[]) => loadStudetnsByIds(ids),
        sort: (s) => s.id,
    })
    .implement({
        fields: (t) => ({
            id: t.exposeInt("id", { nullable: false }),
            name: t.exposeString("name", { nullable: false }),
            email: t.expose("email", {
                type: "Email",
                nullable: true,
            }),
            PhoneNumber: t.expose("phoneNumber", {
                type: "PhoneNumber",
                nullable: true,
            }),
            gender: t.field({
                type: GenderPothosObject,
                nullable: true,
                resolve: (s) => s.gender,
            }),
            dateOfBirth: t.expose("dateOfBirth", {
                type: "DateTime",
                nullable: true,
            }),

            nationality: t.field({
                type: CountryCodePothosObject,
                nullable: true,
                resolve: (s) => s.nationality,
            }),

            createdAt: t.expose("createdAt", {
                type: "DateTime",
                nullable: false,
            }),
            updatedAt: t.expose("updatedAt", {
                type: "DateTime",
                nullable: false,
            }),
        }),
    });

export const StudentCreateInputPothosObject = gqlSchemaBuilder
    .inputRef<StTypes.StudentCreateInput>("StudentCreateInput")
    .implement({
        fields: (t) => ({
            name: t.string({ required: true }),
            email: t.field({
                type: "Email",
                required: false,
            }),
            phoneNumber: t.field({
                type: "PhoneNumber",
                required: false,
            }),
            dateOfBirth: t.field({
                type: "DateTime",
                required: false,
            }),
            gender: t.field({
                type: GenderPothosObject,
                required: false,
            }),
            nationality: t.field({
                type: CountryCodePothosObject,
                required: false,
            }),
        }),
    });

export const PartialStudentUpdateInputPothosObject = gqlSchemaBuilder
    .inputRef<StTypes.PartialStudentUpdateInput>("PartialStudentUpdateInput")
    .implement({
        fields: (t) => ({
            id: t.int({ required: true }),
            name: t.string({ required: true }),
            email: t.field({
                type: "Email",
                required: false,
            }),
            phoneNumber: t.field({
                type: "PhoneNumber",
                required: false,
            }),
            dateOfBirth: t.field({
                type: "DateTime",
                required: false,
            }),
            gender: t.field({
                type: GenderPothosObject,
                required: false,
            }),
            nationality: t.field({
                type: CountryCodePothosObject,
                required: false,
            }),
        }),
    });

export const StudentsWithFiltersPothosObject = gqlSchemaBuilder
    .objectRef<StTypes.StudentsWithFiltersResponse>(
        "PaginatedTemplatesResponse",
    )
    .implement({
        fields: (t) => ({
            data: t.expose("data", { type: [StudentPothosObject] }),
            pageInfo: t.expose("pageInfo", { type: PageInfoObject }),
        }),
    });

export const StudentFilterArgsPothosObject = gqlSchemaBuilder
    .inputRef<StTypes.StudentFilterArgs>("StudentFilterArgs")
    .implement({
        fields: (t) => ({
            name: t.string(),
            nameNotContains: t.string(),
            nameEquals: t.string(),
            nameNotEquals: t.string(),
            nameStartsWith: t.string(),
            nameEndsWith: t.string(),
            nameIsEmpty: t.boolean(),
            nameIsNotEmpty: t.boolean(),

            email: t.string(),
            emailNotContains: t.string(),
            emailEquals: t.field({ type: "Email" }),
            emailNotEquals: t.string(),
            emailStartsWith: t.string(),
            emailEndsWith: t.string(),
            emailIsEmpty: t.boolean(),
            emailIsNotEmpty: t.boolean(),

            phoneNumber: t.field({ type: "PhoneNumber" }),
            gender: t.field({ type: GenderPothosObject }),
            nationality: t.field({ type: CountryCodePothosObject }),

            createdAt: t.field({ type: "DateTime" }),
            createdAtNot: t.field({ type: "DateTime" }),
            createdAtFrom: t.field({ type: "DateTime" }),
            createdAtTo: t.field({ type: "DateTime" }),
            createdAtAfter: t.field({ type: "DateTime" }),
            createdAtBefore: t.field({ type: "DateTime" }),
            createdAtOnOrAfter: t.field({ type: "DateTime" }),
            createdAtOnOrBefore: t.field({ type: "DateTime" }),
            createdAtIsEmpty: t.boolean(),
            createdAtIsNotEmpty: t.boolean(),

            birthDate: t.field({ type: "DateTime" }),
            birthDateNot: t.field({ type: "DateTime" }),
            birthDateFrom: t.field({ type: "DateTime" }),
            birthDateTo: t.field({ type: "DateTime" }),
            birthDateAfter: t.field({ type: "DateTime" }),
            birthDateBefore: t.field({ type: "DateTime" }),
            birthDateOnOrAfter: t.field({ type: "DateTime" }),
            birthDateOnOrBefore: t.field({ type: "DateTime" }),
            birthDateIsEmpty: t.boolean(),
            birthDateIsNotEmpty: t.boolean(),
        }),
    });
