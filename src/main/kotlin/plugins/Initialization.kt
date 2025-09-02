package plugins

import io.ktor.server.application.*
import kotlinx.coroutines.launch
import org.koin.ktor.ext.inject
import services.FileInitializationService
import scripts.DemoDataSeeder
import repositories.RepositoryManager
import org.jetbrains.exposed.v1.jdbc.Database

fun Application.configureInitialization() {
    monitor.subscribe(ApplicationStarted) {
        launch {
            try {
                // Initialize file system
                val fileInitService by inject<FileInitializationService>()
                fileInitService.initializeFileSystem()
                
                // Check if we should seed demo data
                val shouldSeedDemo = environment.config.propertyOrNull("app.seedDemoData")?.getString()?.toBoolean() ?: false
                
                if (shouldSeedDemo) {
                    log.info("Seeding demo data...")
                    val database by inject<Database>()
                    val repositoryManager = RepositoryManager.getInstance(database)
                    val demoSeeder = DemoDataSeeder(repositoryManager, fileInitService)
                    demoSeeder.seedAllData()
                    log.info("Demo data seeding completed")
                }
            } catch (e: Exception) {
                log.error("Failed to complete initialization", e)
            }
        }
    }
}