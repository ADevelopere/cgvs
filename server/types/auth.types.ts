import {
  users,
  roles,
  userRoles,
  sessions,
  passwordResetTokens,
} from "@/server/db/schema";
import { PageInfo } from "./pagination.types";
import { Email } from "@/server/lib/email";

export type UserEntity = typeof users.$inferSelect;
export type UserEntityInput = typeof users.$inferInsert;

export type UserPothosDefintion = UserEntity & {
  roles?: RolePothosDefintion[];
  userRoles?: UserRolePothosDefintion[];
  sessions?: SessionPothosDefintion[];
};

export type UserCreateInput = {
  name: string;
  email: Email;
  password: string;
};

export type UserUpdateInput = {
  id: number;
  name: string;
  email: Email;
  password: string;
};

export type PaginatedUsersResponseSelectType = {
  data: UserEntity[];
  pageInfo: PageInfo;
};

export type PaginatedUsersResponse = {
  data: UserPothosDefintion[];
  pageInfo: PageInfo;
};

// roles
export type RoleEntity = typeof userRoles.$inferSelect;
export type RoleEntityInput = typeof userRoles.$inferInsert;

export type RolePothosDefintion = RoleEntity & {
  users: UserPothosDefintion[];
  userRoles?: UserRolePothosDefintion[];
};

// user roles
export type UserRoleEntity = typeof roles.$inferSelect;
export type UserRoleEntityInput = typeof roles.$inferInsert;

export type UserRolePothosDefintion = UserRoleEntity & {
  user?: UserPothosDefintion;
  role?: RolePothosDefintion;
};

// sessions
export type SessionEntity = typeof sessions.$inferSelect;
export type SessionEntityInput = typeof sessions.$inferInsert;

export type SessionPothosDefintion = SessionEntity & {
  user?: UserPothosDefintion;
};

// password reset tokens
export type PasswordResetTokenSelectType =
  typeof passwordResetTokens.$inferSelect;
export type PasswordResetTokenInsertInput =
  typeof passwordResetTokens.$inferInsert;

export type PasswordResetTokenPothosDefintion = PasswordResetTokenSelectType;

// login
export type LoginInput = {
  email: Email;
  password: string;
};

export type LoginResponse = {
  user: UserPothosDefintion;
  token: string;
};

export type RefreshTokenResponse = {
  token: string;
  user: UserPothosDefintion;
};
