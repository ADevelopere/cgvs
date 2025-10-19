import { db } from "@/server/db/drizzleDb";
import { users } from "@/server/db/schema";
import { count, eq, inArray } from "drizzle-orm";
import logger from "@/lib/logger";
import {
  UserEntity,
  PaginatedUsersResponseSelectType,
  PaginationArgs,
  UserCreateInput,
} from "@/server/types";
import { PaginationArgsDefault } from "@/server/graphql/pothos";
import { AuthUtils } from "@/server/utils";
import bcrypt from "bcryptjs";

export namespace UserRepository {
  export const existsByEmail = async (email: string): Promise<boolean> => {
    return (await db.$count(users, eq(users.email, email))) > 0;
  };

  export const findUserByIdOrThrow = async (
    id: number
  ): Promise<UserEntity> => {
    try {
      return await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .then(res => {
          const t = res[0];
          if (!t) {
            throw new Error(`User with ID ${id} does not exist.`);
          }
          return t;
        });
    } catch (e) {
      logger.error("findUserByIdOrThrow error:", e);
      throw e;
    }
  };

  export const findById = async (id: number): Promise<UserEntity | null> => {
    try {
      return await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .then(res => {
          return res[0];
        });
    } catch {
      return null;
    }
  };

  export const findByEmail = async (
    email: string
  ): Promise<UserEntity | null> => {
    try {
      return await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .then(res => {
          return res[0];
        });
    } catch {
      return null;
    }
  };

  export const usersTotalCount = async (): Promise<number> => {
    const [{ total }] = await db.select({ total: count() }).from(users);
    return total;
  };

  export const findAll = async (): Promise<UserEntity[]> => {
    return await db.select().from(users);
  };

  export const findUsers = async (opts: {
    limit: number;
    offset: number;
  }): Promise<UserEntity[]> => {
    return await db
      .select()
      .from(users)
      .orderBy()
      .limit(opts.limit)
      .offset(opts.offset);
  };

  export const loadByIds = async (
    ids: number[]
  ): Promise<(UserEntity | Error)[]> => {
    if (ids.length === 0) return [];
    const filteredUsers = await db
      .select()
      .from(users)
      .where(inArray(users.id, ids));

    const userList: (UserEntity | Error)[] = ids.map(id => {
      const matchingUser = filteredUsers.find(c => c.id === id);
      if (!matchingUser) return new Error(`User ${id} not found`);
      return matchingUser;
    });
    return userList;
  };

  export const findUsersPaginated = async (
    paginationArgs?: PaginationArgs | null
  ): Promise<PaginatedUsersResponseSelectType> => {
    const { first, skip, page, maxCount } = paginationArgs ?? {};

    const total = await usersTotalCount();

    // Figure out pagination
    const perPage = Math.min(
      first ?? PaginationArgsDefault.first,
      maxCount ?? PaginationArgsDefault.maxCount
    );
    const currentPage = page ?? (skip ? Math.floor(skip / perPage) + 1 : 1);
    const offset = (currentPage - 1) * perPage;

    const users = await findUsers({
      limit: perPage,
      offset,
    });

    const length = users.length;
    const lastPage = Math.ceil(total / perPage);
    const hasMorePages = currentPage < lastPage;

    const result: PaginatedUsersResponseSelectType = {
      data: users,
      pageInfo: {
        count: length,
        currentPage,
        firstItem: length > 0 ? offset + 1 : null,
        lastItem: length > 0 ? offset + length : null,
        hasMorePages,
        lastPage,
        perPage,
        total,
      },
    };

    return result;
  };

  export const create = async (input: UserCreateInput): Promise<UserEntity> => {
    await existsByEmail(input.email.value).then(exists => {
      if (exists) {
        throw new Error(`User with email ${input.email.value} already exists`);
      }
    });

    AuthUtils.validateUserName(input.name);
    const now = new Date();
    const hashedPassword = await bcrypt.hash(input.password, 12);

    try {
      const [result] = await db
        .insert(users)
        .values({
          name: input.name,
          email: input.email.value,
          password: hashedPassword,
          emailVerifiedAt: now,
          rememberToken: null,
          createdAt: now,
          updatedAt: now,
        })
        .returning();
      return result;
    } catch (err) {
      logger.error(err);
      throw new Error(`Failed to create user with email: ${input.email.value}`);
    }
  };

  // export const updateUser = async (
  //     input: UserUpdateInput,
  // ): Promise<UserSelectType> => {
  //     const { id, name, email, password } = input;
  //     // Find existing user
  //     const existingUser = await findUserByIdOrThrow(id);
  //     validateUserName(existingUser.name);

  //     const updateData: Partial<UserInsertInput> = {
  //         name: name,
  //     };

  //     const [updatedUser] = await db
  //         .update(users)
  //         .set(updateData)
  //         .where(eq(users.id, id))
  //         .returning();

  //     return updatedUser;
  // };

  export const deleteUserById = async (id: number): Promise<UserEntity> => {
    const existingUser = await findUserByIdOrThrow(id);

    // Delete the user
    await db.delete(users).where(eq(users.id, id));

    // Return the user data as a simple object
    return existingUser;
  };
}
