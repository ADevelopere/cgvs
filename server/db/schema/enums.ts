import { createPgEnumFromEnum } from "../../utils/db.utils";
import { CountryCode, Gender } from "@/lib/enum";

export const genderEnum = createPgEnumFromEnum("gender", Gender);

export const countryCodeEnum = createPgEnumFromEnum(
  "country_code",
  CountryCode
);
