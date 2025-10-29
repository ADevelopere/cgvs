import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
  text,
  jsonb,
  bigint,
} from "drizzle-orm/pg-core";
import { elementAlignmentEnum, elementTypeEnum } from "./templateElementEnums";
import type { ElementConfigUnion } from "@/server/types/element";
import { font } from "../font";
import { templateVariableBases } from "../templateVariables";
import { storageFiles } from "../storage";

export const certificateElement = pgTable("certificate_element", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),

  templateId: integer("template_id").notNull(),
  // shared element properties
  positionX: integer("position_x").notNull(),
  positionY: integer("position_y").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  alignment: elementAlignmentEnum("alignment").notNull(),
  renderOrder: integer("render_order").notNull().default(0), // Lower values render first

  type: elementTypeEnum("type").notNull(),

  // Type-specific configuration stored as typed JSONB (source of truth)
  // Config contains the complete element configuration including all settings
  config: jsonb("config").$type<ElementConfigUnion>().notNull(),

  // ============================================================================
  // Foreign Key Columns (mirrored from config for DB integrity & relations)
  // ============================================================================
  // These columns MUST be kept in sync with the config JSONB by application layer.
  // They enable: FK constraints, cascade protection, relations, efficient queries.
  //
  // Sync Rules by Element Type:
  // - TEXT:    fontId (if SELF_HOSTED), variableId (if using TEMPLATE_*_VARIABLE)
  // - DATE:    fontId (if SELF_HOSTED), variableId (if using TEMPLATE_DATE_VARIABLE)
  // - NUMBER:  fontId (if SELF_HOSTED), variableId (always from dataSource)
  // - COUNTRY: fontId (if SELF_HOSTED), others null
  // - GENDER:  fontId (if SELF_HOSTED), others null
  // - IMAGE:   storageFileId (always from dataSource), others null
  // - QR_CODE: all null
  //
  fontId: integer("font_id").references(() => font.id, {
    onDelete: "restrict",
  }), // From config.textProps.fontRef.fontId when type=SELF_HOSTED
  templateVariableId: integer("template_variable_id").references(
    () => templateVariableBases.id,
    { onDelete: "restrict" }
  ), // From config.dataSource.variableId (TEXT/DATE/NUMBER)
  storageFileId: bigint("storage_file_id", { mode: "number" }).references(
    () => storageFiles.id,
    { onDelete: "restrict" }
  ), // From config.dataSource.storageFileId (IMAGE only)

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
