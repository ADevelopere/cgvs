package scripts

import at.favre.lib.crypto.bcrypt.BCrypt
import kotlinx.coroutines.runBlocking
import kotlinx.datetime.Clock
import kotlinx.datetime.LocalDate
import kotlinx.datetime.TimeZone
import kotlinx.datetime.toLocalDateTime
import models.*
import repositories.RepositoryManager
import tables.Gender
import tables.Nationality
import config.DatabaseConfig
import io.ktor.server.config.*
import kotlin.random.Random

/**
 * Demo Data Seeder for Ktor CGSV Application
 * This script creates sample data for testing and demonstration purposes
 */
class DemoDataSeeder(private val repositoryManager: RepositoryManager) {

    private val random = Random.Default
    private val currentTime = Clock.System.now().toLocalDateTime(TimeZone.UTC)

    // Arabic names data
    private val arabicFirstNames = listOf(
        "محمد", "أحمد", "عبدالله", "عبدالرحمن", "خالد", "سعد", "فهد", "عمر", "ياسر", "سلطان",
        "نورة", "سارة", "ريم", "منى", "لطيفة", "عائشة", "فاطمة", "مريم", "هند", "أسماء"
    )

    private val arabicMiddleNames = listOf(
        "محمد", "أحمد", "عبدالله", "عبدالرحمن", "خالد", "سعد", "فهد", "عمر", "ياسر", "سلطان",
        "عبدالعزيز", "إبراهيم", "سليمان", "عثمان", "صالح"
    )

    private val arabicLastNames = listOf(
        "العتيبي", "القحطاني", "الغامدي", "الدوسري", "المطيري", "الشهري", "الزهراني",
        "الحربي", "السلمي", "المالكي", "العمري", "الشمري", "الحارثي", "البقمي", "الغنام"
    )

    // Template categories data
    private val templateCategoriesData = listOf(
        CategoryData(
            name = "الشهادات الأكاديمية",
            description = "شهادات التخرج والدورات الأكاديمية",
            subcategories = listOf(
                CategoryData("شهادات البكالوريوس", "شهادات إتمام درجة البكالوريوس"),
                CategoryData("شهادات الماجستير", "شهادات إتمام درجة الماجستير")
            )
        ),
        CategoryData(
            name = "الشهادات المهنية",
            description = "شهادات التدريب والتأهيل المهني",
            subcategories = listOf(
                CategoryData("شهادات التدريب التقني", "شهادات الدورات التقنية والبرمجة"),
                CategoryData("شهادات الإدارة", "شهادات في مجال الإدارة والقيادة")
            )
        ),
        CategoryData(
            name = "شهادات الحضور",
            description = "شهادات حضور الفعاليات والمؤتمرات",
            subcategories = listOf(
                CategoryData("شهادات المؤتمرات", "شهادات حضور المؤتمرات العلمية"),
                CategoryData("شهادات ورش العمل", "شهادات حضور ورش العمل التدريبية")
            )
        ),
        CategoryData(
            name = "شهادات التقدير",
            description = "شهادات تقدير الإنجازات والتميز",
            subcategories = listOf(
                CategoryData("شهادات التفوق", "شهادات تقدير للطلاب المتفوقين"),
                CategoryData("شهادات التميز", "شهادات تقدير للإنجازات المتميزة")
            )
        ),
        CategoryData(
            name = "الشهادات التطوعية",
            description = "شهادات العمل التطوعي والخدمة المجتمعية",
            subcategories = listOf(
                CategoryData("شهادات العمل التطوعي", "شهادات المشاركة في الأعمال التطوعية"),
                CategoryData("شهادات خدمة المجتمع", "شهادات المساهمة في خدمة المجتمع")
            )
        )
    )

    suspend fun seedAllData() {
        println("🌱 Starting demo data seeding...")

        try {
            // 1. Create admin user
            createAdminUser()

            // 2. Create template categories
            val categories = createTemplateCategories()

            // 3. Create templates
            createTemplates(categories)

            // 4. Create students
            createStudents()

            println("✅ Demo data seeding completed successfully!")
            println("📊 Summary:")
            println("   - Admin user: admin@cgvs.com (password: cgvs@123)")
            println("   - Categories: ${categories.size}")
            println("   - Templates: ${categories.size}")
            println("   - Students: 1000")

        } catch (e: Exception) {
            println("❌ Error during seeding: ${e.message}")
            e.printStackTrace()
            throw e
        }
    }

    /**
     * Creates an admin user for testing authentication
     */
    suspend fun createAdminUser(): User {
        println("Creating admin user...")

        // Check if admin user already exists
        val existingAdmin = repositoryManager.userRepository.findByEmail("admin@cgvs.com")
        if (existingAdmin != null) {
            println("⚠️  Admin user already exists, skipping creation")
            return existingAdmin
        }

        // Create admin user with hashed password
        val hashedPassword = BCrypt.withDefaults().hashToString(12, "cgvs@123".toCharArray())

        val adminUser = User(
            name = "System Administrator",
            email = "admin@cgvs.com",
            password = hashedPassword,
            isAdmin = true,
            createdAt = currentTime,
            updatedAt = currentTime
        )

        val createdAdmin = repositoryManager.userRepository.create(adminUser)
        println("✅ Admin user created successfully:")
        println("   Email: admin@cgvs.com")
        println("   Password: cgvs@123")
        println("   Role: Administrator")

        return createdAdmin
    }

    private suspend fun createTemplateCategories(): List<TemplateCategory> {
        println("📁 Creating template categories...")
        val allCategories = mutableListOf<TemplateCategory>()

        templateCategoriesData.forEachIndexed { index, categoryData ->
            // Create parent category
            val parentCategory = TemplateCategory(
                name = categoryData.name,
                description = categoryData.description,
                parentCategoryId = null,
                order = index + 1,
                categorySpecialType = null,
                deletedAt = null,
                createdAt = currentTime,
                updatedAt = currentTime
            )

            val createdParent = repositoryManager.templateCategoryRepository.create(parentCategory)
            allCategories.add(createdParent)

            // Create subcategories
            categoryData.subcategories.forEachIndexed { subIndex, subCategoryData ->
                val subCategory = TemplateCategory(
                    name = subCategoryData.name,
                    description = subCategoryData.description,
                    parentCategoryId = createdParent.id,
                    order = subIndex + 1,
                    categorySpecialType = null,
                    deletedAt = null,
                    createdAt = currentTime,
                    updatedAt = currentTime
                )

                val createdSub = repositoryManager.templateCategoryRepository.create(subCategory)
                allCategories.add(createdSub)
            }
        }

        println("   ✅ Created ${allCategories.size} categories")
        return allCategories
    }

    private suspend fun createTemplates(categories: List<TemplateCategory>) {
        println("📋 Creating templates...")

        // Create one template per top-level category
        val topLevelCategories = categories.filter { it.parentCategoryId == null }
        val demoImages = listOf(
            "img/demo1.jpg",
            "img/demo2.jpg",
            "img/demo3.jpg",
            "img/demo4.jpg",
            "img/demo5.jpg"
        )

        topLevelCategories.forEachIndexed { index, category ->
            val template = Template(
                name = "نموذج ${category.name}",
                description = "نموذج تجريبي لـ${category.name}",
                imageUrl = demoImages[index % demoImages.size],
                categoryId = category.id,
                order = 1,
                createdAt = currentTime,
                updatedAt = currentTime
            )

            val createdTemplate = repositoryManager.templateRepository.create(template)

            // Create template variables for this template
            createTemplateVariables(createdTemplate, category)
        }

        println("   ✅ Created ${topLevelCategories.size} templates")
    }

    private suspend fun createTemplateVariables(template: Template, category: TemplateCategory) {
        // Create base variables for all templates
        createBaseVariables(template)

        // Create category-specific variables
        when (category.name) {
            "الشهادات الأكاديمية" -> createAcademicVariables(template)
            "الشهادات المهنية" -> createProfessionalVariables(template)
            "شهادات الحضور" -> createAttendanceVariables(template)
            "شهادات التقدير" -> createAppreciationVariables(template)
            "الشهادات التطوعية" -> createVolunteerVariables(template)
        }
    }

    private suspend fun createBaseVariables(template: Template) {
        val baseVariables = listOf(
            TemplateVariable(
                templateId = template.id,
                name = "اسم الطالب",
                type = "text",
                description = "الاسم الكامل للطالب",
                previewValue = "محمد أحمد العتيبي",
                required = true,
                order = 1,
                minLength = 3,
                maxLength = 100,
                pattern = null,
                minValue = null,
                maxValue = null,
                decimalPlaces = null,
                minDate = null,
                maxDate = null,
                format = null,
                options = null,
                multiple = false,
                createdAt = currentTime,
                updatedAt = currentTime
            ),
            TemplateVariable(
                templateId = template.id,
                name = "تاريخ الإصدار",
                type = "date",
                description = "تاريخ إصدار الشهادة",
                previewValue = "2024-01-15",
                required = true,
                order = 2,
                minLength = null,
                maxLength = null,
                pattern = null,
                minValue = null,
                maxValue = null,
                decimalPlaces = null,
                minDate = null,
                maxDate = null,
                format = "Y-m-d",
                options = null,
                multiple = false,
                createdAt = currentTime,
                updatedAt = currentTime
            ),
            TemplateVariable(
                templateId = template.id,
                name = "الرقم المرجعي",
                type = "text",
                description = "الرقم المرجعي للشهادة",
                previewValue = "CERT2024",
                required = true,
                order = 3,
                minLength = 8,
                maxLength = 8,
                pattern = "^[A-Z0-9]{8}$",
                minValue = null,
                maxValue = null,
                decimalPlaces = null,
                minDate = null,
                maxDate = null,
                format = null,
                options = null,
                multiple = false,
                createdAt = currentTime,
                updatedAt = currentTime
            )
        )

        baseVariables.forEach { variable ->
            repositoryManager.templateVariableRepository.create(variable)
        }
    }

    private suspend fun createAcademicVariables(template: Template) {
        val academicVariables = listOf(
            TemplateVariable(
                templateId = template.id,
                name = "التخصص",
                type = "text",
                description = "التخصص الأكاديمي",
                previewValue = "علوم الحاسب",
                required = true,
                order = 4,
                minLength = 3,
                maxLength = 100,
                pattern = null,
                minValue = null,
                maxValue = null,
                decimalPlaces = null,
                minDate = null,
                maxDate = null,
                format = null,
                options = null,
                multiple = false,
                createdAt = currentTime,
                updatedAt = currentTime
            ),
            TemplateVariable(
                templateId = template.id,
                name = "المعدل",
                type = "number",
                description = "المعدل التراكمي",
                previewValue = "4.50",
                required = true,
                order = 5,
                minLength = null,
                maxLength = null,
                pattern = null,
                minValue = 0,
                maxValue = 5,
                decimalPlaces = 2,
                minDate = null,
                maxDate = null,
                format = null,
                options = null,
                multiple = false,
                createdAt = currentTime,
                updatedAt = currentTime
            )
        )

        academicVariables.forEach { variable ->
            repositoryManager.templateVariableRepository.create(variable)
        }
    }

    private suspend fun createProfessionalVariables(template: Template) {
        val professionalVariables = listOf(
            TemplateVariable(
                templateId = template.id,
                name = "المجال",
                type = "select",
                description = "مجال التدريب",
                previewValue = "تقنية المعلومات",
                required = true,
                order = 4,
                minLength = null,
                maxLength = null,
                pattern = null,
                minValue = null,
                maxValue = null,
                decimalPlaces = null,
                minDate = null,
                maxDate = null,
                format = null,
                options = listOf("تقنية المعلومات", "إدارة الأعمال", "الموارد البشرية", "التسويق الرقمي", "إدارة المشاريع"),
                multiple = false,
                createdAt = currentTime,
                updatedAt = currentTime
            ),
            TemplateVariable(
                templateId = template.id,
                name = "مدة التدريب",
                type = "number",
                description = "عدد ساعات التدريب",
                previewValue = "40",
                required = true,
                order = 5,
                minLength = null,
                maxLength = null,
                pattern = null,
                minValue = 1,
                maxValue = 1000,
                decimalPlaces = 0,
                minDate = null,
                maxDate = null,
                format = null,
                options = null,
                multiple = false,
                createdAt = currentTime,
                updatedAt = currentTime
            )
        )

        professionalVariables.forEach { variable ->
            repositoryManager.templateVariableRepository.create(variable)
        }
    }

    private suspend fun createAttendanceVariables(template: Template) {
        val attendanceVariables = listOf(
            TemplateVariable(
                templateId = template.id,
                name = "اسم الفعالية",
                type = "text",
                description = "اسم المؤتمر أو ورشة العمل",
                previewValue = "مؤتمر التقنية السنوي",
                required = true,
                order = 4,
                minLength = 5,
                maxLength = 200,
                pattern = null,
                minValue = null,
                maxValue = null,
                decimalPlaces = null,
                minDate = null,
                maxDate = null,
                format = null,
                options = null,
                multiple = false,
                createdAt = currentTime,
                updatedAt = currentTime
            ),
            TemplateVariable(
                templateId = template.id,
                name = "مكان الانعقاد",
                type = "text",
                description = "مكان انعقاد الفعالية",
                previewValue = "الرياض",
                required = true,
                order = 5,
                minLength = 3,
                maxLength = 100,
                pattern = null,
                minValue = null,
                maxValue = null,
                decimalPlaces = null,
                minDate = null,
                maxDate = null,
                format = null,
                options = null,
                multiple = false,
                createdAt = currentTime,
                updatedAt = currentTime
            )
        )

        attendanceVariables.forEach { variable ->
            repositoryManager.templateVariableRepository.create(variable)
        }
    }

    private suspend fun createAppreciationVariables(template: Template) {
        val appreciationVariables = listOf(
            TemplateVariable(
                templateId = template.id,
                name = "سبب التقدير",
                type = "text",
                description = "سبب منح شهادة التقدير",
                previewValue = "التفوق الأكاديمي والإنجاز المتميز",
                required = true,
                order = 4,
                minLength = 10,
                maxLength = 500,
                pattern = null,
                minValue = null,
                maxValue = null,
                decimalPlaces = null,
                minDate = null,
                maxDate = null,
                format = null,
                options = null,
                multiple = false,
                createdAt = currentTime,
                updatedAt = currentTime
            ),
            TemplateVariable(
                templateId = template.id,
                name = "المستوى",
                type = "select",
                description = "مستوى التقدير",
                previewValue = "ممتاز",
                required = true,
                order = 5,
                minLength = null,
                maxLength = null,
                pattern = null,
                minValue = null,
                maxValue = null,
                decimalPlaces = null,
                minDate = null,
                maxDate = null,
                format = null,
                options = listOf("ممتاز", "جيد جداً", "جيد", "مقبول"),
                multiple = false,
                createdAt = currentTime,
                updatedAt = currentTime
            )
        )

        appreciationVariables.forEach { variable ->
            repositoryManager.templateVariableRepository.create(variable)
        }
    }

    private suspend fun createVolunteerVariables(template: Template) {
        val volunteerVariables = listOf(
            TemplateVariable(
                templateId = template.id,
                name = "نوع العمل التطوعي",
                type = "text",
                description = "وصف العمل التطوعي",
                previewValue = "تطوع في الأعمال الخيرية",
                required = true,
                order = 4,
                minLength = 5,
                maxLength = 200,
                pattern = null,
                minValue = null,
                maxValue = null,
                decimalPlaces = null,
                minDate = null,
                maxDate = null,
                format = null,
                options = null,
                multiple = false,
                createdAt = currentTime,
                updatedAt = currentTime
            ),
            TemplateVariable(
                templateId = template.id,
                name = "عدد ساعات التطوع",
                type = "number",
                description = "إجمالي ساعات العمل التطوعي",
                previewValue = "100",
                required = true,
                order = 5,
                minLength = null,
                maxLength = null,
                pattern = null,
                minValue = 1,
                maxValue = 1000,
                decimalPlaces = 0,
                minDate = null,
                maxDate = null,
                format = null,
                options = null,
                multiple = false,
                createdAt = currentTime,
                updatedAt = currentTime
            )
        )

        volunteerVariables.forEach { variable ->
            repositoryManager.templateVariableRepository.create(variable)
        }
    }

    private suspend fun createStudents() {
        println("🎓 Creating students...")

        val nationalities = Nationality.entries
        val genders = Gender.entries

        repeat(1000) { index ->
            val firstName = arabicFirstNames.random()
            val middleName = arabicMiddleNames.random()
            val lastName = arabicLastNames.random()
            val fullName = "$firstName $middleName $lastName"

            val student = Student(
                name = fullName,
                email = if (random.nextFloat() < 0.7) generateEmail(firstName, lastName) else null,
                phoneNumber = if (random.nextFloat() < 0.6) generatePhoneNumber() else null,
                dateOfBirth = if (random.nextFloat() < 0.8) generateDateOfBirth() else null,
                gender = if (random.nextFloat() < 0.9) genders.random() else null,
                nationality = if (random.nextFloat() < 0.75) nationalities.random() else null,
                createdAt = currentTime,
                updatedAt = currentTime
            )

            repositoryManager.studentRepository.create(student)

            if ((index + 1) % 100 == 0) {
                println("   📝 Created ${index + 1} students...")
            }
        }

        println("   ✅ Created 1000 students")
    }

    private fun generateEmail(firstName: String, lastName: String): String {
        val domains = listOf("gmail.com", "hotmail.com", "outlook.com", "yahoo.com")
        val randomNum = random.nextInt(100, 999)
        // Use simple transliteration for email-safe names
        val firstNameSafe = "$firstName${random.nextInt(1000, 9999)}"
        val lastNameSafe = "$lastName${random.nextInt(100, 999)}"
        return "${firstNameSafe}${lastNameSafe}$randomNum@${domains.random()}"
    }

    private fun generatePhoneNumber(): String {
        val prefix = "05"
        val number = random.nextInt(10000000, 99999999)
        return "$prefix$number"
    }

    private fun generateDateOfBirth(): LocalDate {
        val year = random.nextInt(1980, 2005)
        val month = random.nextInt(1, 13)
        val day = random.nextInt(1, 29) // Safe day range for all months
        return LocalDate(year, month, day)
    }

    data class CategoryData(
        val name: String,
        val description: String,
        val subcategories: List<CategoryData> = emptyList()
    )
}

/**
 * Main function to run the demo data seeder
 */
fun main() {
    // Initialize database configuration
    val config = ApplicationConfig("application.conf")
    DatabaseConfig.init(config)

    // Get database connection
    val database = org.jetbrains.exposed.v1.jdbc.Database.connect(DatabaseConfig.dataSource)

    // Initialize repository manager
    val repositoryManager = RepositoryManager.getInstance(database)

    // Run the seeder
    runBlocking {
        val seeder = DemoDataSeeder(repositoryManager)
        seeder.seedAllData()
    }
}
