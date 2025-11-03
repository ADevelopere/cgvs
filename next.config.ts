import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true, // Enable gzip compression
  images: {
    domains: ["storage.googleapis.com", "flagcdn.com", "localhost"],
    unoptimized: true, // Disable optimization for external images
  },
  // async headers() {
  //   return [
  //     // CORS configuration for API routes
  //     {
  //       source: "/api/:path*",
  //       headers: [
  //         {
  //           key: "Access-Control-Allow-Credentials",
  //           value: "true",
  //         },
  //         {
  //           key: "Access-Control-Allow-Origin",
  //           value:
  //             process.env.NODE_ENV === "production"
  //               ? process.env.ALLOWED_ORIGIN || "https://yourdomain.com"
  //               : "http://localhost:3000",
  //         },
  //         {
  //           key: "Access-Control-Allow-Methods",
  //           value: "GET,POST,PUT,DELETE,PATCH,OPTIONS,HEAD",
  //         },
  //         {
  //           key: "Access-Control-Allow-Headers",
  //           value:
  //             "Authorization, Content-Type, Accept, X-Requested-With, X-Refresh-Token, Content-MD5, X-Apollo-Operation-Name, Apollo-Require-Preflight, X-CSRF-Token",
  //         },
  //         {
  //           key: "Access-Control-Max-Age",
  //           value: "86400", // 24 hours
  //         },
  //       ],
  //     },
  //     // Security headers for all routes
  //     {
  //       source: "/:path*",
  //       headers: [
  //         {
  //           key: "X-DNS-Prefetch-Control",
  //           value: "on",
  //         },
  //         {
  //           key: "Strict-Transport-Security",
  //           value: "max-age=31536000; includeSubDomains",
  //         },
  //         {
  //           key: "X-Frame-Options",
  //           value: "DENY",
  //         },
  //         {
  //           key: "X-Content-Type-Options",
  //           value: "nosniff",
  //         },
  //         {
  //           key: "X-XSS-Protection",
  //           value: "1; mode=block",
  //         },
  //         {
  //           key: "Referrer-Policy",
  //           value: "strict-origin-when-cross-origin",
  //         },
  //         {
  //           key: "Permissions-Policy",
  //           value:
  //             "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  //         },
  //         {
  //           key: "Content-Security-Policy",
  //           value:
  //             process.env.NODE_ENV === "production"
  //               ? [
  //                   "default-src 'self'",
  //                   "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
  //                   "style-src 'self' 'unsafe-inline'",
  //                   "img-src 'self' data: https://storage.googleapis.com https://flagcdn.com",
  //                   "font-src 'self' data:",
  //                   "connect-src 'self' http://localhost:* ws://localhost:* wss://localhost:* https://storage.googleapis.com https://*.googleapis.com",
  //                   "frame-ancestors 'none'",
  //                   "base-uri 'self'",
  //                   "form-action 'self'",
  //                 ].join("; ")
  //               : [
  //                   "default-src 'self' https://*.apollographql.com https://*.googleapis.com https://*.gstatic.com",
  //                   "script-src 'self' 'unsafe-eval' 'unsafe-inline' 'unsafe-hashes' https://*.apollographql.com https://*.googletagmanager.com https://*.amplitude.com",
  //                   "style-src 'self' 'unsafe-inline' https://*.googleapis.com https://*.apollographql.com",
  //                   "img-src 'self' data: blob: https://storage.googleapis.com https://flagcdn.com https://*.apollographql.com",
  //                   "font-src 'self' data: https://*.gstatic.com https://*.googleapis.com",
  //                   "connect-src 'self' http://localhost:* ws://localhost:* wss://localhost:* https://*.apollographql.com https://*.googletagmanager.com https://*.amplitude.com https://sentry.io https://storage.googleapis.com https://*.googleapis.com",
  //                   "frame-src 'self' https://*.apollographql.com",
  //                   "manifest-src 'self' https://*.apollographql.com",
  //                   "frame-ancestors 'none'",
  //                   "base-uri 'self'",
  //                   "form-action 'self'",
  //                 ].join("; "),
  //         },
  //       ],
  //     },
  //     // Cache control for static images
  //     {
  //       source: "/_next/image",
  //       headers: [
  //         {
  //           key: "Cache-Control",
  //           value: "public, max-age=31536000, immutable",
  //         },
  //       ],
  //     },
  //   ];
  // },
  /* config options here */
};

export default nextConfig;
