package config

import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import java.net.URI
import java.nio.file.*

fun executeAllSqlFromResources() {
    transaction {
        val classLoader = this::class.java.classLoader
        val resource = classLoader.getResource("sql")
            ?: throw IllegalArgumentException("SQL resource directory not found")

        val sqlFiles = getSqlFiles(resource.toURI())

        sqlFiles.sorted().forEach { fileName ->
            println("Executing SQL file: $fileName")
            val inputStream = classLoader.getResourceAsStream("sql/$fileName")
                ?: throw IllegalArgumentException("SQL file not found: sql/$fileName")

            val sqlContent = inputStream.bufferedReader().use { it.readText() }

            sqlContent.split(";")
                .map { it.trim() }
                .filter { it.isNotEmpty() }
                .forEach { sqlStatement ->
                    exec(sqlStatement)
                }
        }
    }
}

fun executeAllSqlFromResourcesWithDetails(): Map<String, Int> {
    return transaction {
        val classLoader = this::class.java.classLoader
        val resource = classLoader.getResource("sql")
            ?: throw IllegalArgumentException("SQL resource directory not found")

        val sqlFiles = getSqlFiles(resource.toURI())
        val results = mutableMapOf<String, Int>()

        sqlFiles.sorted().forEach { fileName ->
            println("Executing SQL file: $fileName")
            val inputStream = classLoader.getResourceAsStream("sql/$fileName")
                ?: throw IllegalArgumentException("SQL file not found: sql/$fileName")

            val sqlContent = inputStream.bufferedReader().use { it.readText() }

            val statements = sqlContent.split(";")
                .map { it.trim() }
                .filter { it.isNotEmpty() }

            statements.forEach { sqlStatement ->
                exec(sqlStatement)
            }

            results[fileName] = statements.size
        }

        results
    }
}

private fun getSqlFiles(uri: URI): List<String> {
    return if (uri.scheme == "jar") {
        // Running from JAR
        FileSystems.newFileSystem(uri, emptyMap<String, Any>()).use { fs ->
            val sqlPath = fs.getPath("sql")
            Files.walk(sqlPath)
                .filter { Files.isRegularFile(it) }
                .filter { it.toString().endsWith(".sql") }
                .map { it.fileName.toString() }
                .toList()
        }
    } else {
        // Running from IDE/filesystem
        val sqlPath = Paths.get(uri)
        Files.walk(sqlPath)
            .filter { Files.isRegularFile(it) }
            .filter { it.toString().endsWith(".sql") }
            .map { it.fileName.toString() }
            .toList()
    }
}
