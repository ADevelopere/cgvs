CREATE TYPE "public"."country_code" AS ENUM('SA', 'PS', 'YE', 'SY', 'EG', 'KW', 'QA', 'OM', 'BH', 'LB', 'JO', 'IQ', 'LY', 'AE', 'TN', 'DZ', 'MA', 'SD', 'ID', 'MR', 'SO', 'KM', 'DJ', 'ER', 'SS', 'EH', 'AD', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AW', 'AX', 'AZ', 'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BR', 'BS', 'BT', 'BV', 'BW', 'BY', 'BZ', 'CA', 'CC', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN', 'CO', 'CR', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ', 'DE', 'DK', 'DM', 'DO', 'EC', 'EE', 'ES', 'ET', 'FI', 'FJ', 'FK', 'FM', 'FO', 'FR', 'GA', 'GB', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GW', 'GY', 'HK', 'HM', 'HN', 'HR', 'HT', 'HU', 'IE', 'IM', 'IN', 'IO', 'IR', 'IS', 'IT', 'JE', 'JM', 'JP', 'KE', 'KG', 'KH', 'KI', 'KN', 'KP', 'KR', 'KY', 'KZ', 'LA', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'MC', 'MD', 'ME', 'MF', 'MG', 'MH', 'MK', 'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NC', 'NE', 'NF', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NU', 'NZ', 'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL', 'PM', 'PN', 'PR', 'PT', 'PW', 'PY', 'RE', 'RO', 'RS', 'RU', 'RW', 'SB', 'SC', 'SE', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SR', 'ST', 'SV', 'SX', 'SZ', 'TC', 'TD', 'TF', 'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TO', 'TR', 'TV', 'TW', 'TZ', 'UA', 'UG', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG', 'VI', 'VN', 'VU', 'WF', 'WS', 'XK', 'YT', 'ZA', 'ZM', 'ZW');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('MALE', 'FEMALE', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."category_special_type" AS ENUM('Main', 'Suspension');--> statement-breakpoint
CREATE TYPE "public"."template_config_key" AS ENUM('MAX_BACKGROUND_SIZE', 'ALLOWED_FILE_TYPES');--> statement-breakpoint
CREATE TYPE "public"."template_variable_type" AS ENUM('TEXT', 'NUMBER', 'DATE', 'SELECT');--> statement-breakpoint
CREATE TYPE "public"."template_element_type" AS ENUM('static_text', 'data_text', 'data_date', 'image', 'qr_code');--> statement-breakpoint
CREATE TYPE "public"."template_element_source_type" AS ENUM('student', 'variable', 'certificate');--> statement-breakpoint
CREATE TABLE "certificate" (
	"id" serial PRIMARY KEY NOT NULL,
	"template_id" integer NOT NULL,
	"student_id" integer NOT NULL,
	"template_recipient_group_id" integer NOT NULL,
	"release_date" timestamp (3) NOT NULL,
	"verification_code" varchar(255) NOT NULL,
	"deleted_at" timestamp (3),
	"created_at" timestamp (3) NOT NULL,
	"updated_at" timestamp (3) NOT NULL,
	CONSTRAINT "certificate_verification_code_unique" UNIQUE("verification_code")
);
--> statement-breakpoint
CREATE TABLE "passwordResetTokens" (
	"email" varchar(255) PRIMARY KEY NOT NULL,
	"token" varchar(255) NOT NULL,
	"created_at" timestamp (3)
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
	"order" integer,
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
CREATE TABLE "recipient_group_item_variable_value" (
	"id" serial PRIMARY KEY NOT NULL,
	"template_recipient_group_item_id" integer NOT NULL,
	"templateVariableId" integer NOT NULL,
	"value" text,
	"value_indexed" varchar(255),
	"created_at" timestamp (3) NOT NULL,
	"updated_at" timestamp (3) NOT NULL
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
CREATE TABLE "template_data_date_element" (
	"element_id" integer PRIMARY KEY NOT NULL,
	"source_type" "template_element_source_type" NOT NULL,
	"source_field" varchar(100) NOT NULL,
	"date_format" varchar(50),
	"created_at" timestamp (3) NOT NULL,
	"updated_at" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template_data_text_element" (
	"element_id" integer PRIMARY KEY NOT NULL,
	"source_type" "template_element_source_type" NOT NULL,
	"source_field" varchar(100) NOT NULL,
	"created_at" timestamp (3) NOT NULL,
	"updated_at" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template_element" (
	"id" serial PRIMARY KEY NOT NULL,
	"template_id" integer NOT NULL,
	"type" "template_element_type" NOT NULL,
	"x_coordinate" real NOT NULL,
	"y_coordinate" real NOT NULL,
	"font_size" integer,
	"color" varchar(20),
	"alignment" varchar(20),
	"font_family" varchar(100),
	"language_constraint" varchar(10),
	"created_at" timestamp (3) NOT NULL,
	"updated_at" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template_image_element" (
	"element_id" integer PRIMARY KEY NOT NULL,
	"image_url" varchar(500) NOT NULL,
	"width" integer,
	"height" integer,
	"created_at" timestamp (3) NOT NULL,
	"updated_at" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template_qr_code_element" (
	"element_id" integer PRIMARY KEY NOT NULL,
	"size" integer,
	"created_at" timestamp (3) NOT NULL,
	"updated_at" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template_static_text_element" (
	"element_id" integer PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp (3) NOT NULL,
	"updated_at" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "file_usage" (
	"id" bigint PRIMARY KEY NOT NULL,
	"file_path" varchar(1024) NOT NULL,
	"usage_type" varchar(100) NOT NULL,
	"reference_id" bigint NOT NULL,
	"reference_table" varchar(100) NOT NULL,
	"created_at" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "storage_directory" (
	"id" bigint PRIMARY KEY NOT NULL,
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
	"id" bigint PRIMARY KEY NOT NULL,
	"path" text NOT NULL,
	"is_protected" boolean DEFAULT false NOT NULL,
	CONSTRAINT "storage_file_path_unique" UNIQUE("path")
);
--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_student_template_certificate" ON "certificate" USING btree ("template_id","student_id");--> statement-breakpoint
CREATE INDEX "sessions_user_id_index" ON "sessions" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "sessions_last_activity_index" ON "sessions" USING btree ("lastActivity");--> statement-breakpoint
CREATE INDEX "idx_students_name_fts" ON "student" USING gin (to_tsvector('simple', "name"));--> statement-breakpoint
CREATE INDEX "idx_students_name_trgm" ON "student" USING gist ("name" gist_trgm_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "template_category_special_type_key" ON "TemplateCategory" USING btree ("special_type");--> statement-breakpoint
CREATE UNIQUE INDEX "template_base_variable_template_id_name_key" ON "template_variable_base" USING btree ("template_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "rgiv_group_item_variable_unique" ON "recipient_group_item_variable_value" USING btree ("template_recipient_group_item_id","templateVariableId");--> statement-breakpoint
CREATE INDEX "rgiv_value_idx" ON "recipient_group_item_variable_value" USING btree ("value_indexed");--> statement-breakpoint
CREATE UNIQUE INDEX "trgi_student_group_unique" ON "template_recipient_group_item" USING btree ("student_id","template_recipient_group_id");