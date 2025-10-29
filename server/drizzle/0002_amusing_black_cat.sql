ALTER TABLE "date_element" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "date_element" CASCADE;--> statement-breakpoint
ALTER TABLE "country_element" ADD CONSTRAINT "country_element_text_props_id_element_text_props_id_fk" FOREIGN KEY ("text_props_id") REFERENCES "public"."element_text_props"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
DROP TYPE "public"."date_transformation_type";