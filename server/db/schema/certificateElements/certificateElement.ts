import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
  text,
} from "drizzle-orm/pg-core";
import { elementAlignmentEnum, elementTypeEnum } from "./templateElementEnums";

export const certificateElement = pgTable("certificate_element", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),

  templateId: integer("template_id").notNull(),
  // Shared element properties
  positionX: integer("position_x").notNull(),
  positionY: integer("position_y").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  alignment: elementAlignmentEnum("alignment").notNull(),
  renderOrder: integer("render_order").notNull().default(0), // Lower values render first

  type: elementTypeEnum("type").notNull(), // Discriminator for element type

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
