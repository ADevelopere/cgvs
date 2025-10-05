import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import { comparePassword } from "@/server/graphql/auth/password";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
} from "@/server/graphql/auth/jwt";
import { GraphQLError } from "graphql";
import { randomUUID } from "crypto";
import {
    LoginInputPothosObject,
    LoginResponsePothosObject,
    RefreshTokenResponsePothosObject,
} from "./auth.pothos";
import { UserEntity, SessionEntity } from "./auth.types";
import { createSession, validateSession, deleteSessionsByUserId, updateSession, findSessionByUserId } from "./session.repository";
import { findUserByEmail, findUserById } from "./user.repository";
import logger from "@/utils/logger";

gqlSchemaBuilder.mutationFields((t) => ({
    login: t.field({
        type: LoginResponsePothosObject,
        args: {
            input: t.arg({ type: LoginInputPothosObject, required: true }),
        },
        resolve: async (_parent, args) => {
            const { email, password } = args.input;

            let user: UserEntity | null;
            try {
                user = await findUserByEmail(email);
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

            // Create session in database
            const sessionId = randomUUID();
            await createSession({
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
            // Try to get session ID from context (from cookie)
            const sessionId = ctx.sessionId;
            const refreshToken = ctx.refreshToken;

            if (!sessionId && !refreshToken) {
                throw new GraphQLError("No authentication session found", {
                    extensions: { code: "UNAUTHENTICATED" },
                });
            }

            let session: SessionEntity | null = null;
            let user: UserEntity | null = null;

            // First try to validate using session ID (cookie-based)
            if (sessionId) {
                session = await validateSession(sessionId);
                if (session?.userId) {
                    const foundUser = await findUserById(session.userId);
                    user = foundUser || null;
                }
            }

            // If session validation failed, try refresh token
            if (!user && refreshToken) {
                const payload = await verifyToken(refreshToken);
                if (payload && payload.type === "refresh") {
                    const foundUser = await findUserById(payload.userId);
                    user = foundUser || null;
                    
                    // Find session by user ID
                    if (user) {
                        const foundSession = await findSessionByUserId(user.id);
                        session = foundSession || null;
                    }
                }
            }

            if (!user || !session) {
                throw new GraphQLError("Invalid session or refresh token", {
                    extensions: { code: "INVALID_TOKEN" },
                });
            }

            // Generate new access token
            const newAccessToken = await generateAccessToken(
                user.id,
                user.email,
            );

            // Update session activity
            await updateSession({
                ...session,
                lastActivity: Math.floor(Date.now() / 1000),
            });

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
            await deleteSessionsByUserId(ctx.user.id);

            return true;
        },
    }),
}));
