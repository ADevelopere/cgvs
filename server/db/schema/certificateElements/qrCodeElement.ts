import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { certificateElement } from "./certificateElement";
import { qrCodeErrorCorrectionEnum } from "./templateElementEnums";

export const qrCodeElement = pgTable("qr_code_element", {
  elementId: integer("element_id")
    .primaryKey()
    .references(() => certificateElement.id, { onDelete: "cascade" }),
  errorCorrection: qrCodeErrorCorrectionEnum("error_correction").notNull(), // L | M | Q | H
  foregroundColor: varchar("foreground_color", { length: 50 }).notNull(),
  backgroundColor: varchar("background_color", { length: 50 }).notNull(),
});

