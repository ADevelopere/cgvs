import { BaseContext, createContext } from "./gqlContext";
import { extractTokenFromHeader, verifyToken } from "@/server/lib/auth/jwt";
import { headers, cookies } from "next/headers";
import { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";
import logger from "@/server/lib/logger";

/**
 * Create GraphQL context from Next.js request
 * This extracts authentication information from headers and cookies
 */
export async function createGraphQLContext(): Promise<
  BaseContext & {
    refreshToken?: string;
    sessionId?: string;
    cookies: ResponseCookies;
  }
> {
  const headersList = await headers();
  const cookieStore = await cookies();

  // Log cookie presence for debugging
  const allCookies = cookieStore.getAll();
  logger.debug("[GraphQL Context] Creating context", {
    cookieCount: allCookies.length,
    hasCgvsSessionId: !!cookieStore.get("cgvs_session_id"),
    hasCgvsRefreshToken: !!cookieStore.get("cgvs_refresh_token"),
    hasAuthHeader: !!headersList.get("authorization"),
  });

  // Extract access token from Authorization header
  const authHeader = headersList.get("authorization");
  const accessToken = extractTokenFromHeader(authHeader);

  // Extract refresh token from cookie or custom header
  const refreshToken = cookieStore.get("cgvs_refresh_token")?.value || headersList.get("x-refresh-token") || undefined;

  // Extract session ID from cookie (similar to Ktor approach)
  const sessionId = cookieStore.get("cgvs_session_id")?.value || undefined;

  if (!refreshToken && !sessionId) {
    logger.debug("[GraphQL Context] No auth cookies found in request");
  }

  let userId: number | null = null;

  // Verify access token if present
  if (accessToken) {
    const payload = await verifyToken(accessToken);
    if (payload && payload.type === "access") {
      userId = payload.userId;
    }
  }

  // Create base context with user information
  const baseContext = await createContext({ userId });

  return {
    ...baseContext,
    refreshToken,
    sessionId,
    cookies: cookieStore,
  };
}
