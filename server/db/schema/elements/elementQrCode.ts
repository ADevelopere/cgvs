import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import {
  certificateFieldEnum,
  dataSourceTypeEnum,
} from "../templateElementEnums";

export const elementQrCode = pgTable("element_qr_code", {
  id: integer("id").primaryKey(), // One-to-one with certificate_element
  dataSourceType: dataSourceTypeEnum("data_source_type").notNull(),
  staticData: text("static_data"), // Used when dataSourceType is STATIC
  templateVariableId: integer("template_variable_id"), // Used when dataSourceType is TEMPLATE_VARIABLE
  certificateField: certificateFieldEnum("certificate_field"), // Used when dataSourceType is CERTIFICATE_FIELD
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
