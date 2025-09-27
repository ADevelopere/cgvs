-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."CountryCode" AS ENUM ('EG', 'US');

-- CreateEnum
CREATE TYPE "public"."TemplateConfigKey" AS ENUM ('MAX_BACKGROUND_SIZE', 'ALLOWED_FILE_TYPES');

-- CreateEnum
CREATE TYPE "public"."CategorySpecialType" AS ENUM ('Main', 'Suspension');

-- CreateEnum
CREATE TYPE "public"."ElementType" AS ENUM ('static_text', 'data_text', 'data_date', 'image', 'qr_code');

-- CreateEnum
CREATE TYPE "public"."SourceType" AS ENUM ('student', 'variable', 'certificate');

-- CreateEnum
CREATE TYPE "public"."TemplateVariableType" AS ENUM ('TEXT', 'NUMBER', 'DATE', 'SELECT');

-- CreateTable
CREATE TABLE "public"."Certificate" (
    "id" SERIAL NOT NULL,
    "templateId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "templateRecipientGroupId" INTEGER NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "verificationCode" VARCHAR(255) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RecipientGroupItemVariableValue" (
    "id" SERIAL NOT NULL,
    "templateRecipientGroupItemId" INTEGER NOT NULL,
    "templateVariableId" INTEGER NOT NULL,
    "value" TEXT,
    "valueIndexed" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecipientGroupItemVariableValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TemplateRecipientGroupItem" (
    "id" SERIAL NOT NULL,
    "templateRecipientGroupId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateRecipientGroupItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TemplateRecipientGroup" (
    "id" SERIAL NOT NULL,
    "templateId" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateRecipientGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StorageFile" (
    "id" BIGSERIAL NOT NULL,
    "path" VARCHAR(1024) NOT NULL,
    "isProtected" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "StorageFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FileUsage" (
    "id" BIGSERIAL NOT NULL,
    "filePath" VARCHAR(1024) NOT NULL,
    "usageType" VARCHAR(100) NOT NULL,
    "referenceId" BIGINT NOT NULL,
    "referenceTable" VARCHAR(100) NOT NULL,
    "created" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StorageDirectory" (
    "id" BIGSERIAL NOT NULL,
    "path" VARCHAR(1024) NOT NULL,
    "allowUploads" BOOLEAN NOT NULL DEFAULT true,
    "allowDelete" BOOLEAN NOT NULL DEFAULT true,
    "allowMove" BOOLEAN NOT NULL DEFAULT true,
    "allowCreateSubDirs" BOOLEAN NOT NULL DEFAULT true,
    "allowDeleteFiles" BOOLEAN NOT NULL DEFAULT true,
    "allowMoveFiles" BOOLEAN NOT NULL DEFAULT true,
    "isProtected" BOOLEAN NOT NULL DEFAULT false,
    "protectChildren" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "StorageDirectory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Student" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "phoneNumber" VARCHAR(255),
    "dateOfBirth" TIMESTAMP(3),
    "gender" "public"."Gender",
    "nationality" "public"."CountryCode",
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TemplateConfigs" (
    "key" "public"."TemplateConfigKey" NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "TemplateConfigs_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "public"."TemplateCategory" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "parentCategoryId" INTEGER,
    "order" INTEGER,
    "categorySpecialType" "public"."CategorySpecialType",
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Template" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "imageFileId" BIGINT,
    "categoryId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "preSuspensionCategoryId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TemplateElements" (
    "id" SERIAL NOT NULL,
    "templateId" INTEGER NOT NULL,
    "type" "public"."ElementType" NOT NULL,
    "xCoordinate" DOUBLE PRECISION NOT NULL,
    "yCoordinate" DOUBLE PRECISION NOT NULL,
    "fontSize" INTEGER,
    "color" VARCHAR(20),
    "alignment" VARCHAR(20),
    "fontFamily" VARCHAR(100),
    "languageConstraint" VARCHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateElements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TemplateStaticTextElements" (
    "elementId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateStaticTextElements_pkey" PRIMARY KEY ("elementId")
);

-- CreateTable
CREATE TABLE "public"."TemplateDataTextElements" (
    "elementId" INTEGER NOT NULL,
    "sourceType" "public"."SourceType" NOT NULL,
    "sourceField" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateDataTextElements_pkey" PRIMARY KEY ("elementId")
);

-- CreateTable
CREATE TABLE "public"."TemplateQrCodeElements" (
    "elementId" INTEGER NOT NULL,
    "size" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateQrCodeElements_pkey" PRIMARY KEY ("elementId")
);

-- CreateTable
CREATE TABLE "public"."TemplateImageElements" (
    "elementId" INTEGER NOT NULL,
    "imageUrl" VARCHAR(500) NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateImageElements_pkey" PRIMARY KEY ("elementId")
);

-- CreateTable
CREATE TABLE "public"."TemplateDataDateElements" (
    "elementId" INTEGER NOT NULL,
    "sourceType" "public"."SourceType" NOT NULL,
    "sourceField" VARCHAR(100) NOT NULL,
    "dateFormat" VARCHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateDataDateElements_pkey" PRIMARY KEY ("elementId")
);

-- CreateTable
CREATE TABLE "public"."TemplateVariableBase" (
    "id" SERIAL NOT NULL,
    "templateId" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "type" "public"."TemplateVariableType" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateVariableBase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TextTemplateVariable" (
    "id" INTEGER NOT NULL,
    "minLength" INTEGER,
    "maxLength" INTEGER,
    "pattern" VARCHAR(255),
    "previewValue" VARCHAR(255),

    CONSTRAINT "TextTemplateVariable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NumberTemplateVariable" (
    "id" INTEGER NOT NULL,
    "minValue" DECIMAL(65,30),
    "maxValue" DECIMAL(65,30),
    "decimalPlaces" INTEGER,
    "previewValue" DECIMAL(65,30),

    CONSTRAINT "NumberTemplateVariable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DateTemplateVariable" (
    "id" INTEGER NOT NULL,
    "minDate" TIMESTAMP(3),
    "maxDate" TIMESTAMP(3),
    "format" VARCHAR(50),
    "previewValue" TIMESTAMP(3),

    CONSTRAINT "DateTemplateVariable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SelectTemplateVariable" (
    "id" INTEGER NOT NULL,
    "options" JSONB,
    "multiple" BOOLEAN,
    "previewValue" VARCHAR(255),

    CONSTRAINT "SelectTemplateVariable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" VARCHAR(255) NOT NULL,
    "userId" INTEGER,
    "ipAddress" VARCHAR(45),
    "userAgent" TEXT,
    "payload" TEXT NOT NULL,
    "lastActivity" INTEGER NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PasswordResetTokens" (
    "email" VARCHAR(255) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3),

    CONSTRAINT "PasswordResetTokens_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "public"."Users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "emailVerifiedAt" TIMESTAMP(3),
    "password" VARCHAR(255) NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "rememberToken" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_verificationCode_key" ON "public"."Certificate"("verificationCode");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_templateId_studentId_key" ON "public"."Certificate"("templateId", "studentId");

-- CreateIndex
CREATE INDEX "rgiv_value_idx" ON "public"."RecipientGroupItemVariableValue"("valueIndexed");

-- CreateIndex
CREATE UNIQUE INDEX "RecipientGroupItemVariableValue_templateRecipientGroupItemI_key" ON "public"."RecipientGroupItemVariableValue"("templateRecipientGroupItemId", "templateVariableId");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateRecipientGroupItem_studentId_templateRecipientGroup_key" ON "public"."TemplateRecipientGroupItem"("studentId", "templateRecipientGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "StorageFile_path_key" ON "public"."StorageFile"("path");

-- CreateIndex
CREATE UNIQUE INDEX "StorageDirectory_path_key" ON "public"."StorageDirectory"("path");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateConfigs_key_key" ON "public"."TemplateConfigs"("key");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateCategory_categorySpecialType_key" ON "public"."TemplateCategory"("categorySpecialType");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateVariableBase_templateId_name_key" ON "public"."TemplateVariableBase"("templateId", "name");

-- CreateIndex
CREATE INDEX "sessions_user_id_index" ON "public"."Session"("userId");

-- CreateIndex
CREATE INDEX "sessions_last_activity_index" ON "public"."Session"("lastActivity");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "public"."Users"("email");

-- AddForeignKey
ALTER TABLE "public"."Certificate" ADD CONSTRAINT "Certificate_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "public"."Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Certificate" ADD CONSTRAINT "Certificate_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Certificate" ADD CONSTRAINT "Certificate_templateRecipientGroupId_fkey" FOREIGN KEY ("templateRecipientGroupId") REFERENCES "public"."TemplateRecipientGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RecipientGroupItemVariableValue" ADD CONSTRAINT "RecipientGroupItemVariableValue_templateRecipientGroupItem_fkey" FOREIGN KEY ("templateRecipientGroupItemId") REFERENCES "public"."TemplateRecipientGroupItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RecipientGroupItemVariableValue" ADD CONSTRAINT "RecipientGroupItemVariableValue_templateVariableId_fkey" FOREIGN KEY ("templateVariableId") REFERENCES "public"."TemplateVariableBase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TemplateRecipientGroupItem" ADD CONSTRAINT "TemplateRecipientGroupItem_templateRecipientGroupId_fkey" FOREIGN KEY ("templateRecipientGroupId") REFERENCES "public"."TemplateRecipientGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TemplateRecipientGroupItem" ADD CONSTRAINT "TemplateRecipientGroupItem_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TemplateRecipientGroup" ADD CONSTRAINT "TemplateRecipientGroup_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "public"."Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TemplateCategory" ADD CONSTRAINT "TemplateCategory_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES "public"."TemplateCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Template" ADD CONSTRAINT "Template_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."TemplateCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Template" ADD CONSTRAINT "Template_preSuspensionCategoryId_fkey" FOREIGN KEY ("preSuspensionCategoryId") REFERENCES "public"."TemplateCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TemplateElements" ADD CONSTRAINT "TemplateElements_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "public"."Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TemplateStaticTextElements" ADD CONSTRAINT "TemplateStaticTextElements_elementId_fkey" FOREIGN KEY ("elementId") REFERENCES "public"."TemplateElements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TemplateDataTextElements" ADD CONSTRAINT "TemplateDataTextElements_elementId_fkey" FOREIGN KEY ("elementId") REFERENCES "public"."TemplateElements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TemplateQrCodeElements" ADD CONSTRAINT "TemplateQrCodeElements_elementId_fkey" FOREIGN KEY ("elementId") REFERENCES "public"."TemplateElements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TemplateImageElements" ADD CONSTRAINT "TemplateImageElements_elementId_fkey" FOREIGN KEY ("elementId") REFERENCES "public"."TemplateElements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TemplateDataDateElements" ADD CONSTRAINT "TemplateDataDateElements_elementId_fkey" FOREIGN KEY ("elementId") REFERENCES "public"."TemplateElements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TemplateVariableBase" ADD CONSTRAINT "TemplateVariableBase_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "public"."Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TextTemplateVariable" ADD CONSTRAINT "TextTemplateVariable_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."TemplateVariableBase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NumberTemplateVariable" ADD CONSTRAINT "NumberTemplateVariable_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."TemplateVariableBase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DateTemplateVariable" ADD CONSTRAINT "DateTemplateVariable_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."TemplateVariableBase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SelectTemplateVariable" ADD CONSTRAINT "SelectTemplateVariable_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."TemplateVariableBase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
