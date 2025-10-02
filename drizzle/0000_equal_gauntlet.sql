CREATE TYPE "public"."CountryCode" AS ENUM('EG', 'US');--> statement-breakpoint
CREATE TYPE "public"."Gender" AS ENUM('MALE', 'FEMALE', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."TemplateConfigKey" AS ENUM('MAX_BACKGROUND_SIZE', 'ALLOWED_FILE_TYPES');--> statement-breakpoint
CREATE TYPE "public"."CategorySpecialType" AS ENUM('Main', 'Suspension');--> statement-breakpoint
CREATE TYPE "public"."TemplateVariableType" AS ENUM('TEXT', 'NUMBER', 'DATE', 'SELECT');--> statement-breakpoint
CREATE TYPE "public"."ElementType" AS ENUM('static_text', 'data_text', 'data_date', 'image', 'qr_code');--> statement-breakpoint
CREATE TYPE "public"."TemplateElementSourceType" AS ENUM('student', 'variable', 'certificate');--> statement-breakpoint
CREATE TABLE "Certificate" (
	"id" serial PRIMARY KEY NOT NULL,
	"templateId" integer NOT NULL,
	"studentId" integer NOT NULL,
	"templateRecipientGroupId" integer NOT NULL,
	"releaseDate" timestamp (3) NOT NULL,
	"verificationCode" varchar(255) NOT NULL,
	"deletedAt" timestamp (3),
	"createdAt" timestamp (3) NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	CONSTRAINT "Certificate_verificationCode_unique" UNIQUE("verificationCode")
);
--> statement-breakpoint
CREATE TABLE "passwordResetTokens" (
	"email" varchar(255) PRIMARY KEY NOT NULL,
	"token" varchar(255) NOT NULL,
	"createdAt" timestamp (3)
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
CREATE TABLE "Student" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255),
	"phoneNumber" varchar(255),
	"dateOfBirth" timestamp (3),
	"gender" "Gender",
	"nationality" "CountryCode",
	"createdAt" timestamp (3) NOT NULL,
	"updatedAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TemplateCategory" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"parentCategoryId" integer,
	"order" integer,
	"specialType" "CategorySpecialType",
	"createdAt" timestamp (3) NOT NULL,
	"updatedAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TemplateConfigs" (
	"key" "TemplateConfigKey" PRIMARY KEY NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Template" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"imageFileId" bigint,
	"categoryId" integer NOT NULL,
	"order" integer NOT NULL,
	"preSuspensionCategoryId" integer,
	"createdAt" timestamp (3) NOT NULL,
	"updatedAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "DateTemplateVariable" (
	"id" integer PRIMARY KEY NOT NULL,
	"minDate" timestamp (3),
	"maxDate" timestamp (3),
	"format" varchar(50),
	"previewValue" timestamp (3)
);
--> statement-breakpoint
CREATE TABLE "NumberTemplateVariable" (
	"id" integer PRIMARY KEY NOT NULL,
	"minValue" numeric,
	"maxValue" numeric,
	"decimalPlaces" integer,
	"previewValue" numeric
);
--> statement-breakpoint
CREATE TABLE "SelectTemplateVariable" (
	"id" integer PRIMARY KEY NOT NULL,
	"options" json,
	"multiple" boolean,
	"previewValue" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "TemplateVariableBase" (
	"id" serial PRIMARY KEY NOT NULL,
	"templateId" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"type" "TemplateVariableType" NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"order" integer NOT NULL,
	"createdAt" timestamp (3) NOT NULL,
	"updatedAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TextTemplateVariable" (
	"id" integer PRIMARY KEY NOT NULL,
	"minLength" integer,
	"maxLength" integer,
	"pattern" varchar(255),
	"previewValue" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "RecipientGroupItemVariableValue" (
	"id" serial PRIMARY KEY NOT NULL,
	"templateRecipientGroupItemId" integer NOT NULL,
	"templateVariableId" integer NOT NULL,
	"value" text,
	"valueIndexed" varchar(255),
	"createdAt" timestamp (3) NOT NULL,
	"updatedAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TemplateRecipientGroupItem" (
	"id" serial PRIMARY KEY NOT NULL,
	"templateRecipientGroupId" integer NOT NULL,
	"studentId" integer NOT NULL,
	"createdAt" timestamp (3) NOT NULL,
	"updatedAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TemplateRecipientGroup" (
	"id" serial PRIMARY KEY NOT NULL,
	"templateId" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"date" timestamp (3),
	"createdAt" timestamp (3) NOT NULL,
	"updatedAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TemplateDataDateElements" (
	"elementId" integer PRIMARY KEY NOT NULL,
	"sourceType" "TemplateElementSourceType" NOT NULL,
	"sourceField" varchar(100) NOT NULL,
	"dateFormat" varchar(50),
	"createdAt" timestamp (3) NOT NULL,
	"updatedAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TemplateDataTextElements" (
	"elementId" integer PRIMARY KEY NOT NULL,
	"sourceType" "TemplateElementSourceType" NOT NULL,
	"sourceField" varchar(100) NOT NULL,
	"createdAt" timestamp (3) NOT NULL,
	"updatedAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TemplateElements" (
	"id" serial PRIMARY KEY NOT NULL,
	"templateId" integer NOT NULL,
	"type" "ElementType" NOT NULL,
	"xCoordinate" real NOT NULL,
	"yCoordinate" real NOT NULL,
	"fontSize" integer,
	"color" varchar(20),
	"alignment" varchar(20),
	"fontFamily" varchar(100),
	"languageConstraint" varchar(10),
	"createdAt" timestamp (3) NOT NULL,
	"updatedAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TemplateImageElements" (
	"elementId" integer PRIMARY KEY NOT NULL,
	"imageUrl" varchar(500) NOT NULL,
	"width" integer,
	"height" integer,
	"createdAt" timestamp (3) NOT NULL,
	"updatedAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TemplateQrCodeElements" (
	"elementId" integer PRIMARY KEY NOT NULL,
	"size" integer,
	"createdAt" timestamp (3) NOT NULL,
	"updatedAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TemplateStaticTextElements" (
	"elementId" integer PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"createdAt" timestamp (3) NOT NULL,
	"updatedAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "FileUsage" (
	"id" bigint PRIMARY KEY NOT NULL,
	"filePath" varchar(1024) NOT NULL,
	"usageType" varchar(100) NOT NULL,
	"referenceId" bigint NOT NULL,
	"referenceTable" varchar(100) NOT NULL,
	"created" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "StorageDirectory" (
	"id" bigint PRIMARY KEY NOT NULL,
	"path" varchar(1024) NOT NULL,
	"allowUploads" boolean DEFAULT true NOT NULL,
	"allowDelete" boolean DEFAULT true NOT NULL,
	"allowMove" boolean DEFAULT true NOT NULL,
	"allowCreateSubDirs" boolean DEFAULT true NOT NULL,
	"allowDeleteFiles" boolean DEFAULT true NOT NULL,
	"allowMoveFiles" boolean DEFAULT true NOT NULL,
	"isProtected" boolean DEFAULT false NOT NULL,
	"protectChildren" boolean DEFAULT false NOT NULL,
	CONSTRAINT "StorageDirectory_path_unique" UNIQUE("path")
);
--> statement-breakpoint
CREATE TABLE "StorageFile" (
	"id" bigint PRIMARY KEY NOT NULL,
	"path" text NOT NULL,
	"isProtected" boolean DEFAULT false NOT NULL,
	CONSTRAINT "StorageFile_path_unique" UNIQUE("path")
);
--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_student_template_certificate" ON "Certificate" USING btree ("templateId","studentId");--> statement-breakpoint
CREATE INDEX "sessions_user_id_index" ON "sessions" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "sessions_last_activity_index" ON "sessions" USING btree ("lastActivity");--> statement-breakpoint
CREATE UNIQUE INDEX "TemplateCategory_specialType_key" ON "TemplateCategory" USING btree ("specialType");--> statement-breakpoint
CREATE UNIQUE INDEX "TemplateVariableBase_templateId_name_key" ON "TemplateVariableBase" USING btree ("templateId","name");--> statement-breakpoint
CREATE UNIQUE INDEX "rgiv_group_item_variable_unique" ON "RecipientGroupItemVariableValue" USING btree ("templateRecipientGroupItemId","templateVariableId");--> statement-breakpoint
CREATE INDEX "rgiv_value_idx" ON "RecipientGroupItemVariableValue" USING btree ("valueIndexed");--> statement-breakpoint
CREATE UNIQUE INDEX "trgi_student_group_unique" ON "TemplateRecipientGroupItem" USING btree ("studentId","templateRecipientGroupId");