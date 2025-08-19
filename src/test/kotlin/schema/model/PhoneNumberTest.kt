package schema.type

import com.google.i18n.phonenumbers.NumberParseException
import kotlin.test.*
import com.google.i18n.phonenumbers.Phonenumber

class PhoneNumberTest {


    @Test
    fun `test basic data class properties and parsing`() {
        val phoneNumber = PhoneNumber("+12025550123")
        assertEquals("+12025550123", phoneNumber.number)
        // Should parse as US number
        assertTrue(phoneNumber.hasCountryCode)
        assertEquals(1, phoneNumber.countryCode)
        assertTrue(phoneNumber.hasNationalNumber)
        assertEquals(2025550123L, phoneNumber.nationalNumber)

        // Should throw NumberParseException for invalid input
        assertFailsWith<NumberParseException> {
            PhoneNumber("invalid")
        }
    }


    @Test
    fun `test default parsing`() {
        val phoneNumber = PhoneNumber("+442083661177") // UK number
        assertTrue(phoneNumber.hasCountryCode)
        assertEquals(44, phoneNumber.countryCode)
        assertTrue(phoneNumber.hasNationalNumber)
        assertEquals(2083661177L, phoneNumber.nationalNumber)
    }


    @Test
    fun `test country code operations`() {
        val phoneNumber = PhoneNumber("+12025550123")
        // Should have country code from parsing
        assertTrue(phoneNumber.hasCountryCode)
        assertEquals(1, phoneNumber.countryCode)

        // Set country code
        phoneNumber.setCountryCode(44)
        assertTrue(phoneNumber.hasCountryCode)
        assertEquals(44, phoneNumber.countryCode)

        // Clear country code
        phoneNumber.clearCountryCode()
        assertFalse(phoneNumber.hasCountryCode)
        assertEquals(0, phoneNumber.countryCode)
    }


    @Test
    fun `test national number operations`() {
        val phoneNumber = PhoneNumber("+12025550123")
        // Should have national number from parsing
        assertTrue(phoneNumber.hasNationalNumber)
        assertEquals(2025550123L, phoneNumber.nationalNumber)

        // Set national number
        phoneNumber.setNationalNumber(9876543210L)
        assertTrue(phoneNumber.hasNationalNumber)
        assertEquals(9876543210L, phoneNumber.nationalNumber)

        // Clear national number
        phoneNumber.clearNationalNumber()
        assertFalse(phoneNumber.hasNationalNumber)
        assertEquals(0L, phoneNumber.nationalNumber)
    }

    @Test
    fun `test extension operations`() {
        val phoneNumber = PhoneNumber("+12025550123")

        // Initially should not have extension
        assertFalse(phoneNumber.hasExtension)
        assertEquals("", phoneNumber.extension)

        // Set extension
        phoneNumber.setExtension("123")
        assertTrue(phoneNumber.hasExtension)
        assertEquals("123", phoneNumber.extension)

        // Clear extension
        phoneNumber.clearExtension()
        assertFalse(phoneNumber.hasExtension)
        assertEquals("", phoneNumber.extension)
    }

    @Test
    fun `test italian leading zero operations`() {
        val phoneNumber = PhoneNumber("+12025550123") // Italian number

        // Initially should not have italian leading zero
        assertFalse(phoneNumber.hasItalianLeadingZero)
        assertFalse(phoneNumber.isItalianLeadingZero)

        // Set italian leading zero
        phoneNumber.setItalianLeadingZero(true)
        assertTrue(phoneNumber.hasItalianLeadingZero)
        assertTrue(phoneNumber.isItalianLeadingZero)

        // Clear italian leading zero
        phoneNumber.clearItalianLeadingZero()
        assertFalse(phoneNumber.hasItalianLeadingZero)
        assertFalse(phoneNumber.isItalianLeadingZero)
    }

    @Test
    fun `test number of leading zeros operations`() {
        val phoneNumber = PhoneNumber("+390612345678") // Italian number

        // Initially should not have number of leading zeros set
        assertFalse(phoneNumber.hasNumberOfLeadingZeros)
        assertEquals(1, phoneNumber.numberOfLeadingZeros) // Default value is 1

        // Set number of leading zeros
        phoneNumber.setNumberOfLeadingZeros(3)
        assertTrue(phoneNumber.hasNumberOfLeadingZeros)
        assertEquals(3, phoneNumber.numberOfLeadingZeros)

        // Clear number of leading zeros
        phoneNumber.clearNumberOfLeadingZeros()
        assertFalse(phoneNumber.hasNumberOfLeadingZeros)
        assertEquals(1, phoneNumber.numberOfLeadingZeros) // Back to default
    }

    @Test
    fun `test raw input operations`() {
        val phoneNumber = PhoneNumber("+12025550123")

        // Initially should not have raw input
        assertFalse(phoneNumber.hasRawInput)
        assertEquals("", phoneNumber.rawInput)

        // Set raw input
        phoneNumber.setRawInput("+1 (234) 567-8900")
        assertTrue(phoneNumber.hasRawInput)
        assertEquals("+1 (234) 567-8900", phoneNumber.rawInput)

        // Clear raw input
        phoneNumber.clearRawInput()
        assertFalse(phoneNumber.hasRawInput)
        assertEquals("", phoneNumber.rawInput)
    }

    @Test
    fun `test country code source operations`() {
        val phoneNumber = PhoneNumber("+12025550123")

        // Initially should not have country code source
        assertFalse(phoneNumber.hasCountryCodeSource)
        assertEquals(PhoneNumber.CountryCodeSource.UNSPECIFIED, phoneNumber.countryCodeSource)

        // Set country code source
        phoneNumber.setCountryCodeSource(PhoneNumber.CountryCodeSource.FROM_NUMBER_WITH_PLUS_SIGN)
        assertTrue(phoneNumber.hasCountryCodeSource)
        assertEquals(PhoneNumber.CountryCodeSource.FROM_NUMBER_WITH_PLUS_SIGN, phoneNumber.countryCodeSource)

        // Clear country code source
        phoneNumber.clearCountryCodeSource()
        assertFalse(phoneNumber.hasCountryCodeSource)
        assertEquals(PhoneNumber.CountryCodeSource.UNSPECIFIED, phoneNumber.countryCodeSource)
    }

    @Test
    fun `test preferred domestic carrier code operations`() {
        val phoneNumber = PhoneNumber("+12025550123")

        // Initially should not have preferred domestic carrier code
        assertFalse(phoneNumber.hasPreferredDomesticCarrierCode)
        assertEquals("", phoneNumber.preferredDomesticCarrierCode)

        // Set preferred domestic carrier code
        phoneNumber.setPreferredDomesticCarrierCode("carrier123")
        assertTrue(phoneNumber.hasPreferredDomesticCarrierCode)
        assertEquals("carrier123", phoneNumber.preferredDomesticCarrierCode)

        // Clear preferred domestic carrier code
        phoneNumber.clearPreferredDomesticCarrierCode()
        assertFalse(phoneNumber.hasPreferredDomesticCarrierCode)
        assertEquals("", phoneNumber.preferredDomesticCarrierCode)
    }

    @Test
    fun `test country code source enum conversion`() {
        // Test all enum values
        val kotlinEnums = PhoneNumber.CountryCodeSource.entries.toTypedArray()
        val googleEnums = Phonenumber.PhoneNumber.CountryCodeSource.entries.toTypedArray()

        assertEquals(kotlinEnums.size, googleEnums.size)

        // Test conversion to Google enum
        for (kotlinEnum in kotlinEnums) {
            val googleEnum = kotlinEnum.toGoogleEnum()
            val backToKotlin = PhoneNumber.CountryCodeSource.fromGoogleEnum(googleEnum)
            assertEquals(kotlinEnum, backToKotlin)
        }

        // Test conversion from Google enum
        for (googleEnum in googleEnums) {
            val kotlinEnum = PhoneNumber.CountryCodeSource.fromGoogleEnum(googleEnum)
            val backToGoogle = kotlinEnum.toGoogleEnum()
            assertEquals(googleEnum, backToGoogle)
        }
    }

    @Test
    fun `test fluent API - method chaining`() {
        val phoneNumber = PhoneNumber("+12025550123")
            .setCountryCode(1)
            .setNationalNumber(1234567890L)
            .setExtension("123")
            .setItalianLeadingZero(true)
            .setNumberOfLeadingZeros(2)
            .setRawInput("+1 (234) 567-8900 ext. 123")
            .setCountryCodeSource(PhoneNumber.CountryCodeSource.FROM_NUMBER_WITH_PLUS_SIGN)
            .setPreferredDomesticCarrierCode("carrier")

        assertTrue(phoneNumber.hasCountryCode)
        assertEquals(1, phoneNumber.countryCode)
        assertTrue(phoneNumber.hasNationalNumber)
        assertEquals(1234567890L, phoneNumber.nationalNumber)
        assertTrue(phoneNumber.hasExtension)
        assertEquals("123", phoneNumber.extension)
        assertTrue(phoneNumber.hasItalianLeadingZero)
        assertTrue(phoneNumber.isItalianLeadingZero)
        assertTrue(phoneNumber.hasNumberOfLeadingZeros)
        assertEquals(2, phoneNumber.numberOfLeadingZeros)
        assertTrue(phoneNumber.hasRawInput)
        assertEquals("+1 (234) 567-8900 ext. 123", phoneNumber.rawInput)
        assertTrue(phoneNumber.hasCountryCodeSource)
        assertEquals(PhoneNumber.CountryCodeSource.FROM_NUMBER_WITH_PLUS_SIGN, phoneNumber.countryCodeSource)
        assertTrue(phoneNumber.hasPreferredDomesticCarrierCode)
        assertEquals("carrier", phoneNumber.preferredDomesticCarrierCode)
    }

    @Test
    fun `test clear functionality`() {
        val phoneNumber = PhoneNumber("+12025550123")
            .setCountryCode(1)
            .setNationalNumber(1234567890L)
            .setExtension("123")
            .setItalianLeadingZero(true)
            .setNumberOfLeadingZeros(2)
            .setRawInput("+1 (234) 567-8900 ext. 123")
            .setCountryCodeSource(PhoneNumber.CountryCodeSource.FROM_NUMBER_WITH_PLUS_SIGN)
            .setPreferredDomesticCarrierCode("carrier")

        // Clear all fields
        phoneNumber.clear()

        assertFalse(phoneNumber.hasCountryCode)
        assertFalse(phoneNumber.hasNationalNumber)
        assertFalse(phoneNumber.hasExtension)
        assertFalse(phoneNumber.hasItalianLeadingZero)
        assertFalse(phoneNumber.hasNumberOfLeadingZeros)
        assertFalse(phoneNumber.hasRawInput)
        assertFalse(phoneNumber.hasCountryCodeSource)
        assertFalse(phoneNumber.hasPreferredDomesticCarrierCode)
    }

    @Test
    fun `test mergeFrom functionality`() {
        val phoneNumber1 = PhoneNumber("+12025550123")
            .setCountryCode(1)
            .setNationalNumber(1111111111L)
            .setExtension("111")

        val phoneNumber2 = PhoneNumber("+442083661177")
            .setCountryCode(44)
            .setRawInput("+44 2222 222222")
            .setPreferredDomesticCarrierCode("carrier2")

        phoneNumber1.mergeFrom(phoneNumber2)

        // phoneNumber1 should now have all fields from phoneNumber2
        assertEquals(44, phoneNumber1.countryCode) // Updated from phoneNumber2
        assertEquals(2083661177, phoneNumber1.nationalNumber) // Kept from phoneNumber1
        assertEquals("111", phoneNumber1.extension) // Kept from phoneNumber1
        assertEquals("+44 2222 222222", phoneNumber1.rawInput) // Added from phoneNumber2
        assertEquals("carrier2", phoneNumber1.preferredDomesticCarrierCode) // Added from phoneNumber2
    }

    @Test
    fun `test exactlySameAs functionality`() {
        val phoneNumber1 = PhoneNumber("+12025550123")
            .setCountryCode(1)
            .setNationalNumber(1234567890L)
            .setExtension("123")

        val phoneNumber2 = PhoneNumber("+12025550123")
            .setCountryCode(1)
            .setNationalNumber(1234567890L)
            .setExtension("123")

        val phoneNumber3 = PhoneNumber("+12025550123")
            .setCountryCode(1)
            .setNationalNumber(1234567890L)
            .setExtension("456") // Different extension

        assertTrue(phoneNumber1.exactlySameAs(phoneNumber2))
        assertFalse(phoneNumber1.exactlySameAs(phoneNumber3))
    }

    @Test
    fun `test equals and hashCode`() {
        val phoneNumber1 = PhoneNumber("+12025550123")
            .setCountryCode(1)
            .setNationalNumber(1234567890L)

        val phoneNumber2 = PhoneNumber("+12025550123")
            .setCountryCode(1)
            .setNationalNumber(1234567890L)

        val phoneNumber3 = PhoneNumber("+12025550123") // Different instance
            .setCountryCode(1)
            .setNationalNumber(1234567890L)

        val phoneNumber4 = PhoneNumber("+442083661177") // Different number
            .setCountryCode(44)
            .setNationalNumber(2083661177L)

        // Test equals
        assertEquals(phoneNumber1, phoneNumber2)
        assertEquals(phoneNumber1, phoneNumber3)
        assertNotEquals(phoneNumber1, phoneNumber4)

        // Test hashCode consistency
        assertEquals(phoneNumber1.hashCode(), phoneNumber2.hashCode())
        assertEquals(phoneNumber1.hashCode(), phoneNumber3.hashCode())
        assertNotEquals(phoneNumber1.hashCode(), phoneNumber4.hashCode())
    }

    @Test
    fun `test getGooglePhoneNumber access`() {
        val phoneNumber = PhoneNumber("+12025550123")
        val googlePhoneNumber = phoneNumber.googlePhoneNumber
        assertNotNull(googlePhoneNumber)
        assertEquals(1, googlePhoneNumber.countryCode)
        assertEquals(2025550123L, googlePhoneNumber.nationalNumber)
    }

    @Test
    fun `test individual clear methods`() {
        val phoneNumber = PhoneNumber("+12025550123")
            .setCountryCode(1)
            .setNationalNumber(1234567890L)
            .setExtension("123")
            .setItalianLeadingZero(true)
            .setNumberOfLeadingZeros(2)
            .setRawInput("+1 (234) 567-8900 ext. 123")
            .setCountryCodeSource(PhoneNumber.CountryCodeSource.FROM_NUMBER_WITH_PLUS_SIGN)
            .setPreferredDomesticCarrierCode("carrier")

        // Test individual clear methods
        phoneNumber.clearCountryCode()
        assertFalse(phoneNumber.hasCountryCode)
        assertTrue(phoneNumber.hasNationalNumber) // Others should remain

        phoneNumber.clearNationalNumber()
        assertFalse(phoneNumber.hasNationalNumber)
        assertTrue(phoneNumber.hasExtension) // Others should remain

        phoneNumber.clearExtension()
        assertFalse(phoneNumber.hasExtension)
        assertTrue(phoneNumber.hasItalianLeadingZero) // Others should remain

        phoneNumber.clearItalianLeadingZero()
        assertFalse(phoneNumber.hasItalianLeadingZero)
        assertTrue(phoneNumber.hasNumberOfLeadingZeros) // Others should remain

        phoneNumber.clearNumberOfLeadingZeros()
        assertFalse(phoneNumber.hasNumberOfLeadingZeros)
        assertTrue(phoneNumber.hasRawInput) // Others should remain

        phoneNumber.clearRawInput()
        assertFalse(phoneNumber.hasRawInput)
        assertTrue(phoneNumber.hasCountryCodeSource) // Others should remain

        phoneNumber.clearCountryCodeSource()
        assertFalse(phoneNumber.hasCountryCodeSource)
        assertTrue(phoneNumber.hasPreferredDomesticCarrierCode) // Others should remain

        phoneNumber.clearPreferredDomesticCarrierCode()
        assertFalse(phoneNumber.hasPreferredDomesticCarrierCode)
    }
}
