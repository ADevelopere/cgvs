import type { certificateElement } from "@/server/db/schema";

export type CertificateElementEntity = typeof certificateElement.$inferSelect;

export type CertificateElementInterface =  {
    base: CertificateElementEntity;
  };
  