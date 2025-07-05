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
    implementation("com.zaxxer:HikariCP:5.1.0")
    testImplementation(libs.ktor.server.testHost)
    testImplementation(libs.kotlin.test.junit)
}


