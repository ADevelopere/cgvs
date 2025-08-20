package scripts

import at.favre.lib.crypto.bcrypt.BCrypt
import kotlinx.coroutines.runBlocking
import kotlinx.datetime.Clock
import kotlinx.datetime.LocalDate
import kotlinx.datetime.TimeZone
import kotlinx.datetime.toLocalDateTime
import repositories.RepositoryManager
import config.DatabaseConfig
import io.ktor.server.config.*
import schema.model.Email
import schema.model.Gender
import schema.model.CountryCode
import schema.model.Student
import schema.model.Template
import schema.model.TemplateCategory
import schema.model.TextTemplateVariable
import schema.model.NumberTemplateVariable
import schema.model.DateTemplateVariable
import schema.model.SelectTemplateVariable
import schema.model.User
import tables.CategorySpecialType
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
            email = Email("admin@cgvs.com"),
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

        // Create special type categories first (main and suspension)
        val mainCategory = TemplateCategory(
            name = "الفئة الرئيسية",
            description = "الفئة الرئيسية لجميع الشهادات",
            parentCategoryId = null,
            order = 0,
            categorySpecialType = CategorySpecialType.Main,
            createdAt = currentTime,
            updatedAt = currentTime
        )
        val createdMain = repositoryManager.templateCategoryRepository.create(mainCategory)
        allCategories.add(createdMain)

        val suspensionCategory = TemplateCategory(
            name = "فئة الإيقاف",
            description = "فئة الشهادات الموقوفة أو المعلقة",
            parentCategoryId = null,
            order = 1,
            categorySpecialType = CategorySpecialType.Suspension,
            createdAt = currentTime,
            updatedAt = currentTime
        )
        val createdSuspension = repositoryManager.templateCategoryRepository.create(suspensionCategory)
        allCategories.add(createdSuspension)

        // Now create the rest of the categories as before
        templateCategoriesData.forEachIndexed { index, categoryData ->
            // Create parent category
            val parentCategory = TemplateCategory(
                name = categoryData.name,
                description = categoryData.description,
                parentCategoryId = null,
                order = index + 2, // shift order to avoid 0 and 1
                categorySpecialType = null,
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
            "templateCover/demo1.jpg",
            "templateCover/demo2.jpg",
            "templateCover/demo3.jpg",
            "templateCover/demo4.jpg",
        )

        topLevelCategories.forEachIndexed { index, category ->
            val template = Template(
                name = "نموذج ${category.name}",
                description = "نموذج تجريبي لـ${category.name}",
                imageFileName = demoImages[index % demoImages.size],
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
            TextTemplateVariable(
                templateId = template.id,
                name = "اسم الطالب",
                description = "الاسم الكامل للطالب",
                required = true,
                order = 1,
                textPreviewValue = "محمد أحمد العتيبي",
                minLength = 3,
                maxLength = 100,
                pattern = null,
                createdAt = currentTime,
                updatedAt = currentTime
            ),
            DateTemplateVariable(
                templateId = template.id,
                name = "تاريخ الإصدار",
                description = "تاريخ إصدار الشهادة",
                required = true,
                order = 2,
                datePreviewValue = currentTime.date,
                minDate = null,
                maxDate = null,
                format = "Y-m-d",
                createdAt = currentTime,
                updatedAt = currentTime
            ),
            TextTemplateVariable(
                templateId = template.id,
                name = "الرقم المرجعي",
                description = "الرقم المرجعي للشهادة",
                required = true,
                order = 3,
                textPreviewValue = "CERT2024",
                minLength = 8,
                maxLength = 8,
                pattern = "^[A-Z0-9]{8}$",
                createdAt = currentTime,
                updatedAt = currentTime
            )
        )

        baseVariables.forEach { variable ->
            when (variable) {
                is TextTemplateVariable -> repositoryManager.templateVariableRepository.createTextTemplateVariable(variable)
                is NumberTemplateVariable -> repositoryManager.templateVariableRepository.createNumberTemplateVariable(variable)
                is DateTemplateVariable -> repositoryManager.templateVariableRepository.createDateTemplateVariable(variable)
                is SelectTemplateVariable -> repositoryManager.templateVariableRepository.createSelectTemplateVariable(variable)
            }
        }
    }

    private suspend fun createAcademicVariables(template: Template) {
        val academicVariables = listOf(
            TextTemplateVariable(
                templateId = template.id,
                name = "التخصص",
                description = "التخصص الأكاديمي",
                required = true,
                order = 4,
                textPreviewValue = "علوم الحاسب",
                minLength = 3,
                maxLength = 100,
                pattern = null,
                createdAt = currentTime,
                updatedAt = currentTime
            ),
            NumberTemplateVariable(
                templateId = template.id,
                name = "المعدل",
                description = "المعدل التراكمي",
                required = true,
                order = 5,
                numberPreviewValue = 4.5,
                minValue = 0.0,
                maxValue = 5.0,
                decimalPlaces = 2,
                createdAt = currentTime,
                updatedAt = currentTime
            )
        )

        academicVariables.forEach { variable ->
            when (variable) {
                is TextTemplateVariable -> repositoryManager.templateVariableRepository.createTextTemplateVariable(variable)
                is NumberTemplateVariable -> repositoryManager.templateVariableRepository.createNumberTemplateVariable(variable)
                is DateTemplateVariable -> repositoryManager.templateVariableRepository.createDateTemplateVariable(variable)
                is SelectTemplateVariable -> repositoryManager.templateVariableRepository.createSelectTemplateVariable(variable)
            }
        }
    }

    private suspend fun createProfessionalVariables(template: Template) {
        val professionalVariables = listOf(
            SelectTemplateVariable(
                templateId = template.id,
                name = "المجال",
                description = "مجال التدريب",
                required = true,
                order = 4,
                selectPreviewValue = "تقنية المعلومات",
                options = listOf(
                    "تقنية المعلومات",
                    "إدارة الأعمال",
                    "الموارد البشرية",
                    "التسويق الرقمي",
                    "إدارة المشاريع"
                ),
                multiple = false,
                createdAt = currentTime,
                updatedAt = currentTime
            ),
            NumberTemplateVariable(
                templateId = template.id,
                name = "مدة التدريب",
                description = "عدد ساعات التدريب",
                required = true,
                order = 5,
                numberPreviewValue = 40.0,
                minValue = 1.0,
                maxValue = 1000.0,
                decimalPlaces = 0,
                createdAt = currentTime,
                updatedAt = currentTime
            )
        )

        professionalVariables.forEach { variable ->
            when (variable) {
                is TextTemplateVariable -> repositoryManager.templateVariableRepository.createTextTemplateVariable(variable)
                is NumberTemplateVariable -> repositoryManager.templateVariableRepository.createNumberTemplateVariable(variable)
                is DateTemplateVariable -> repositoryManager.templateVariableRepository.createDateTemplateVariable(variable)
                is SelectTemplateVariable -> repositoryManager.templateVariableRepository.createSelectTemplateVariable(variable)
            }
        }
    }

    private suspend fun createAttendanceVariables(template: Template) {
        val attendanceVariables = listOf(
            TextTemplateVariable(
                templateId = template.id,
                name = "اسم الفعالية",
                description = "اسم المؤتمر أو ورشة العمل",
                required = true,
                order = 4,
                textPreviewValue = "مؤتمر التقنية السنوي",
                minLength = 5,
                maxLength = 200,
                pattern = null,
                createdAt = currentTime,
                updatedAt = currentTime
            ),
            TextTemplateVariable(
                templateId = template.id,
                name = "مكان الانعقاد",
                description = "مكان انعقاد الفعالية",
                required = true,
                order = 5,
                textPreviewValue = "الرياض",
                minLength = 3,
                maxLength = 100,
                pattern = null,
                createdAt = currentTime,
                updatedAt = currentTime
            )
        )

        attendanceVariables.forEach { variable ->
            repositoryManager.templateVariableRepository.createTextTemplateVariable(variable)
        }
    }

    private suspend fun createAppreciationVariables(template: Template) {
        val appreciationVariables = listOf(
            TextTemplateVariable(
                templateId = template.id,
                name = "سبب التقدير",
                description = "سبب منح شهادة التقدير",
                required = true,
                order = 4,
                textPreviewValue = "التفوق الأكاديمي والإنجاز المتميز",
                minLength = 10,
                maxLength = 500,
                pattern = null,
                createdAt = currentTime,
                updatedAt = currentTime
            ),
            SelectTemplateVariable(
                templateId = template.id,
                name = "المستوى",
                description = "مستوى التقدير",
                required = true,
                order = 5,
                selectPreviewValue = "ممتاز",
                options = listOf("ممتاز", "جيد جداً", "جيد", "مقبول"),
                multiple = false,
                createdAt = currentTime,
                updatedAt = currentTime
            )
        )

        appreciationVariables.forEach { variable ->
            when (variable) {
                is TextTemplateVariable -> repositoryManager.templateVariableRepository.createTextTemplateVariable(variable)
                is NumberTemplateVariable -> repositoryManager.templateVariableRepository.createNumberTemplateVariable(variable)
                is DateTemplateVariable -> repositoryManager.templateVariableRepository.createDateTemplateVariable(variable)
                is SelectTemplateVariable -> repositoryManager.templateVariableRepository.createSelectTemplateVariable(variable)
            }
        }
    }

    private suspend fun createVolunteerVariables(template: Template) {
        val volunteerVariables = listOf(
            TextTemplateVariable(
                templateId = template.id,
                name = "نوع العمل التطوعي",
                description = "وصف العمل التطوعي",
                required = true,
                order = 4,
                textPreviewValue = "تطوع في الأعمال الخيرية",
                minLength = 5,
                maxLength = 200,
                pattern = null,
                createdAt = currentTime,
                updatedAt = currentTime
            ),
            NumberTemplateVariable(
                templateId = template.id,
                name = "عدد ساعات التطوع",
                description = "إجمالي ساعات العمل التطوعي",
                required = true,
                order = 5,
                numberPreviewValue = 100.0,
                minValue = 1.0,
                maxValue = 1000.0,
                decimalPlaces = 0,
                createdAt = currentTime,
                updatedAt = currentTime
            )
        )

        volunteerVariables.forEach { variable ->
            when (variable) {
                is TextTemplateVariable -> repositoryManager.templateVariableRepository.createTextTemplateVariable(variable)
                is NumberTemplateVariable -> repositoryManager.templateVariableRepository.createNumberTemplateVariable(variable)
                is DateTemplateVariable -> repositoryManager.templateVariableRepository.createDateTemplateVariable(variable)
                is SelectTemplateVariable -> repositoryManager.templateVariableRepository.createSelectTemplateVariable(variable)
            }
        }
    }

    private suspend fun createStudents() {
        println("🎓 Creating students...")

        val nationalities = CountryCode.entries
        val genders = Gender.entries

        repeat(1000) { index ->
            val firstName = arabicFirstNames.random()
            val middleName = arabicMiddleNames.random()
            val lastName = arabicLastNames.random()
            val fullName = "$firstName $middleName $lastName"

            val phoneNumber = if (random.nextFloat() < 0.6) generatePhoneNumber() else null

            val student = Student(
                name = fullName,
                email = if (random.nextFloat() < 0.7) generateEmail(firstName, lastName) else null,
                phoneNumber = phoneNumber,
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

    private fun generateEmail(firstName: String, lastName: String): Email {
        val domains = listOf("gmail.com", "hotmail.com", "outlook.com", "yahoo.com")
        val randomNum = random.nextInt(100, 999)
        // Use simple transliteration for email-safe names
        val firstNameSafe = "$firstName${random.nextInt(1000, 9999)}"
        val lastNameSafe = "$lastName${random.nextInt(100, 999)}"
        return Email("${firstNameSafe}${lastNameSafe}$randomNum@${domains.random()}")
    }

    private fun generatePhoneNumber(): schema.model.PhoneNumber {
        // Generate a random Saudi mobile number (E.164 format: +9665XXXXXXXX)
        val countryCode = "+966"
        val secondDigit = random.nextInt(0, 10)
        val rest = random.nextInt(1000000, 9999999)
        val number = "${countryCode}5${secondDigit}${rest}"
        return schema.model.PhoneNumber(number)
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
