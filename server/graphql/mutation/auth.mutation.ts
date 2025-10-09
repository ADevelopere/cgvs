import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import { comparePassword } from "@/server/lib/auth/password";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
} from "@/server/lib";
import { GraphQLError } from "graphql";
import { randomUUID } from "crypto";
import {
    LoginInputPothosObject,
    LoginResponsePothosObject,
    RefreshTokenResponsePothosObject,
} from "../pothos";
import { UserEntity, SessionEntity } from "@/server/types";
import { SessionRepository, UserRepository } from "@/server/db/repo";
import logger from "@/lib/logger";

gqlSchemaBuilder.mutationFields((t) => ({
    login: t.field({
        type: LoginResponsePothosObject,
        args: {
            input: t.arg({ type: LoginInputPothosObject, required: true }),
        },
        resolve: async (_parent, args, ctx) => {
            const { email, password } = args.input;

            let user: UserEntity | null;
            try {
                user = await UserRepository.findUserByEmail(email.value);
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
            await SessionRepository.create({
                id: sessionId,
                userId: user.id,
                payload: JSON.stringify({
                    createdAt: new Date().toISOString(),
                    // Store session metadata only, not sensitive tokens
                }),
                lastActivity: Math.floor(Date.now() / 1000),
            });

            // Set httpOnly cookies for session and refresh token
            if (ctx.cookies) {
                ctx.cookies.set("cgvs_session_id", sessionId, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge: 60 * 60 * 24 * 7, // 7 days
                    path: "/",
                });

                ctx.cookies.set("cgvs_refresh_token", refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge: 60 * 60 * 24 * 7, // 7 days
                    path: "/",
                });
            }

            return {
                token: accessToken,
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
                session = await SessionRepository.validate(sessionId);
                if (session?.userId) {
                    const foundUser = await UserRepository.findById(
                        session.userId,
                    );
                    user = foundUser || null;
                }
            }

            // If session validation failed, try refresh token
            if (!user && refreshToken) {
                const payload = await verifyToken(refreshToken);
                if (payload && payload.type === "refresh") {
                    const foundUser = await UserRepository.findById(
                        payload.userId,
                    );
                    user = foundUser || null;

                    // Find session by user ID
                    if (user) {
                        const foundSession =
                            await SessionRepository.findByUserId(user.id);
                        session = foundSession || null;
                    }
                }
            }

            if (!user || !session) {
                throw new GraphQLError("Invalid session or refresh token", {
                    extensions: { code: "INVALID_TOKEN" },
                });
            }

            // Generate new tokens (token rotation for security)
            const newAccessToken = await generateAccessToken(
                user.id,
                user.email,
            );
            const newRefreshToken = await generateRefreshToken(
                user.id,
                user.email,
            );

            // Update session activity
            await SessionRepository.update({
                ...session,
                lastActivity: Math.floor(Date.now() / 1000),
            });

            // Refresh the cookies with new refresh token (token rotation)
            if (ctx.cookies && session.id) {
                ctx.cookies.set("cgvs_session_id", session.id, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge: 60 * 60 * 24 * 7, // 7 days
                    path: "/",
                });

                // Rotate refresh token for enhanced security
                ctx.cookies.set("cgvs_refresh_token", newRefreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge: 60 * 60 * 24 * 7, // 7 days
                    path: "/",
                });
            }

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
        resolve: async (_parent, _args, ctx) => {
            if (!ctx.user) {
                return false;
            }

            // Delete all sessions for the user
            await SessionRepository.deleteByUserId(ctx.user.id);

            // Clear authentication cookies
            if (ctx.cookies) {
                ctx.cookies.delete("cgvs_session_id");
                ctx.cookies.delete("cgvs_refresh_token");
            }

            return true;
        },
    }),
}));
