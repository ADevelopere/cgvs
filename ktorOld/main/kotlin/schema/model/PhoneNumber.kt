package schema.model

import com.google.i18n.phonenumbers.PhoneNumberUtil
import com.google.i18n.phonenumbers.Phonenumber

/**
 * Kotlin wrapper class for Google's PhoneNumber with validation support
 */

@ConsistentCopyVisibility
data class PhoneNumber private constructor(
    val number: String,
    val googlePhoneNumber: Phonenumber.PhoneNumber
) {
    constructor(number: String) : this(
        number,
        parseGooglePhoneNumber(number)
    )

    constructor(googlePhoneNumber: Phonenumber.PhoneNumber) : this(
        PhoneNumberUtil.getInstance().format(googlePhoneNumber, PhoneNumberUtil.PhoneNumberFormat.E164),
        googlePhoneNumber
    )

    companion object {
        val util: PhoneNumberUtil = PhoneNumberUtil.getInstance()
        private fun parseGooglePhoneNumber(number: String): Phonenumber.PhoneNumber {
            return util.parse(number, null)
        }
    }

    // Enum wrapper for CountryCodeSource
    enum class CountryCodeSource {
        FROM_NUMBER_WITH_PLUS_SIGN,
        FROM_NUMBER_WITH_IDD,
        FROM_NUMBER_WITHOUT_PLUS_SIGN,
        FROM_DEFAULT_COUNTRY,
        UNSPECIFIED;

        fun toGoogleEnum(): Phonenumber.PhoneNumber.CountryCodeSource {
            return when (this) {
                FROM_NUMBER_WITH_PLUS_SIGN -> Phonenumber.PhoneNumber.CountryCodeSource.FROM_NUMBER_WITH_PLUS_SIGN
                FROM_NUMBER_WITH_IDD -> Phonenumber.PhoneNumber.CountryCodeSource.FROM_NUMBER_WITH_IDD
                FROM_NUMBER_WITHOUT_PLUS_SIGN -> Phonenumber.PhoneNumber.CountryCodeSource.FROM_NUMBER_WITHOUT_PLUS_SIGN
                FROM_DEFAULT_COUNTRY -> Phonenumber.PhoneNumber.CountryCodeSource.FROM_DEFAULT_COUNTRY
                UNSPECIFIED -> Phonenumber.PhoneNumber.CountryCodeSource.UNSPECIFIED
            }
        }

        companion object {
            fun fromGoogleEnum(source: Phonenumber.PhoneNumber.CountryCodeSource): CountryCodeSource {
                return when (source) {
                    Phonenumber.PhoneNumber.CountryCodeSource.FROM_NUMBER_WITH_PLUS_SIGN -> FROM_NUMBER_WITH_PLUS_SIGN
                    Phonenumber.PhoneNumber.CountryCodeSource.FROM_NUMBER_WITH_IDD -> FROM_NUMBER_WITH_IDD
                    Phonenumber.PhoneNumber.CountryCodeSource.FROM_NUMBER_WITHOUT_PLUS_SIGN -> FROM_NUMBER_WITHOUT_PLUS_SIGN
                    Phonenumber.PhoneNumber.CountryCodeSource.FROM_DEFAULT_COUNTRY -> FROM_DEFAULT_COUNTRY
                    Phonenumber.PhoneNumber.CountryCodeSource.UNSPECIFIED -> UNSPECIFIED
                }
            }
        }
    }

    // Country Code properties and methods
    val hasCountryCode: Boolean
        get() = googlePhoneNumber.hasCountryCode()

    val countryCode: Int
        get() = googlePhoneNumber.countryCode

    fun setCountryCode(value: Int): PhoneNumber {
        googlePhoneNumber.setCountryCode(value)
        return this
    }

    fun clearCountryCode(): PhoneNumber {
        googlePhoneNumber.clearCountryCode()
        return this
    }

    // National Number properties and methods
    val hasNationalNumber: Boolean
        get() = googlePhoneNumber.hasNationalNumber()

    val nationalNumber: Long
        get() = googlePhoneNumber.nationalNumber

    fun setNationalNumber(value: Long): PhoneNumber {
        googlePhoneNumber.setNationalNumber(value)
        return this
    }

    fun clearNationalNumber(): PhoneNumber {
        googlePhoneNumber.clearNationalNumber()
        return this
    }

    // Extension properties and methods
    val hasExtension: Boolean
        get() = googlePhoneNumber.hasExtension()

    val extension: String
        get() = googlePhoneNumber.extension

    fun setExtension(value: String): PhoneNumber {
        googlePhoneNumber.setExtension(value)
        return this
    }

    fun clearExtension(): PhoneNumber {
        googlePhoneNumber.clearExtension()
        return this
    }

    // Italian Leading Zero properties and methods
    val hasItalianLeadingZero: Boolean
        get() = googlePhoneNumber.hasItalianLeadingZero()

    val isItalianLeadingZero: Boolean
        get() = googlePhoneNumber.isItalianLeadingZero

    fun setItalianLeadingZero(value: Boolean): PhoneNumber {
        googlePhoneNumber.setItalianLeadingZero(value)
        return this
    }

    fun clearItalianLeadingZero(): PhoneNumber {
        googlePhoneNumber.clearItalianLeadingZero()
        return this
    }

    // Number of Leading Zeros properties and methods
    val hasNumberOfLeadingZeros: Boolean
        get() = googlePhoneNumber.hasNumberOfLeadingZeros()

    val numberOfLeadingZeros: Int
        get() = googlePhoneNumber.numberOfLeadingZeros

    fun setNumberOfLeadingZeros(value: Int): PhoneNumber {
        googlePhoneNumber.setNumberOfLeadingZeros(value)
        return this
    }

    fun clearNumberOfLeadingZeros(): PhoneNumber {
        googlePhoneNumber.clearNumberOfLeadingZeros()
        return this
    }

    // Raw Input properties and methods
    val hasRawInput: Boolean
        get() = googlePhoneNumber.hasRawInput()

    val rawInput: String
        get() = googlePhoneNumber.rawInput

    fun setRawInput(value: String): PhoneNumber {
        googlePhoneNumber.setRawInput(value)
        return this
    }

    fun clearRawInput(): PhoneNumber {
        googlePhoneNumber.clearRawInput()
        return this
    }

    // Country Code Source properties and methods
    val hasCountryCodeSource: Boolean
        get() = googlePhoneNumber.hasCountryCodeSource()

    val countryCodeSource: CountryCodeSource
        get() = CountryCodeSource.fromGoogleEnum(googlePhoneNumber.countryCodeSource)

    fun setCountryCodeSource(value: CountryCodeSource): PhoneNumber {
        googlePhoneNumber.setCountryCodeSource(value.toGoogleEnum())
        return this
    }

    fun clearCountryCodeSource(): PhoneNumber {
        googlePhoneNumber.clearCountryCodeSource()
        return this
    }

    // Preferred Domestic Carrier Code properties and methods
    val hasPreferredDomesticCarrierCode: Boolean
        get() = googlePhoneNumber.hasPreferredDomesticCarrierCode()

    val preferredDomesticCarrierCode: String
        get() = googlePhoneNumber.preferredDomesticCarrierCode

    fun setPreferredDomesticCarrierCode(value: String): PhoneNumber {
        googlePhoneNumber.setPreferredDomesticCarrierCode(value)
        return this
    }

    fun clearPreferredDomesticCarrierCode(): PhoneNumber {
        googlePhoneNumber.clearPreferredDomesticCarrierCode()
        return this
    }

    // Utility methods
    fun clear(): PhoneNumber {
        googlePhoneNumber.clear()
        return this
    }

    fun mergeFrom(other: PhoneNumber): PhoneNumber {
        googlePhoneNumber.mergeFrom(other.googlePhoneNumber)
        return this
    }

    fun exactlySameAs(other: PhoneNumber): Boolean {
        return googlePhoneNumber.exactlySameAs(other.googlePhoneNumber)
    }


    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is PhoneNumber) return false
        if (number != other.number) return false
        if (!googlePhoneNumber.exactlySameAs(other.googlePhoneNumber)) return false
        return true
    }

    override fun hashCode(): Int {
        var result = number.hashCode()
        result = 31 * result + googlePhoneNumber.hashCode()
        return result
    }

    override fun toString(): String {
        return googlePhoneNumber.toString()
    }
}
