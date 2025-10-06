import { createPgEnumFromEnum } from "../enumHelpers";
import { Gender, CountryCode } from "@/server/lib/enum";

export const genderEnum = createPgEnumFromEnum("gender", Gender);

export const countryCodeEnum = createPgEnumFromEnum(
    "country_code",
    CountryCode,
);
