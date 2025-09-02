package scripts

import kotlinx.coroutines.runBlocking
import repositories.RepositoryManager
import config.DatabaseConfig
import io.ktor.server.config.*
import org.jetbrains.exposed.v1.jdbc.Database
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

            // Run the seeder
            runBlocking {
                val seeder = MinimalDemoDataSeeder(repositoryManager)
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
