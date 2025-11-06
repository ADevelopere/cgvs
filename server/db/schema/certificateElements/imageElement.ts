import { integer, pgTable, jsonb, bigint } from "drizzle-orm/pg-core";
import { certificateElement } from "./certificateElement";
import { storageFiles } from "../storage";
import { elementImageFitEnum } from "./templateElementEnums";
import type { ImageDataSource } from "@/server/types/element";

export const imageElement = pgTable("image_element", {
  elementId: integer("element_id")
    .primaryKey()
    .references(() => certificateElement.id, { onDelete: "cascade" }),
  fit: elementImageFitEnum("fit").notNull(), // COVER | CONTAIN | FILL
  imageDataSource: jsonb("image_data_source").$type<ImageDataSource>().notNull(),
  // Mirrored from data_source.storageFileId
  storageFileId: bigint("storage_file_id", { mode: "bigint" })
    .notNull()
    .references(() => storageFiles.id, { onDelete: "restrict" }),
});
