import {
    users,
    roles,
    userRoles,
    sessions,
    passwordResetTokens,
} from "@/server/db/schema";
import { OmitIdRelationFields } from "../gqlHelper";
import { PageInfo } from "../pagintaion/pagintaion.types";

export type UserSelectType = typeof users.$inferSelect;
export type UserInsertInput = typeof users.$inferInsert;

export type UserPothosDefintion = UserSelectType & {
    roles?: RolePothosDefintion[];
    userRoles?: UserRolePothosDefintion[];
    sessions?: SessionsPothosDefintion[];
};

export type User = OmitIdRelationFields<UserPothosDefintion>;

export type UserCreateInput = {
    name: string;
    email: string;
    password: string;
};

export type UserUpdateInput = {
    id: number;
    name: string;
    email: string;
    password: string;
};

export type PaginatedUsersResponseSelectType = {
    data: UserSelectType[];
    pageInfo: PageInfo;
};

export type PaginatedUsersResponse = {
    data: UserPothosDefintion[];
    pageInfo: PageInfo;
};

// roles
export type RoleSelectType = typeof userRoles.$inferSelect;
export type RoleInsertInput = typeof userRoles.$inferInsert;

export type RolePothosDefintion = RoleSelectType & {
    users: UserPothosDefintion[];
    userRoles?: UserRolePothosDefintion[];
};

export type Role = OmitIdRelationFields<RolePothosDefintion>;

// user roles
export type UserRoleSelectType = typeof roles.$inferSelect;
export type UserRoleInsertInput = typeof roles.$inferInsert;

export type UserRolePothosDefintion = UserRoleSelectType & {
    user?: UserPothosDefintion;
    role?: RolePothosDefintion;
};

export type UserRole = OmitIdRelationFields<UserRolePothosDefintion>;

// sessions
export type SessionsSelectType = typeof sessions.$inferSelect;
export type SessionsInsertInput = typeof sessions.$inferInsert;

export type SessionsPothosDefintion = SessionsSelectType & {
    user?: UserPothosDefintion;
};

export type Session = OmitIdRelationFields<SessionsPothosDefintion>;

// password reset tokens
export type PasswordResetTokenSelectType =
    typeof passwordResetTokens.$inferSelect;
export type PasswordResetTokenInsertInput =
    typeof passwordResetTokens.$inferInsert;

export type PasswordResetTokenPothosDefintion = PasswordResetTokenSelectType;

export type PasswordResetToken =
    OmitIdRelationFields<PasswordResetTokenPothosDefintion>;

// login
export type LoginInput = {
    email: string;
    password: string;
};

export type LoginResponse = {
    user: UserPothosDefintion;
    token: string;
    refreshToken: string;
};

export type RefreshTokenResponse = {
    token: string;
    user: UserPothosDefintion;
};
