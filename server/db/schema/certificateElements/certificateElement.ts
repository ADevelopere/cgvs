import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
  text,
  jsonb,
} from "drizzle-orm/pg-core";
import { elementAlignmentEnum, elementTypeEnum } from "./templateElementEnums";
import type { ElementConfig } from "@/server/types/element.types";

export const certificateElement = pgTable("certificate_element", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  templateId: integer("template_id").notNull(),
  type: elementTypeEnum("type").notNull(),
  positionX: integer("position_x").notNull(),
  positionY: integer("position_y").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  alignment: elementAlignmentEnum("alignment").notNull(),
  renderOrder: integer("render_order").notNull().default(0), // Lower values render first

  // Type-specific configuration stored as typed JSONB
  config: jsonb("config").$type<ElementConfig>().notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
