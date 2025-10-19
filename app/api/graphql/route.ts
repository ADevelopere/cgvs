import { graphQLSchema } from "@/server/graphql/gqlSchema";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { createGraphQLContext } from "@/server/graphql/gqlContextFactory";
import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  getClientIdentifier,
  graphqlRateLimiter,
} from "@/server/lib/ratelimit";
import logger from "@/lib/logger";

// import { ApolloServerPluginUsageReporting } from "@apollo/server/plugin/usageReporting";

const server = new ApolloServer({
  schema: graphQLSchema,
  // plugins: [
  //     ApolloServerPluginUsageReporting({
  //         // Optionally configure the plugin here
  //         sendHeaders: { all: true },
  //         // You can customize reporting, but basic inclusion is enough for tracing
  //     }),
  // ],
});

const handler = startServerAndCreateNextHandler(server, {
  context: createGraphQLContext,
});

/**
 * CORS preflight handler
 * Handles OPTIONS requests for CORS
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin":
        process.env.NODE_ENV === "production"
          ? process.env.ALLOWED_ORIGIN || "https://yourdomain.com"
          : "http://localhost:3000",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS, HEAD",
      "Access-Control-Allow-Headers":
        "Authorization, Content-Type, Accept, X-Requested-With, X-Refresh-Token",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Max-Age": "86400",
    },
  });
}

/**
 * Health check handler
 * Lightweight HEAD handler for connectivity checks
 */
export async function HEAD() {
  return new Response(null, { status: 204 });
}

/**
 * Rate limiting middleware wrapper
 * Checks rate limit before processing the request
 */
async function withRateLimit(
  request: NextRequest,
  handler: (req: NextRequest) => Promise<Response>
): Promise<Response> {
  const identifier = getClientIdentifier(request);

  // Check rate limit
  const { success, limit, remaining, reset } = await checkRateLimit(
    identifier,
    graphqlRateLimiter
  );

  if (!success) {
    logger.warn(`Rate limit exceeded for ${identifier}`);

    return NextResponse.json(
      {
        errors: [
          {
            message: "Too many requests. Please try again later.",
            extensions: {
              code: "RATE_LIMIT_EXCEEDED",
              limit,
              reset,
            },
          },
        ],
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": reset.toString(),
          "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  // Add rate limit headers to successful responses
  const response = await handler(request);

  // Clone response to add headers
  const newResponse = new Response(response.body, response);
  newResponse.headers.set("X-RateLimit-Limit", limit.toString());
  newResponse.headers.set("X-RateLimit-Remaining", remaining.toString());
  newResponse.headers.set("X-RateLimit-Reset", reset.toString());

  return newResponse;
}

/**
 * POST handler for GraphQL mutations
 * Applies rate limiting
 */
export async function POST(request: NextRequest) {
  return withRateLimit(request, handler);
}

/**
 * GET handler for GraphQL queries
 * Applies rate limiting
 */
export async function GET(request: NextRequest) {
  return withRateLimit(request, handler);
}
