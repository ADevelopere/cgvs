package scripts

import at.favre.lib.crypto.bcrypt.BCrypt
import kotlinx.datetime.LocalDate
import repositories.RepositoryManager
import schema.model.*
import services.FileInitializationService
import tables.CategorySpecialType
import util.now
import kotlin.random.Random

/**
 * Demo Data Seeder for Ktor CGVS Application
 * This script creates sample data for testing and demonstration purposes
 */ * Routes variable creation based on the template's category.
 */
async function createTemplateVariables(
    template: Template,
    category: TemplateCategory,
) {
    const baseVariables = [
        {
            templateId: template.id,
            type: TemplateVariableType.TEXT,
            name: "اسم الطالب",
            description: "الاسم الكامل للطالب",
            required: true,
            order: 1,
            textPreviewValue: "محمد أحمد العتيبي",
            minLength: 3,
            maxLength: 100,
        },
        {
            templateId: template.id,
            type: TemplateVariableType.DATE,
            name: "تاريخ الإصدار",
            description: "تاريخ إصدار الشهادة",
            required: true,
            order: 2,
            datePreviewValue: new Date(),
            format: "YYYY-MM-DD",
        },
        {
            templateId: template.id,
            type: TemplateVariableType.TEXT,
            name: "الرقم المرجعي",
            description: "الرقم المرجعي للشهادة",
            required: true,
            order: 3,
            textPreviewValue: "CERT2024",
            minLength: 8,
            maxLength: 8,
            pattern: "^[A-Z0-9]{8}$",
        },
    ];

    let categoryVariables: any[] = [];
    switch (category.name) {
        case "الشهادات الأكاديمية":
            categoryVariables = [
                {
                    templateId: template.id,
                    type: TemplateVariableType.TEXT,
                    name: "التخصص",
                    description: "التخصص الأكاديمي",
                    required: true,
                    order: 4,
                    textPreviewValue: "علوم الحاسب",
                    minLength: 3,
                    maxLength: 100,
                },
                {
                    templateId: template.id,
                    type: TemplateVariableType.NUMBER,
                    name: "المعدل",
                    description: "المعدل التراكمي",
                    required: true,
                    order: 5,
                    numberPreviewValue: 4.5,
                    minValue: 0.0,
                    maxValue: 5.0,
                    decimalPlaces: 2,
                },
            ];
            break;
        case "الشهادات المهنية":
            categoryVariables = [
                {
                    templateId: template.id,
                    type: TemplateVariableType.SELECT,
                    name: "المجال",
                    description: "مجال التدريب",
                    required: true,
                    order: 4,
                    selectPreviewValue: "تقنية المعلومات",
                    options: [
                        "تقنية المعلومات",
                        "إدارة الأعمال",
                        "الموارد البشرية",
                        "التسويق الرقمي",
                        "إدارة المشاريع",
                    ],
                    multiple: false,
                },
                {
                    templateId: template.id,
                    type: TemplateVariableType.NUMBER,
                    name: "مدة التدريب",
                    description: "عدد ساعات التدريب",
                    required: true,
                    order: 5,
                    numberPreviewValue: 40,
                    minValue: 1,
                    maxValue: 1000,
                    decimalPlaces: 0,
                },
            ];
            break;
        case "شهادات الحضور":
            categoryVariables = [
                {
                    templateId: template.id,
                    type: TemplateVariableType.TEXT,
                    name: "اسم الفعالية",
                    description: "اسم المؤتمر أو ورشة العمل",
                    required: true,
                    order: 4,
                    textPreviewValue: "مؤتمر التقنية السنوي",
                    minLength: 5,
                    maxLength: 200,
                },
                {
                    templateId: template.id,
                    type: TemplateVariableType.TEXT,
                    name: "مكان الانعقاد",
                    description: "مكان انعقاد الفعالية",
                    required: true,
                    order: 5,
                    textPreviewValue: "الرياض",
                    minLength: 3,
                    maxLength: 100,
                },
            ];
            break;
        case "شهادات التقدير":
            categoryVariables = [
                {
                    templateId: template.id,
                    type: TemplateVariableType.TEXT,
                    name: "سبب التقدير",
                    description: "سبب منح شهادة التقدير",
                    required: true,
                    order: 4,
                    textPreviewValue: "التفوق الأكاديمي والإنجاز المتميز",
                    minLength: 10,
                    maxLength: 500,
                },
                {
                    templateId: template.id,
                    type: TemplateVariableType.SELECT,
                    name: "المستوى",
                    description: "مستوى التقدير",
                    required: true,
                    order: 5,
                    selectPreviewValue: "ممتاز",
                    options: ["ممتاز", "جيد جداً", "جيد", "مقبول"],
                    multiple: false,
                },
            ];
            break;
        case "الشهادات التطوعية":
            categoryVariables = [
                {
                    templateId: template.id,
                    type: TemplateVariableType.TEXT,
                    name: "نوع العمل التطوعي",
                    description: "وصف العمل التطوعي",
                    required: true,
                    order: 4,
                    textPreviewValue: "تطوع في الأعمال الخيرية",
                    minLength: 5,
                    maxLength: 200,
                },
                {
                    templateId: template.id,
                    type: TemplateVariableType.NUMBER,
                    name: "عدد ساعات التطوع",
                    description: "إجمالي ساعات العمل التطوعي",
                    required: true,
                    order: 5,
                    numberPreviewValue: 100,
                    minValue: 1,
                    maxValue: 1000,
                    decimalPlaces: 0,
                },
            ];
            break;
    }

    await prisma.templateVariable.createMany({
        data: [...baseVariables, ...categoryVariables],
    });
}

class DemoDataSeeder(
    private val repositoryManager: RepositoryManager,
    private val fileInitializationService: FileInitializationService
) {

    private val random = Random.Default
    private val currentTime = now()

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
            // 1. Initialize file system first
            fileInitializationService.initializeFileSystem()

            // 2. Create admin user
            createAdminUser()

            // 3. Create template categories
            val categories = createTemplateCategories()

            // 4. Create templates
            val templates = createTemplates(categories)

            // 5. Create students
            val students = createStudents()

            // 6. Create recipient groups
            val groups = createRecipientGroups(templates)

            // 7. Create recipient group items
            val items = createRecipientGroupItems(groups, students)

            println("✅ Demo data seeding completed successfully!")
            println("📊 Summary:")
            println("   - Admin user: admin@cgvs.com (password: cgvs@123)")
            println("   - Categories: ${categories.size}")
            println("   - Templates: ${templates.size}")
            println("   - Students: ${students.size}")
            println("   - Recipient Groups: ${groups.size}")
            println("   - Recipient Group Items: ${items.size}")

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
        // Check if main category already exists
        val existingMain = repositoryManager.templateCategoryRepository.mainCategory()
        val mainCategory = if (existingMain != null) {
            println("   ✅ Main category already exists")
            existingMain
        } else {
            val newMain = TemplateCategory(
                name = "الفئة الرئيسية",
                description = "الفئة الرئيسية لجميع الشهادات",
                parentCategoryId = null,
                order = 0,
                categorySpecialType = CategorySpecialType.Main,
                createdAt = currentTime,
                updatedAt = currentTime
            )
            repositoryManager.templateCategoryRepository.create(newMain)
        }
        allCategories.add(mainCategory)

        // Check if the suspension category already exists
        val existingSuspension = repositoryManager.templateCategoryRepository.suspensionCategory()
        val suspensionCategory = if (existingSuspension != null) {
            println("   ✅ Suspension category already exists")
            existingSuspension
        } else {
            val newSuspension = TemplateCategory(
                name = "فئة الإيقاف",
                description = "فئة الشهادات الموقوفة أو المعلقة",
                parentCategoryId = null,
                order = 1,
                categorySpecialType = CategorySpecialType.Suspension,
                createdAt = currentTime,
                updatedAt = currentTime
            )
            repositoryManager.templateCategoryRepository.create(newSuspension)
        }
        allCategories.add(suspensionCategory)

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

    private suspend fun createTemplates(categories: List<TemplateCategory>): List<Template> {
        println("📋 Creating templates...")
        val createdTemplates = mutableListOf<Template>()

        // Get demo file IDs from the file initialization service
        val demoFileIds = fileInitializationService.getDemoFileIds()

        if (demoFileIds.isEmpty()) {
            println("   ⚠️  No demo files available for templates")
        }

        // Create one template per top-level category
        val topLevelCategories = categories.filter { it.parentCategoryId == null }

        topLevelCategories.forEachIndexed { index, category ->
            val template = Template(
                name = "نموذج ${category.name}",
                description = "نموذج تجريبي لـ${category.name}",
                imageFileId = if (demoFileIds.isNotEmpty()) demoFileIds[index % demoFileIds.size] else null,
                categoryId = category.id,
                order = 1,
                createdAt = currentTime,
                updatedAt = currentTime
            )

            val createdTemplate = repositoryManager.templateRepository.create(template)
            createdTemplates.add(createdTemplate)

            // Register file usage if the template has an image
            if (createdTemplate.imageFileId != null) {
                fileInitializationService.registerTemplateFileUsage(createdTemplate.id, createdTemplate.imageFileId)
            }

            // Create template variables for this template
            createTemplateVariables(createdTemplate, category)
        }

        println("   ✅ Created ${createdTemplates.size} templates")
        return createdTemplates
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
                is TextTemplateVariable -> repositoryManager.templateVariableRepository.createTextTemplateVariable(
                    variable
                )

                is NumberTemplateVariable -> repositoryManager.templateVariableRepository.createNumberTemplateVariable(
                    variable
                )

                is DateTemplateVariable -> repositoryManager.templateVariableRepository.createDateTemplateVariable(
                    variable
                )

                is SelectTemplateVariable -> repositoryManager.templateVariableRepository.createSelectTemplateVariable(
                    variable
                )
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
                is TextTemplateVariable -> repositoryManager.templateVariableRepository.createTextTemplateVariable(
                    variable
                )

                is NumberTemplateVariable -> repositoryManager.templateVariableRepository.createNumberTemplateVariable(
                    variable
                )

                is DateTemplateVariable -> repositoryManager.templateVariableRepository.createDateTemplateVariable(
                    variable
                )

                is SelectTemplateVariable -> repositoryManager.templateVariableRepository.createSelectTemplateVariable(
                    variable
                )
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
                is TextTemplateVariable -> repositoryManager.templateVariableRepository.createTextTemplateVariable(
                    variable
                )

                is NumberTemplateVariable -> repositoryManager.templateVariableRepository.createNumberTemplateVariable(
                    variable
                )

                is DateTemplateVariable -> repositoryManager.templateVariableRepository.createDateTemplateVariable(
                    variable
                )

                is SelectTemplateVariable -> repositoryManager.templateVariableRepository.createSelectTemplateVariable(
                    variable
                )
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
                is TextTemplateVariable -> repositoryManager.templateVariableRepository.createTextTemplateVariable(
                    variable
                )

                is NumberTemplateVariable -> repositoryManager.templateVariableRepository.createNumberTemplateVariable(
                    variable
                )

                is DateTemplateVariable -> repositoryManager.templateVariableRepository.createDateTemplateVariable(
                    variable
                )

                is SelectTemplateVariable -> repositoryManager.templateVariableRepository.createSelectTemplateVariable(
                    variable
                )
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
                is TextTemplateVariable -> repositoryManager.templateVariableRepository.createTextTemplateVariable(
                    variable
                )

                is NumberTemplateVariable -> repositoryManager.templateVariableRepository.createNumberTemplateVariable(
                    variable
                )

                is DateTemplateVariable -> repositoryManager.templateVariableRepository.createDateTemplateVariable(
                    variable
                )

                is SelectTemplateVariable -> repositoryManager.templateVariableRepository.createSelectTemplateVariable(
                    variable
                )
            }
        }
    }

    private suspend fun createStudents(): List<Student> {
        println("🎓 Creating students...")
        val createdStudents = mutableListOf<Student>()

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

            val createdStudent = repositoryManager.studentRepository.create(student)
            createdStudents.add(createdStudent)

            if ((index + 1) % 100 == 0) {
                println("   📝 Created ${index + 1} students...")
            }
        }

        println("   ✅ Created 1000 students")
        return createdStudents
    }

    private fun generateEmail(firstName: String, lastName: String): Email {
        val domains = listOf("gmail.com", "hotmail.com", "outlook.com", "yahoo.com")
        val randomNum = random.nextInt(100, 999)
        // Use simple transliteration for email-safe names
        val firstNameSafe = "$firstName${random.nextInt(1000, 9999)}"
        val lastNameSafe = "$lastName${random.nextInt(100, 999)}"
        return Email("${firstNameSafe}${lastNameSafe}$randomNum@${domains.random()}")
    }

    private fun generatePhoneNumber(): PhoneNumber {
        // Generate a random Saudi mobile number (E.164 format: +9665XXXXXXXX)
        val countryCode = "+966"
        val secondDigit = random.nextInt(0, 10)
        val rest = random.nextInt(1000000, 9999999)
        val number = "${countryCode}5${secondDigit}${rest}"
        return PhoneNumber(number)
    }

    private fun generateDateOfBirth(): LocalDate {
        val year = random.nextInt(1980, 2005)
        val month = random.nextInt(1, 13)
        val day = random.nextInt(1, 29) // Safe day range for all months
        return LocalDate(year, month, day)
    }

    private suspend fun createRecipientGroups(templates: List<Template>): List<TemplateRecipientGroup> {
        println("👥 Creating recipient groups...")
        val createdGroups = mutableListOf<TemplateRecipientGroup>()

        if (templates.isEmpty()) {
            println("   ⚠️ No templates available to create recipient groups.")
            return createdGroups
        }

        templates.forEach { template ->
            // Create 2 groups per template
            repeat(2) { i ->
                val groupInput = CreateRecipientGroupInput(
                    templateId = template.id,
                    name = "مجموعة ${template.name} ${i + 1}",
                    description = "وصف لمجموعة ${template.name} ${i + 1}",
                    date = currentTime
                )
                val createdGroup = repositoryManager.recipientGroupRepository.create(groupInput)
                createdGroups.add(createdGroup)
            }
        }

        println("   ✅ Created ${createdGroups.size} recipient groups.")
        return createdGroups
    }

    private suspend fun createRecipientGroupItems(
        groups: List<TemplateRecipientGroup>,
        students: List<Student>
    ): List<TemplateRecipientGroupItem> {
        println("👥 Creating recipient group items...")
        val createdItems = mutableListOf<TemplateRecipientGroupItem>()

        if (groups.isEmpty() || students.isEmpty()) {
            println("   ⚠️ No groups or students available to create recipient group items.")
            return createdItems
        }

        groups.forEach { group ->
            // Add a random number of students (10 to 50) to this group
            val studentCount = random.nextInt(10, 51)
            val shuffledStudents = students.shuffled()

            shuffledStudents.take(studentCount).forEach { student ->
                val itemInput = AddStudentToRecipientGroupInput(
                    groupId = group.id,
                    studentId = student.id
                )
                try {
                    val createdItem = repositoryManager.recipientGroupItemRepository.addStudent(itemInput)
                    createdItems.add(createdItem)
                } catch (_: Exception) {
                    // Ignore unique constraint violations if a student is already in the group
                }
            }
        }

        println("   ✅ Created ${createdItems.size} recipient group items.")
        return createdItems
    }
}

data class CategoryData(
    val name: String,
    val description: String,
    val subcategories: List<CategoryData> = emptyList()
)
