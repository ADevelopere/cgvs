package scripts

import kotlinx.coroutines.runBlocking
import repositories.RepositoryManager
import config.DatabaseConfig
import io.ktor.server.config.*
import kotlin.system.exitProcess

/**
 * Validation script to check if demo data was created successfully
 */
object ValidateDemoData {

    @JvmStatic
    fun main(args: Array<String>) {
        println("🔍 Validating Demo Data")
        println("=".repeat(50))

        try {
            // Initialize database configuration
            val config = ApplicationConfig("application.yaml")
            DatabaseConfig.init(config)

            // Get database connection
            val database = org.jetbrains.exposed.v1.jdbc.Database.connect(DatabaseConfig.dataSource)

            // Initialize repository manager
            val repositoryManager = RepositoryManager.getInstance(database)

            // Run validation
            runBlocking {
                validateData(repositoryManager)
            }

        } catch (e: Exception) {
            println("❌ Validation failed: ${e.message}")
            e.printStackTrace()
            exitProcess(1)
        } finally {
            try {
                DatabaseConfig.close()
            } catch (_: Exception) {
                println("⚠️  Warning: Could not close database connection properly")
            }
        }
    }

    private suspend fun validateData(repositoryManager: RepositoryManager) {
        var totalErrors = 0

        // Check admin user
        print("👤 Checking admin user... ")
        val adminUser = repositoryManager.userRepository.findByEmail("admin@cgsv.com")
        if (adminUser != null) {
            println("✅ Found admin user")
        } else {
            println("❌ Admin user not found")
            totalErrors++
        }

        // Check categories
        print("📁 Checking template categories... ")
        val categories = repositoryManager.templateCategoryRepository.findAll()
        if (categories.isNotEmpty()) {
            println("✅ Found ${categories.size} categories")

            // Check for main categories
            val mainCategories = categories.filter { it.parentCategoryId == null }
            val subCategories = categories.filter { it.parentCategoryId != null }
            println("   📂 Main categories: ${mainCategories.size}")
            println("   📁 Sub categories: ${subCategories.size}")
        } else {
            println("❌ No categories found")
            totalErrors++
        }

        // Check templates
        print("📋 Checking templates... ")
        val templates = repositoryManager.templateRepository.findAll()
        if (templates.isNotEmpty()) {
            println("✅ Found ${templates.size} templates")
        } else {
            println("❌ No templates found")
            totalErrors++
        }

        // Check template variables
        print("🔧 Checking template variables... ")
        var totalVariables = 0
        templates.forEach { template ->
            val variables = repositoryManager.templateVariableRepository.findByTemplate(template.id)
            totalVariables += variables.size
        }
        if (totalVariables > 0) {
            println("✅ Found $totalVariables template variables")
        } else {
            println("❌ No template variables found")
            totalErrors++
        }

        // Check students
        print("🎓 Checking students... ")
        val students = repositoryManager.studentRepository.findAll()
        if (students.isNotEmpty()) {
            println("✅ Found ${students.size} students")

            // Show statistics
            val withEmail = students.count { it.email != null }
            val withPhone = students.count { it.phoneNumber != null }
            val withGender = students.count { it.gender != null }
            val withNationality = students.count { it.nationality != null }

            println("   📧 With email: $withEmail (${(withEmail * 100 / students.size)}%)")
            println("   📱 With phone: $withPhone (${(withPhone * 100 / students.size)}%)")
            println("   ⚧ With gender: $withGender (${(withGender * 100 / students.size)}%)")
            println("   🌍 With nationality: $withNationality (${(withNationality * 100 / students.size)}%)")
        } else {
            println("❌ No students found")
            totalErrors++
        }

        println()
        println("=".repeat(50))

        if (totalErrors == 0) {
            println("🎉 All validation checks passed!")
            println("✅ Demo data was created successfully")
        } else {
            println("❌ Validation failed with $totalErrors errors")
            println("💡 Try running the seeder again: ./gradlew seedDemoData")
            exitProcess(1)
        }
    }
}
