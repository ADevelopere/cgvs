package config

data class GcsConfig(
    val bucketName: String
){
    val baseUrl = "https://storage.googleapis.com/${bucketName}/"
}
