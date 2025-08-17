package schema.type

import kotlinx.serialization.Serializable
import org.apache.commons.validator.routines.EmailValidator

@Serializable
data class Email(
    val value: String
) {
    init {
        require(EmailValidator.getInstance().isValid(value)) { "Invalid email address: $value" }
    }
}
