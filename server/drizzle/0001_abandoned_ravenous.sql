CREATE TYPE "public"."category_special_type" AS ENUM('Main', 'Suspension');--> statement-breakpoint
CREATE TYPE "public"."template_config_key" AS ENUM('MAX_BACKGROUND_SIZE', 'ALLOWED_FILE_TYPES');--> statement-breakpoint
CREATE TYPE "public"."country_code" AS ENUM('SA', 'PS', 'YE', 'SY', 'EG', 'KW', 'QA', 'OM', 'BH', 'LB', 'JO', 'IQ', 'LY', 'AE', 'TN', 'DZ', 'MA', 'SD', 'ID', 'MR', 'SO', 'KM', 'DJ', 'ER', 'SS', 'EH', 'AD', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AW', 'AX', 'AZ', 'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BR', 'BS', 'BT', 'BV', 'BW', 'BY', 'BZ', 'CA', 'CC', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN', 'CO', 'CR', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ', 'DE', 'DK', 'DM', 'DO', 'EC', 'EE', 'ES', 'ET', 'FI', 'FJ', 'FK', 'FM', 'FO', 'FR', 'GA', 'GB', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GW', 'GY', 'HK', 'HM', 'HN', 'HR', 'HT', 'HU', 'IE', 'IM', 'IN', 'IO', 'IR', 'IS', 'IT', 'JE', 'JM', 'JP', 'KE', 'KG', 'KH', 'KI', 'KN', 'KP', 'KR', 'KY', 'KZ', 'LA', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'MC', 'MD', 'ME', 'MF', 'MG', 'MH', 'MK', 'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NC', 'NE', 'NF', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NU', 'NZ', 'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL', 'PM', 'PN', 'PR', 'PT', 'PW', 'PY', 'RE', 'RO', 'RS', 'RU', 'RW', 'SB', 'SC', 'SE', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SR', 'ST', 'SV', 'SX', 'SZ', 'TC', 'TD', 'TF', 'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TO', 'TR', 'TV', 'TW', 'TZ', 'UA', 'UG', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG', 'VI', 'VN', 'VU', 'WF', 'WS', 'XK', 'YT', 'ZA', 'ZM', 'ZW');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('MALE', 'FEMALE');--> statement-breakpoint
CREATE TYPE "public"."calendar_type" AS ENUM('GREGORIAN', 'HIJRI');--> statement-breakpoint
CREATE TYPE "public"."certificate_date_field" AS ENUM('RELEASE_DATE');--> statement-breakpoint
CREATE TYPE "public"."certificate_text_field" AS ENUM('VERIFICATION_CODE');--> statement-breakpoint
CREATE TYPE "public"."country_representation" AS ENUM('COUNTRY_NAME', 'NATIONALITY');--> statement-breakpoint
CREATE TYPE "public"."date_data_source_type" AS ENUM('STATIC', 'TEMPLATE_DATE_VARIABLE', 'STUDENT_DATE_FIELD', 'CERTIFICATE_DATE_FIELD');--> statement-breakpoint
CREATE TYPE "public"."date_transformation_type" AS ENUM('AGE_CALCULATION');--> statement-breakpoint
CREATE TYPE "public"."element_alignment" AS ENUM('START', 'END', 'TOP', 'BOTTOM', 'CENTER', 'BASELINE');--> statement-breakpoint
CREATE TYPE "public"."element_image_fit" AS ENUM('COVER', 'CONTAIN', 'FILL');--> statement-breakpoint
CREATE TYPE "public"."element_overflow" AS ENUM('RESIZE_DOWN', 'TRUNCATE', 'ELLIPSE', 'WRAP');--> statement-breakpoint
CREATE TYPE "public"."element_type" AS ENUM('TEXT', 'NUMBER', 'DATE', 'IMAGE', 'GENDER', 'COUNTRY', 'QR_CODE');--> statement-breakpoint
CREATE TYPE "public"."font_source" AS ENUM('GOOGLE', 'SELF_HOSTED');--> statement-breakpoint
CREATE TYPE "public"."qr_code_error_correction" AS ENUM('L', 'M', 'Q', 'H');--> statement-breakpoint
CREATE TYPE "public"."student_date_field" AS ENUM('DATE_OF_BIRTH');--> statement-breakpoint
CREATE TYPE "public"."student_text_field" AS ENUM('STUDENT_NAME', 'STUDENT_EMAIL');--> statement-breakpoint
CREATE TYPE "public"."template_variable_type" AS ENUM('TEXT', 'NUMBER', 'DATE', 'SELECT');--> statement-breakpoint
CREATE TYPE "public"."text_data_source_type" AS ENUM('STATIC', 'TEMPLATE_TEXT_VARIABLE', 'TEMPLATE_SELECT_VARIABLE', 'STUDENT_TEXT_FIELD', 'CERTIFICATE_TEXT_FIELD');--> statement-breakpoint
CREATE TABLE "certificate" (
	"id" serial PRIMARY KEY NOT NULL,
	"template_id" integer NOT NULL,
	"student_id" integer NOT NULL,
	"template_recipient_group_id" integer NOT NULL,
	"release_date" timestamp (3) NOT NULL,
	"verification_code" varchar(255) NOT NULL,
	"created_at" timestamp (3) NOT NULL,
	"updated_at" timestamp (3) NOT NULL,
	CONSTRAINT "certificate_verification_code_unique" UNIQUE("verification_code")
);
--> statement-breakpoint
CREATE TABLE "student" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255),
	"phone_number" varchar(255),
	"date_of_birth" timestamp (3),
	"gender" "gender",
	"nationality" "country_code",
	"created_at" timestamp (3) NOT NULL,
	"updated_at" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TemplateCategory" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"parent_category_id" integer,
	"order" integer NOT NULL,
	"special_type" "category_special_type",
	"created_at" timestamp (3) NOT NULL,
	"updated_at" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"image_file_id" bigint,
	"category_id" integer NOT NULL,
	"order" integer NOT NULL,
	"pre_suspension_category_id" integer,
	"created_at" timestamp (3) NOT NULL,
	"updated_at" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "templates_config" (
	"key" "template_config_key" PRIMARY KEY NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "font" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"locale" jsonb NOT NULL,
	"storage_file_id" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cache" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "certificate_element" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"template_id" integer NOT NULL,
	"position_x" integer NOT NULL,
	"position_y" integer NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"alignment" "element_alignment",
	"render_order" integer NOT NULL,
	"type" "element_type" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "country_element" (
	"element_id" integer PRIMARY KEY NOT NULL,
	"text_props_id" integer NOT NULL,
	"representation" "country_representation" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "date_element" (
	"element_id" integer PRIMARY KEY NOT NULL,
	"text_props_id" integer NOT NULL,
	"calendar_type" "calendar_type" NOT NULL,
	"offset_days" integer DEFAULT 0 NOT NULL,
	"format" varchar(100) NOT NULL,
	"transformation" date_transformation_type,
	"date_data_source" jsonb NOT NULL,
	"variable_id" integer
);
--> statement-breakpoint
CREATE TABLE "element_text_props" (
	"id" serial PRIMARY KEY NOT NULL,
	"font_source" "font_source" NOT NULL,
	"font_id" integer,
	"google_font_identifier" varchar(255),
	"font_size" integer NOT NULL,
	"color" varchar(50) NOT NULL,
	"overflow" "element_overflow" NOT NULL,
	CONSTRAINT "font_source_check" CHECK ((
        ("element_text_props"."font_source" = 'SELF_HOSTED' AND "element_text_props"."font_id" IS NOT NULL AND "element_text_props"."google_font_identifier" IS NULL)
        OR
        ("element_text_props"."font_source" = 'GOOGLE' AND "element_text_props"."google_font_identifier" IS NOT NULL AND "element_text_props"."font_id" IS NULL)
      ))
);
--> statement-breakpoint
CREATE TABLE "file_usage" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"file_path" varchar(1024) NOT NULL,
	"usage_type" varchar(100) NOT NULL,
	"reference_id" bigint NOT NULL,
	"reference_table" varchar(100) NOT NULL,
	"created_at" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gender_element" (
	"element_id" integer PRIMARY KEY NOT NULL,
	"text_props_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "image_element" (
	"element_id" integer PRIMARY KEY NOT NULL,
	"fit" "element_image_fit" NOT NULL,
	"image_data_source" jsonb NOT NULL,
	"storage_file_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "number_element" (
	"element_id" integer PRIMARY KEY NOT NULL,
	"text_props_id" integer NOT NULL,
	"mapping" jsonb NOT NULL,
	"number_data_source" jsonb NOT NULL,
	"variable_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "passwordResetTokens" (
	"email" varchar(255) PRIMARY KEY NOT NULL,
	"token" varchar(255) NOT NULL,
	"created_at" timestamp (3)
);
--> statement-breakpoint
CREATE TABLE "qr_code_element" (
	"element_id" integer PRIMARY KEY NOT NULL,
	"error_correction" "qr_code_error_correction" NOT NULL,
	"foreground_color" varchar(50) NOT NULL,
	"background_color" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipient_group_item_variable_value" (
	"id" serial PRIMARY KEY NOT NULL,
	"template_recipient_group_item_id" integer NOT NULL,
	"template_id" integer NOT NULL,
	"recipient_group_id" integer NOT NULL,
	"student_id" integer NOT NULL,
	"variable_values" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp (3) NOT NULL,
	"updated_at" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"userId" integer,
	"ipAddress" varchar(45),
	"userAgent" text,
	"payload" text NOT NULL,
	"lastActivity" integer NOT NULL
);
--> statement-breakpoint
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
CREATE TABLE "storage_directory" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"path" varchar(1024) NOT NULL,
	"allow_uploads" boolean DEFAULT true NOT NULL,
	"allow_delete" boolean DEFAULT true NOT NULL,
	"allow_move" boolean DEFAULT true NOT NULL,
	"allow_create_sub_dirs" boolean DEFAULT true NOT NULL,
	"allow_delete_files" boolean DEFAULT true NOT NULL,
	"allow_move_files" boolean DEFAULT true NOT NULL,
	"is_protected" boolean DEFAULT false NOT NULL,
	"protect_children" boolean DEFAULT false NOT NULL,
	CONSTRAINT "storage_directory_path_unique" UNIQUE("path")
);
--> statement-breakpoint
CREATE TABLE "storage_file" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"path" text NOT NULL,
	"is_protected" boolean DEFAULT false NOT NULL,
	CONSTRAINT "storage_file_path_unique" UNIQUE("path")
);
--> statement-breakpoint
CREATE TABLE "template_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"template_id" integer NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"nationality" "country_code" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template_date_variable" (
	"id" integer PRIMARY KEY NOT NULL,
	"min_date" timestamp (3),
	"max_date" timestamp (3),
	"format" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "template_number_variable" (
	"id" integer PRIMARY KEY NOT NULL,
	"min_value" numeric,
	"max_value" numeric,
	"decimal_places" integer
);
--> statement-breakpoint
CREATE TABLE "template_recipient_group_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"template_recipient_group_id" integer NOT NULL,
	"student_id" integer NOT NULL,
	"created_at" timestamp (3) NOT NULL,
	"updated_at" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template_recipient_group" (
	"id" serial PRIMARY KEY NOT NULL,
	"template_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"date" timestamp (3),
	"created_at" timestamp (3) NOT NULL,
	"updated_at" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template_select_variable" (
	"id" integer PRIMARY KEY NOT NULL,
	"options" json,
	"multiple" boolean
);
--> statement-breakpoint
CREATE TABLE "template_text_variable" (
	"id" integer PRIMARY KEY NOT NULL,
	"min_length" integer,
	"max_length" integer,
	"pattern" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "template_variable_base" (
	"id" serial PRIMARY KEY NOT NULL,
	"template_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"type" "template_variable_type" NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"order" integer NOT NULL,
	"preview_value" varchar(255),
	"created_at" timestamp (3) NOT NULL,
	"updated_at" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "text_element" (
	"element_id" integer PRIMARY KEY NOT NULL,
	"text_props_id" integer NOT NULL,
	"text_data_source" jsonb NOT NULL,
	"variable_id" integer
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"user_id" integer NOT NULL,
	"role_id" integer NOT NULL,
	CONSTRAINT "user_roles_user_id_role_id_pk" PRIMARY KEY("user_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified_at" timestamp (3),
	"password" varchar(255) NOT NULL,
	"remember_token" varchar(100),
	"created_at" timestamp (3) NOT NULL,
	"updated_at" timestamp (3) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "country_element" ADD CONSTRAINT "country_element_element_id_certificate_element_id_fk" FOREIGN KEY ("element_id") REFERENCES "public"."certificate_element"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "country_element" ADD CONSTRAINT "country_element_text_props_id_element_text_props_id_fk" FOREIGN KEY ("text_props_id") REFERENCES "public"."element_text_props"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "date_element" ADD CONSTRAINT "date_element_element_id_certificate_element_id_fk" FOREIGN KEY ("element_id") REFERENCES "public"."certificate_element"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "date_element" ADD CONSTRAINT "date_element_text_props_id_element_text_props_id_fk" FOREIGN KEY ("text_props_id") REFERENCES "public"."element_text_props"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "date_element" ADD CONSTRAINT "date_element_variable_id_template_variable_base_id_fk" FOREIGN KEY ("variable_id") REFERENCES "public"."template_variable_base"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "element_text_props" ADD CONSTRAINT "element_text_props_font_id_font_id_fk" FOREIGN KEY ("font_id") REFERENCES "public"."font"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gender_element" ADD CONSTRAINT "gender_element_element_id_certificate_element_id_fk" FOREIGN KEY ("element_id") REFERENCES "public"."certificate_element"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gender_element" ADD CONSTRAINT "gender_element_text_props_id_element_text_props_id_fk" FOREIGN KEY ("text_props_id") REFERENCES "public"."element_text_props"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "image_element" ADD CONSTRAINT "image_element_element_id_certificate_element_id_fk" FOREIGN KEY ("element_id") REFERENCES "public"."certificate_element"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "image_element" ADD CONSTRAINT "image_element_storage_file_id_storage_file_id_fk" FOREIGN KEY ("storage_file_id") REFERENCES "public"."storage_file"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "number_element" ADD CONSTRAINT "number_element_element_id_certificate_element_id_fk" FOREIGN KEY ("element_id") REFERENCES "public"."certificate_element"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "number_element" ADD CONSTRAINT "number_element_text_props_id_element_text_props_id_fk" FOREIGN KEY ("text_props_id") REFERENCES "public"."element_text_props"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "number_element" ADD CONSTRAINT "number_element_variable_id_template_variable_base_id_fk" FOREIGN KEY ("variable_id") REFERENCES "public"."template_variable_base"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "qr_code_element" ADD CONSTRAINT "qr_code_element_element_id_certificate_element_id_fk" FOREIGN KEY ("element_id") REFERENCES "public"."certificate_element"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_config" ADD CONSTRAINT "template_config_template_id_template_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."template"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "text_element" ADD CONSTRAINT "text_element_element_id_certificate_element_id_fk" FOREIGN KEY ("element_id") REFERENCES "public"."certificate_element"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "text_element" ADD CONSTRAINT "text_element_text_props_id_element_text_props_id_fk" FOREIGN KEY ("text_props_id") REFERENCES "public"."element_text_props"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "text_element" ADD CONSTRAINT "text_element_variable_id_template_variable_base_id_fk" FOREIGN KEY ("variable_id") REFERENCES "public"."template_variable_base"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_student_template_certificate" ON "certificate" USING btree ("template_id","student_id");--> statement-breakpoint
CREATE INDEX "idx_students_name_fts" ON "student" USING gin (to_tsvector('simple', "name"));--> statement-breakpoint
CREATE INDEX "idx_students_name_trgm" ON "student" USING gist ("name" gist_trgm_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "template_category_special_type_key" ON "TemplateCategory" USING btree ("special_type");--> statement-breakpoint
CREATE INDEX "idx_template_categories_name_fts" ON "TemplateCategory" USING gin (to_tsvector('simple', "name"));--> statement-breakpoint
CREATE INDEX "idx_template_categories_name_trgm" ON "TemplateCategory" USING gist ("name" gist_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_templates_name_fts" ON "template" USING gin (to_tsvector('simple', "name"));--> statement-breakpoint
CREATE INDEX "idx_templates_name_trgm" ON "template" USING gist ("name" gist_trgm_ops);--> statement-breakpoint
CREATE INDEX "cache_expires_at_idx" ON "cache" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "rgiv_group_item_unique" ON "recipient_group_item_variable_value" USING btree ("template_recipient_group_item_id");--> statement-breakpoint
CREATE INDEX "rgiv_student_idx" ON "recipient_group_item_variable_value" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "rgiv_template_idx" ON "recipient_group_item_variable_value" USING btree ("template_id");--> statement-breakpoint
CREATE INDEX "rgiv_recipient_group_idx" ON "recipient_group_item_variable_value" USING btree ("recipient_group_id");--> statement-breakpoint
CREATE INDEX "rgiv_variable_values_gin_idx" ON "recipient_group_item_variable_value" USING gin ("variable_values");--> statement-breakpoint
CREATE INDEX "sessions_user_id_index" ON "sessions" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "sessions_last_activity_index" ON "sessions" USING btree ("lastActivity");--> statement-breakpoint
CREATE INDEX "signed_url_expires_at_idx" ON "signed_url" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "signed_url_used_expires_idx" ON "signed_url" USING btree ("used","expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "trgi_student_group_unique" ON "template_recipient_group_item" USING btree ("student_id","template_recipient_group_id");--> statement-breakpoint
CREATE UNIQUE INDEX "template_base_variable_template_id_name_key" ON "template_variable_base" USING btree ("template_id","name");