CREATE TABLE "signed_url" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"file_path" varchar(1024) NOT NULL,
	"content_type" varchar(255) NOT NULL,
	"file_size" bigint NOT NULL,
	"content_md5" varchar(44) NOT NULL,
	"expires_at" timestamp (3) NOT NULL,
	"created_at" timestamp (3) NOT NULL,
	"used" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE INDEX "signed_url_expires_at_idx" ON "signed_url" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "signed_url_used_expires_idx" ON "signed_url" USING btree ("used","expires_at");