#!/usr/bin/env kotlin

@file:DependsOn("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
@file:DependsOn("org.jetbrains.exposed:exposed-core:0.44.1")
@file:DependsOn("org.jetbrains.exposed:exposed-jdbc:0.44.1")
@file:DependsOn("org.jetbrains.kotlinx:kotlinx-datetime:0.4.1")

import kotlinx.coroutines.runBlocking
import scripts.DemoDataSeeder
import repositories.RepositoryManager
import config.DatabaseConfig
import io.ktor.server.config.*

/**
 * Standalone script to run demo data seeding
 * Usage: kotlin SeedDemoData.kts
 */
fun main() {
    println("🚀 CGSV Demo Data Seeder")
    println("=".repeat(50))
    
    try {
        // Initialize database configuration
        val config = ApplicationConfig("application.yaml")
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
        
        println()
        println("🎉 Demo data seeding completed successfully!")
        println("You can now start your Ktor server and test the application.")
        
    } catch (e: Exception) {
        println("❌ Failed to seed demo data: ${e.message}")
        e.printStackTrace()
        System.exit(1)
    }
}

main()
