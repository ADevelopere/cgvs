/* eslint-disable no-console */
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

// Load environment variables from .env file BEFORE any other imports
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../.env") });

// Verify DATABASE_URL is loaded
if (!process.env.DATABASE_URL) {
    console.error("❌ Error: DATABASE_URL is not set in environment variables");
    console.error("   Please check your .env file");
    process.exit(1);
}

import * as bcrypt from "bcryptjs";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { DefaultLogger, type LogWriter } from "drizzle-orm/logger";
import { relations } from "../drizzleRelations";

// Create a new database connection specifically for seeding
class SeedLogWriter implements LogWriter {
    write(message: string) {
        console.log(message);
    }
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
});

const logger = new DefaultLogger({ writer: new SeedLogWriter() });
const db = drizzle(pool, { relations, logger });
import { users, roles, userRoles } from "../schema/users";
import { students } from "../schema/students";
import { templateCategories, templates } from "../schema/templates";
import {
    templateRecipientGroups,
    templateRecipientGroupItems,
} from "../schema/templateRecipientGroups";
import { eq } from "drizzle-orm";
import { templateCategoriesData } from "./constants";
import {
    generateArabicFullName,
    generateEmail,
    generatePhoneNumber,
    generateDateOfBirth,
    shuffleArray,
} from "./generators";
import { createTemplateVariables } from "./templateVariableCreators";

const now = new Date();

// --- Main Seeder Functions ---

/**
 * Creates an admin user and admin role for testing authentication.
 */
async function createAdminUser() {
    console.log("👤 Creating admin user...");

    // Check if admin user already exists
    const existingAdmin = await db
        .select()
        .from(users)
        .where(eq(users.email, "admin@cgvs.com"))
        .limit(1);

    if (existingAdmin.length > 0) {
        console.log("   ⚠️ Admin user already exists, skipping creation.");
        return existingAdmin[0];
    }

    const hashedPassword = await bcrypt.hash("cgvs@123", 12);

    const [adminUser] = await db
        .insert(users)
        .values({
            name: "System Administrator",
            email: "admin@cgvs.com",
            password: hashedPassword,
            emailVerifiedAt: now,
            rememberToken: null,
            createdAt: now,
            updatedAt: now,
        })
        .returning();

    // Create or get admin role
    const existingRoles = await db
        .select()
        .from(roles)
        .where(eq(roles.name, "admin"))
        .limit(1);

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

    console.log("   ✅ Admin user created successfully:");
    console.log("      Email: admin@cgvs.com");
    console.log("      Password: cgvs@123");
    console.log("      Role: Administrator");
    return adminUser;
}

/**
 * Creates template categories, including special types and nested categories.
 */
async function createTemplateCategories() {
    console.log("📁 Creating template categories...");
    const allCategories = [];

    // Create or ensure special categories exist
    const existingMain = await db
        .select()
        .from(templateCategories)
        .where(eq(templateCategories.specialType, "Main"))
        .limit(1);

    let mainCategory;
    if (existingMain.length > 0) {
        mainCategory = existingMain[0];
        console.log("   ⚠️ Main category already exists.");
    } else {
        [mainCategory] = await db
            .insert(templateCategories)
            .values({
                name: "الفئة الرئيسية",
                description: "الفئة الرئيسية لجميع الشهادات",
                order: 0,
                specialType: "Main",
                parentCategoryId: null,
                createdAt: now,
                updatedAt: now,
            })
            .returning();
        console.log("   ✅ Main category created.");
    }
    allCategories.push(mainCategory);

    const existingSuspension = await db
        .select()
        .from(templateCategories)
        .where(eq(templateCategories.specialType, "Suspension"))
        .limit(1);

    let suspensionCategory;
    if (existingSuspension.length > 0) {
        suspensionCategory = existingSuspension[0];
        console.log("   ⚠️ Suspension category already exists.");
    } else {
        [suspensionCategory] = await db
            .insert(templateCategories)
            .values({
                name: "فئة الإيقاف",
                description: "فئة الشهادات الموقوفة أو المعلقة",
                order: 1,
                specialType: "Suspension",
                parentCategoryId: null,
                createdAt: now,
                updatedAt: now,
            })
            .returning();
        console.log("   ✅ Suspension category created.");
    }
    allCategories.push(suspensionCategory);

    // Create regular categories
    for (const [index, categoryData] of templateCategoriesData.entries()) {
        const [parentCategory] = await db
            .insert(templateCategories)
            .values({
                name: categoryData.name,
                description: categoryData.description,
                order: index + 2,
                specialType: null,
                parentCategoryId: null,
                createdAt: now,
                updatedAt: now,
            })
            .returning();

        allCategories.push(parentCategory);

        // Create subcategories if they exist
        if (categoryData.subcategories && categoryData.subcategories.length > 0) {
            for (const [subIndex, sub] of categoryData.subcategories.entries()) {
                const [subCategory] = await db
                    .insert(templateCategories)
                    .values({
                        name: sub.name,
                        description: sub.description,
                        parentCategoryId: parentCategory.id,
                        order: subIndex + 1,
                        specialType: null,
                        createdAt: now,
                        updatedAt: now,
                    })
                    .returning();

                allCategories.push(subCategory);
            }
        }
    }

    console.log(`   ✅ Created/verified ${allCategories.length} categories.`);
    return allCategories;
}

/**
 * Creates sample templates, one for each top-level category.
 */
async function createTemplates(categories: Awaited<ReturnType<typeof createTemplateCategories>>) {
    console.log("📋 Creating templates...");
    const createdTemplates = [];

    // Filter for top-level categories, excluding special types
    const topLevelCategories = categories.filter(
        (c) => c.parentCategoryId === null && c.specialType === null,
    );

    for (const category of topLevelCategories) {
        const [template] = await db
            .insert(templates)
            .values({
                name: `نموذج ${category.name}`,
                description: `نموذج تجريبي لـ${category.name}`,
                categoryId: category.id,
                order: 1,
                imageFileId: null,
                preSuspensionCategoryId: null,
                createdAt: now,
                updatedAt: now,
            })
            .returning();

        createdTemplates.push(template);

        // Create variables for this template
        await createTemplateVariables(db, template, category.name, now);
    }

    console.log(
        `   ✅ Created ${createdTemplates.length} templates with variables.`,
    );
    return createdTemplates;
}

/**
 * Creates 1000 sample students with randomized data.
 */
async function createStudents() {
    console.log("🎓 Creating 1000 students...");

    const genders = ["MALE", "FEMALE", "OTHER"] as const;
    const nationalities = ["EG", "US"] as const;
    const batchSize = 100;
    const totalStudents = 1000;

    for (let batch = 0; batch < totalStudents / batchSize; batch++) {
        const studentsData = [];

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
                createdAt: now,
                updatedAt: now,
            });
        }

        await db.insert(students).values(studentsData);
        console.log(`   📝 Created ${(batch + 1) * batchSize} students...`);
    }

    // Fetch all created students
    const createdStudents = await db
        .select()
        .from(students)
        .orderBy(students.createdAt);

    console.log("   ✅ Created 1000 students.");
    return createdStudents;
}

/**
 * Creates recipient groups, two for each template.
 */
async function createRecipientGroups(
    templatesArray: Awaited<ReturnType<typeof createTemplates>>,
) {
    console.log("👥 Creating recipient groups...");

    if (templatesArray.length === 0) {
        console.log("   ⚠️ No templates available to create recipient groups.");
        return [];
    }

    const groupsData = [];
    for (const template of templatesArray) {
        for (let i = 0; i < 2; i++) {
            groupsData.push({
                templateId: template.id,
                name: `مجموعة ${template.name} ${i + 1}`,
                description: `وصف لمجموعة ${template.name} ${i + 1}`,
                date: now,
                createdAt: now,
                updatedAt: now,
            });
        }
    }

    await db.insert(templateRecipientGroups).values(groupsData);

    // Fetch created groups
    const createdGroups = await db
        .select()
        .from(templateRecipientGroups)
        .orderBy(templateRecipientGroups.createdAt);

    console.log(`   ✅ Created ${createdGroups.length} recipient groups.`);
    return createdGroups;
}

/**
 * Adds a random number of students (10-50) to each recipient group.
 */
async function createRecipientGroupItems(
    groups: Awaited<ReturnType<typeof createRecipientGroups>>,
    studentsArray: Awaited<ReturnType<typeof createStudents>>,
) {
    console.log("👥 Creating recipient group items...");

    if (groups.length === 0 || studentsArray.length === 0) {
        console.log("   ⚠️ No groups or students available to create items.");
        return 0;
    }

    let totalItems = 0;
    const shuffledStudents = shuffleArray(studentsArray);

    for (const group of groups) {
        const studentCount = Math.floor(Math.random() * (50 - 10 + 1)) + 10;
        const selectedStudents = shuffledStudents.slice(0, studentCount);

        const itemsData = selectedStudents.map((student) => ({
            templateRecipientGroupId: group.id,
            studentId: student.id,
            createdAt: now,
            updatedAt: now,
        }));

        try {
            await db.insert(templateRecipientGroupItems).values(itemsData);
            totalItems += itemsData.length;
        } catch {
            // Skip duplicates (similar to Prisma's try/catch)
            console.log(`   ⚠️ Some items skipped for group ${group.id} (duplicates)`);
        }
    }

    console.log(`   ✅ Created ${totalItems} recipient group items.`);
    return totalItems;
}

// --- Main Execution ---

async function main() {
    console.log("🌱 Starting demo data seeding...");
    console.log("===============================\n");

    try {
        // 1. Create admin user
        await createAdminUser();
        console.log("");

        // 2. Create template categories
        const categories = await createTemplateCategories();
        console.log("");

        // 3. Create templates
        const templatesArray = await createTemplates(categories);
        console.log("");

        // 4. Create students
        const studentsArray = await createStudents();
        console.log("");

        // 5. Create recipient groups
        const groups = await createRecipientGroups(templatesArray);
        console.log("");

        // 6. Create recipient group items
        const itemsCount = await createRecipientGroupItems(groups, studentsArray);
        console.log("");

        console.log("===============================");
        console.log("✅ Demo data seeding completed successfully!");
        console.log("📊 Summary:");
        console.log(`   - Admin user: admin@cgvs.com (password: cgvs@123)`);
        console.log(`   - Categories: ${categories.length}`);
        console.log(`   - Templates: ${templatesArray.length}`);
        console.log(`   - Students: ${studentsArray.length}`);
        console.log(`   - Recipient Groups: ${groups.length}`);
        console.log(`   - Recipient Group Items: ${itemsCount}`);
    } catch (error) {
        console.error("❌ Error during seeding:", error);
        throw error;
    }
}

main()
    .catch((e) => {
        console.error("❌ Fatal error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await pool.end();
        process.exit(0);
    });
