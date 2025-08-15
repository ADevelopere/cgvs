plugins {
    alias(libs.plugins.kotlinJvm)
    alias(libs.plugins.ktor)
    alias(libs.plugins.kotlinSerialization)
}

group = "com.cgsv"
version = "0.0.1"

application {
    mainClass = "io.ktor.server.netty.EngineMain"
}

kotlin {
    jvmToolchain(24)
}

repositories {
    mavenCentral()
    maven { url = uri("https://packages.confluent.io/maven/") }
}

dependencies {
    implementation(libs.bundles.koin)
    implementation(libs.bundles.ktorServer)
    implementation(libs.bundles.ktorClient)
    implementation(libs.postgresql)
    implementation(libs.h2)
    implementation(libs.bundles.exposed)
    implementation(libs.bundles.ucasoftKtorCache)
    implementation(libs.logback.classic)
    implementation(libs.graphql.kotlin.ktor.server)
    implementation(libs.hikari.cp)
    implementation(libs.bcrypt)
    implementation("io.ktor:ktor-server-call-logging:2.3.0")
    testImplementation(libs.ktor.server.testHost)
    testImplementation(libs.kotlin.test.junit)
}

// Demo Data Tasks Group
tasks.register<JavaExec>("seedDemoData") {
    group = "Demo"
    description = "Populate the database with demo data"
    classpath = sourceSets.main.get().runtimeClasspath
    mainClass.set("scripts.SeedDemoDataApp")
}

tasks.register<JavaExec>("validateDemoData") {
    group = "Demo"
    description = "Validate that demo data was created successfully"
    classpath = sourceSets.main.get().runtimeClasspath
    mainClass.set("scripts.ValidateDemoData")
}

tasks.register("runWithDemoData") {
    group = "Demo"
    description = "Seed demo data and then run the application"
    dependsOn("seedDemoData", "run")
    tasks.findByName("run")?.mustRunAfter("seedDemoData")
}

tasks.register("cleanDemoData") {
    group = "Demo"
    description = "Clean all demo data from the database"
    doLast {
        println("⚠️  To clean demo data, manually truncate tables or recreate the database")
        println("   Example SQL commands:")
        println("   TRUNCATE TABLE students, template_categories, templates, template_variables RESTART IDENTITY CASCADE;")
        println("   DELETE FROM users WHERE email = 'admin@cgsv.com';")
    }
}


