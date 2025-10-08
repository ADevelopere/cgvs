import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import {
    LoginInput,
    LoginResponse,
    RefreshTokenResponse,
    UserPothosDefintion,
} from "./auth.types";
import { UserRepository } from "./user.repository";

const UserPothosObjectRef =
    gqlSchemaBuilder.objectRef<UserPothosDefintion>("User");

// User type
export const UserPothosObject = gqlSchemaBuilder.loadableObject<
    UserPothosDefintion | Error, // LoadResult
    number, // Key
    [], // Interfaces
    typeof UserPothosObjectRef // NameOrRef
>(UserPothosObjectRef, {
    load: async (ids: number[]) => UserRepository.loadByIds(ids),
    sort: (user) => user.id,
    fields: (t) => ({
        id: t.exposeInt("id"),
        name: t.exposeString("name"),
        email: t.exposeString("email"),
        emailVerifiedAt: t.expose("emailVerifiedAt", {
            type: "DateTime",
            nullable: true,
        }),
        createdAt: t.expose("createdAt", { type: "DateTime" }),
        updatedAt: t.expose("updatedAt", { type: "DateTime" }),
    }),
});

// Login input
export const LoginInputPothosObject = gqlSchemaBuilder
    .inputRef<LoginInput>("LoginInput")
    .implement({
        fields: (t) => ({
            email: t.field({
                type: "Email",
                required: true,
            }),
            password: t.string({ required: true }),
        }),
    });

// Login response
export const LoginResponsePothosObject = gqlSchemaBuilder
    .objectRef<LoginResponse>("LoginResponse")
    .implement({
        fields: (t) => ({
            token: t.exposeString("token"),
            // user: t.expose("user", { type: UserPothosObject }),
            user: t.loadable({
                type: UserPothosObject,
                load: (ids: number[], ctx) =>
                    UserPothosObject.getDataloader(ctx).loadMany(ids),
                resolve: (loginResponse) => loginResponse.user.id,
            }),
        }),
    });

// Refresh token response
export const RefreshTokenResponsePothosObject = gqlSchemaBuilder
    .objectRef<RefreshTokenResponse>("RefreshTokenResponse")
    .implement({
        fields: (t) => ({
            token: t.exposeString("token"),
            user: t.loadable({
                type: UserPothosObject,
                load: (ids: number[], ctx) =>
                    UserPothosObject.getDataloader(ctx).loadMany(ids),
                resolve: (loginResponse) => loginResponse.user.id,
            }),
        }),
    });
