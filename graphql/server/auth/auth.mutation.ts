import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import { db } from "@/db/drizzleDb";
import { sessions } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import { comparePassword } from "@/graphql/server/auth/password";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
} from "@/graphql/server/auth/jwt";
import { GraphQLError } from "graphql";
import { randomUUID } from "crypto";
import {
    LoginInputPothosObject,
    LoginResponsePothosObject,
    RefreshTokenResponsePothosObject,
} from "./auth.pothos";
import { UserSelectType } from "./auth.types";
import logger from "@/utils/logger";

gqlSchemaBuilder.mutationFields((t) => ({
    login: t.field({
        type: LoginResponsePothosObject,
        args: {
            input: t.arg({ type: LoginInputPothosObject, required: true }),
        },
        resolve: async (_parent, args) => {
            const { email, password } = args.input;

            let user: UserSelectType | undefined;
            try {
                user = await db.query.users.findFirst({
                    where: {
                        email,
                    },
                });
            } catch (err) {
                logger.error(err);
                return null;
            }

            if (!user) {
                throw new GraphQLError("Invalid email or password", {
                    extensions: { code: "INVALID_CREDENTIALS" },
                });
            }

            // Verify password
            const isPasswordValid = await comparePassword(
                password,
                user.password,
            );

            if (!isPasswordValid) {
                throw new GraphQLError("Invalid email or password", {
                    extensions: { code: "INVALID_CREDENTIALS" },
                });
            }

            // Generate tokens
            const accessToken = await generateAccessToken(user.id, user.email);
            const refreshToken = await generateRefreshToken(
                user.id,
                user.email,
            );

            // Store session in database
            const sessionId = randomUUID();
            await db.insert(sessions).values({
                id: sessionId,
                userId: user.id,
                payload: JSON.stringify({ refreshToken }),
                lastActivity: Math.floor(Date.now() / 1000),
            });

            return {
                token: accessToken,
                refreshToken,
                user,
            };
        },
    }),

    refreshToken: t.field({
        type: RefreshTokenResponsePothosObject,
        resolve: async (_parent, _args, ctx) => {
            // Try to get refresh token from context (it should be passed by the client)
            const refreshToken = ctx.refreshToken;

            if (!refreshToken) {
                throw new GraphQLError("Refresh token not provided", {
                    extensions: { code: "UNAUTHENTICATED" },
                });
            }

            // Verify refresh token
            const payload = await verifyToken(refreshToken);

            if (!payload || payload.type !== "refresh") {
                throw new GraphQLError("Invalid refresh token", {
                    extensions: { code: "INVALID_TOKEN" },
                });
            }

            // Find user
            const user = await db.query.users.findFirst({
                where: {
                    id: payload.userId,
                },
            });

            if (!user) {
                throw new GraphQLError("User not found", {
                    extensions: { code: "USER_NOT_FOUND" },
                });
            }

            // Verify session exists
            const session = await db.query.sessions.findFirst({
                where: {
                    userId: user.id,
                },
            });

            if (!session) {
                throw new GraphQLError("Session not found", {
                    extensions: { code: "SESSION_NOT_FOUND" },
                });
            }

            // Generate new access token
            const newAccessToken = await generateAccessToken(
                user.id,
                user.email,
            );

            // Update session activity
            await db
                .update(sessions)
                .set({ lastActivity: Math.floor(Date.now() / 1000) })
                .where(eq(sessions.id, session.id));

            return {
                token: newAccessToken,
                user,
            };
        },
    }),

    logout: t.field({
        type: "Boolean",
        authScopes: {
            loggedIn: true,
        },
        resolve: async (parent, args, ctx) => {
            if (!ctx.user) {
                return false;
            }

            // Delete all sessions for the user
            await db.delete(sessions).where(eq(sessions.userId, ctx.user.id));

            return true;
        },
    }),
}));
