import {
  integer,
  decimal,
  pgTable,
  serial,
  timestamp,
  varchar,
  text,
  boolean,
} from "drizzle-orm/pg-core";
import { elementAlignmentEnum, elementTypeEnum } from "./templateElementEnums";

export const certificateElement = pgTable("certificate_element", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),

  templateId: integer("template_id").notNull(),
  // Shared element properties
  positionX: decimal("position_x").notNull(),
  positionY: decimal("position_y").notNull(),
  width: decimal("width").notNull(),
  height: decimal("height").notNull(),
  alignment: elementAlignmentEnum("alignment"),
  hidden: boolean("hidden").default(false),
  renderOrder: integer("render_order").notNull(), // Lower values render first

  type: elementTypeEnum("type").notNull(), // Discriminator for element type

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
