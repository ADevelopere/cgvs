import type { certificateElement } from "@/server/db/schema";

// ============================================================================
// Entity Types (from Drizzle schema)
// ============================================================================

export type CertificateElementEntity = typeof certificateElement.$inferSelect;
export type CertificateElementEntityInput =
  typeof certificateElement.$inferInsert;