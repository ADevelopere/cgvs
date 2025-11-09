/**
 * Drizzle Seed Script - Generates the exact same demo data as the old Prisma seeder
 *
 * This script creates:
 * - 1 Admin user (admin@cgvs.com)
 * - Template categories (with special types and subcategories)
 * - Templates (one per top-level category)
 * - Template variables (base + category-specific)
 * - 1000 Students with randomized data
 * - Recipient groups (2 per template)
 * - Recipient group items (10-50 students per group)
 */

import { config } from "dotenv";
import { resolve } from "path";
import logger from "@/server/lib/logger";

// from server/db/seed/drizzleSeed.ts
config({ path: resolve(__dirname, "../../../.env") });

// Verify DATABASE_URL is loaded
if (!process.env.DATABASE_URL) {
  logger.error("❌ Error: DATABASE_URL is not set in environment variables");
  logger.error("   Please check your .env file");
  process.exit(1);
}

import { createFileInitializationService } from "@/server/storage/demo/fileInitializationService";
import { templateCategoriesData } from "./seed/constants";
import {
  generateArabicFullName,
  generateEmail,
  generatePhoneNumber,
  generateDateOfBirth,
  shuffleArray,
} from "./seed/generators";

import { createTemplateVariables } from "./seed/templateVariableCreators";
import { Email } from "@/server/lib";
import {
  UserRepository,
  TemplateRepository,
  TemplateCategoryRepository,
  StudentRepository,
  RecipientGroupRepository,
  RecipientRepository,
} from "../repo";
import { StudentCreateInput, StudentEntity, RecipientGroupCreateInput, RecipientCreateListInput } from "@/server/types";
import { CountryCode, Gender } from "@/lib/enum";

// todo: remove following and create role repositories
import { db, drizzleDbPool as drizzleDbPool } from "../drizzleDb";
import { roles, userRoles } from "../schema";
import { eq } from "drizzle-orm";

const now = new Date();

// --- Main Seeder Functions ---

/**
 * Creates an admin user and admin role for testing authentication.
 */
async function createAdminUser() {
  logger.log("👤 Creating admin user...");

  // Check if admin user already exists
  let adminUser = await UserRepository.findByEmail(process.env.ADMIN_EMAIL!);

  if (adminUser) {
    logger.log("   ⚠️ Admin user already exists, skipping creation.");
  } else {
    adminUser = await UserRepository.create({
      name: "System Administrator",
      email: new Email(process.env.ADMIN_EMAIL!),
      password: process.env.ADMIN_PASSWORD!,
    });
  }

  try {
    // Create or get admin role
    const existingRoles = await db.select().from(roles).where(eq(roles.name, "admin")).limit(1);

    let adminRole;
    if (existingRoles.length === 0) {
      [adminRole] = await db
        .insert(roles)
        .values({
          id: 1,
          name: "admin",
        })
        .returning();
    } else {
      adminRole = existingRoles[0];
    }

    // Assign admin role to user
    await db.insert(userRoles).values({
      userId: adminUser.id,
      roleId: adminRole.id,
    });
  } catch {
    logger.log("Roles already created, skipping role assignment.");
  }

  logger.log("   ✅ Admin user created successfully:");
  logger.log("      Email: admin@cgvs.com");
  logger.log("      Password: cgvs@123");
  logger.log("      Role: Administrator");
  return adminUser;
}

/**
 * Creates template categories, including special types and nested categories.
 */
async function createTemplateCategories() {
  logger.log("📁 Creating template categories...");
  const allCategories = [];

  // Create or ensure special categories exist
  const templatesMainCategory = await TemplateCategoryRepository.createMainCategoryIfNotExisting();
  allCategories.push(templatesMainCategory);

  const templatesSuspensionCategory = await TemplateCategoryRepository.createSuspensionCategoryIfNotExisting();
  allCategories.push(templatesSuspensionCategory);

  // Create regular categories
  for (const [, categoryData] of templateCategoriesData.entries()) {
    const parentCategory = await TemplateCategoryRepository.create({
      name: categoryData.name,
      description: categoryData.description,
      parentCategoryId: null,
    });

    allCategories.push(parentCategory);

    // Create subcategories if they exist
    if (categoryData.subcategories && categoryData.subcategories.length > 0) {
      for (const [, sub] of categoryData.subcategories.entries()) {
        const subCategory = await TemplateCategoryRepository.create({
          name: sub.name,
          description: sub.description,
          parentCategoryId: parentCategory.id,
        });

        allCategories.push(subCategory);
      }
    }
  }

  logger.log(`   ✅ Created/verified ${allCategories.length} categories.`);
  return allCategories;
}

/**
 * Initializes the file system and returns demo file IDs
 */
async function initializeFileSystem() {
  logger.log("📁 Initializing file system and uploading demo files...");

  try {
    const fileInitService = await createFileInitializationService();

    // Initialize file system (creates directories and uploads demo files)
    await fileInitService.initializeFileSystem();

    // Get demo file IDs
    const fileIds = await fileInitService.getTemplateCoverDemoFileIds();

    logger.log(`   ✅ File system initialized with ${fileIds.length} demo files.`);
    return { fileInitService, fileIds };
  } catch (error) {
    logger.error("   ❌ Error initializing file system:", error);
    return { fileInitService: null, fileIds: [] };
  }
}

/**
 * Creates sample templates, one for each top-level category.
 */
async function createTemplates(
  categories: Awaited<ReturnType<typeof createTemplateCategories>>,
  fileIds: bigint[],
  fileInitService: Awaited<ReturnType<typeof createFileInitializationService>> | null
) {
  logger.log("📋 Creating templates...");
  const createdTemplates = [];

  // Filter for top-level categories, excluding special types
  const topLevelCategories = categories.filter(c => c.parentCategoryId === null && c.specialType === null);

  if (fileIds.length === 0) {
    logger.error("   �� No demo files available for templates.");
    process.exit(1);
  }

  for (const category of topLevelCategories) {
    // Randomly select a file ID if available
    const randomFileId = fileIds[Math.floor(Math.random() * fileIds.length)];

    const template = await TemplateRepository.internalCreateWithImageFileId({
      name: `نموذج ${category.name}`,
      description: `نموذج تجريبي لـ${category.name}`,
      categoryId: category.id,
      imageFileId: randomFileId,
    });

    createdTemplates.push(template);

    // Register file usage if file was assigned
    if (randomFileId && fileInitService) {
      try {
        await fileInitService.registerTemplateFileUsage(template.id, randomFileId);
      } catch {
        logger.log(`   ⚠️  Could not register file usage for template ${template.id}`);
      }
    }

    // Create variables for this template
    await createTemplateVariables(template, category.name);
  }

  logger.log(`   ✅ Created ${createdTemplates.length} templates with variables.`);
  return createdTemplates;
}

/**
 * Creates 1000 sample students with randomized data.
 */
async function createStudents() {
  logger.log("🎓 Creating 1000 students...");

  const genders: Gender[] = Object.values(Gender);
  const nationalities: CountryCode[] = Object.values(CountryCode);

  const batchSize = 100;
  const totalStudents = 1000;

  const createdStudents: StudentEntity[] = [];

  for (let batch = 0; batch < totalStudents / batchSize; batch++) {
    const studentsData: StudentCreateInput[] = [];
    for (let i = 0; i < batchSize; i++) {
      const fullName = generateArabicFullName();
      const [firstName, , lastName] = fullName.split(" ");

      studentsData.push({
        name: fullName,
        email: Math.random() < 0.7 ? generateEmail(firstName, lastName) : null,
        phoneNumber: Math.random() < 0.6 ? generatePhoneNumber() : null,
        dateOfBirth: Math.random() < 0.8 ? generateDateOfBirth() : null,
        gender: Math.random() < 0.9 ? genders[Math.floor(Math.random() * genders.length)] : null,
        nationality: Math.random() < 0.75 ? nationalities[Math.floor(Math.random() * nationalities.length)] : null,
      });
    }
    createdStudents.push(...(await StudentRepository.createList(studentsData)));
    logger.log(`   📝 Created ${(batch + 1) * batchSize} students...`);
  }

  logger.log("   ✅ Created 1000 students.");
  return createdStudents;
}

/**
 * Creates recipient groups, two for each template.
 */
async function createRecipientGroups(templatesArray: Awaited<ReturnType<typeof createTemplates>>) {
  logger.log("👥 Creating recipient groups...");

  if (templatesArray.length === 0) {
    logger.log("   ⚠️ No templates available to create recipient groups.");
    return [];
  }

  const groupsData: RecipientGroupCreateInput[] = [];
  for (const template of templatesArray) {
    for (let i = 0; i < 2; i++) {
      groupsData.push({
        templateId: template.id,
        name: `مجموعة ${template.name} ${i + 1}`,
        description: `وصف لمجموعة ${template.name} ${i + 1}`,
        date: now,
      });
    }
  }

  const createdGroups = await RecipientGroupRepository.createList(groupsData);

  logger.log(`   ✅ Created ${createdGroups.length} recipient groups.`);
  return createdGroups;
}

/**
 * Adds a random number of students (10-50) to each recipient group.
 */
async function createRecipientGroupItems(
  groups: Awaited<ReturnType<typeof createRecipientGroups>>,
  studentsArray: Awaited<ReturnType<typeof createStudents>>
) {
  logger.log("👥 Creating recipient group items...");

  if (groups.length === 0 || studentsArray.length === 0) {
    logger.log("   ⚠️ No groups or students available to create items.");
    return 0;
  }

  let totalItems = 0;
  const shuffledStudents = shuffleArray(studentsArray);

  for (const group of groups) {
    const studentCount = Math.floor(Math.random() * (50 - 10 + 1)) + 10;
    const selectedStudents = shuffledStudents.slice(0, studentCount);

    const input: RecipientCreateListInput = {
      recipientGroupId: group.id,
      studentIds: selectedStudents.map(s => s.id),
    };

    try {
      const items = await RecipientRepository.createList(input);
      totalItems += items.length;
    } catch {
      // Skip duplicates (similar to Prisma's try/catch)
      logger.log(`   ⚠️ Some items skipped for group ${group.id} (duplicates)`);
    }
  }

  logger.log(`   ✅ Created ${totalItems} recipient group items.`);
  return totalItems;
}

// --- Main Execution ---

async function main() {
  logger.log("🌱 Starting demo data seeding...");
  logger.log("===============================\n");

  try {
    // 1. Initialize file system and get demo file IDs
    const { fileInitService, fileIds } = await initializeFileSystem();
    logger.log("");

    if (!fileInitService) {
      logger.log("Error initializing file system");
      return;
    }

    if (fileIds.length === 0) {
      logger.error("Error, no demo files");
      return;
    }

    // 2. Create admin user
    await createAdminUser();
    logger.log("");

    // 3. Create template categories
    const categories = await createTemplateCategories();
    logger.log("");

    // 4. Create templates
    const templatesArray = await createTemplates(categories, fileIds, fileInitService);
    logger.log("");

    // 5. Create students
    const studentsArray = await createStudents();
    logger.log("");

    // 6. Create recipient groups
    const groups = await createRecipientGroups(templatesArray);
    logger.log("");

    // 7. Create recipient group items
    const itemsCount = await createRecipientGroupItems(groups, studentsArray);
    logger.log("");

    logger.log("===============================");
    logger.log("✅ Demo data seeding completed successfully!");
    logger.log("📊 Summary:");
    logger.log(`   - Admin user: admin@cgvs.com (password: cgvs@123)`);
    logger.log(`   - Categories: ${categories.length}`);
    logger.log(`   - Demo Files: ${fileIds.length}`);
    logger.log(`   - Templates: ${templatesArray.length}`);
    logger.log(`   - Students: ${studentsArray.length}`);
    logger.log(`   - Recipient Groups: ${groups.length}`);
    logger.log(`   - Recipient Group Items: ${itemsCount}`);
  } catch (error) {
    logger.error("❌ Error during seeding:", error);
    throw error;
  }
}

main()
  .catch(e => {
    logger.error("❌ Fatal error:", e);
    process.exit(1);
  })
  .finally(async () => {
    if (drizzleDbPool) {
      await drizzleDbPool.end();
    }
    process.exit(0);
  });
