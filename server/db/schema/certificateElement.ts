import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { elementAlignmentEnum, elementTypeEnum } from "./elements/templateElementEnums";

export const certificateElement = pgTable("certificate_element", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").notNull(),
  type: elementTypeEnum("type").notNull(),
  positionX: integer("position_x").notNull(),
  positionY: integer("position_y").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  alignment: elementAlignmentEnum("alignment").notNull(),
  renderOrder: integer("render_order").notNull().default(0), // Lower values render first
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
