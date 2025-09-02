package scripts

import com.google.cloud.storage.Storage
import com.google.cloud.storage.StorageOptions
import kotlinx.coroutines.runBlocking
import repositories.RepositoryManager
import config.DatabaseConfig
import config.GcsConfig
import io.ktor.server.config.*
import org.jetbrains.exposed.v1.jdbc.Database
import services.FileInitializationService
import services.getStorageFromSecretManager
import services.storageDbService
import services.storageService
import kotlin.system.exitProcess

/**
 * The Main application to run demo data seeding
 * This can be run as a standalone application to populate the database with demo data
 */
object SeedDemoDataApp {

    @JvmStatic
    fun main(args: Array<String>) {
        println("🚀 CGVS Demo Data Seeder")
        println("=".repeat(50))

        try {
            // Initialize database configuration
            val config = ApplicationConfig("application.yaml")

            DatabaseConfig.init(config)
            // Get database connection
            val database = Database.connect(DatabaseConfig.dataSource)

            // Initialize repository manager
            val repositoryManager = RepositoryManager.getInstance(database)

            val gcsConfig = GcsConfig(
                bucketName = config.property("gcp.bucket_name").getString()
            )

            val projectId = config.property("gcp.project_id").getString()
            val secretId = config.property("gcp.secret_id").getString()
            val versionId = config.propertyOrNull("gcp.secret_version")?.getString() ?: "latest"

            val storage: Storage =
                getStorageFromSecretManager(projectId, secretId, versionId) ?: StorageOptions.getDefaultInstance().service

            val storageService = storageService(
                storage, gcsConfig, repositoryManager.storageRepository
            )

            val storageDbService = storageDbService(
                repositoryManager.storageRepository,
                gcsConfig
            )
            val fileInitializationService = FileInitializationService(
                storageService,
                storageDbService,
                storage,
                gcsConfig
            )

            // For demonstration purposes, we'll create a mock FileInitializationService
            // In a real application, this would be injected through DI
            println("⚠️  Note: FileInitializationService is not fully configured in standalone mode")
            println("⚠️  Run this seeder through the application startup for full file system integration")

            // Run the seeder with a minimal setup
            runBlocking {
                // Create a minimal demo seeder that doesn't require file services
                val seeder = DemoDataSeeder(repositoryManager, fileInitializationService)
                seeder.seedAllData()
            }

            println()
            println("🎉 Demo data seeding completed successfully!")
            println("You can now start your Ktor server and test the application.")

        } catch (e: Exception) {
            println("❌ Failed to seed demo data: ${e.message}")
            e.printStackTrace()
            exitProcess(1)
        } finally {
            // Close database connection
            try {
                DatabaseConfig.close()
            } catch (_: Exception) {
                println("⚠️  Warning: Could not close database connection properly")
            }
        }
    }
}
