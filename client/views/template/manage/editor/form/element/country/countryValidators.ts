import { CountryRepresentation } from "@/client/graphql/generated/gql/graphql";
import { CountryElementCountryPropsValidateFn } from "./types";

/**
 * Validates the representation field for COUNTRY elements
 * @param representation - The representation value to validate
 * @param strings - Translation strings for error messages
 * @returns Error message if invalid, undefined if valid
 */
export const validateRepresentation = (
  representation: CountryRepresentation | undefined,
  strings: {
    representationRequired: string;
    representationInvalid: string;
  }
): string | undefined => {
  if (!representation) {
    return strings.representationRequired;
  }

  if (
    representation !== CountryRepresentation.CountryName &&
    representation !== CountryRepresentation.Nationality
  ) {
    return strings.representationInvalid;
  }

  return undefined;
};

export const validateCountryElementCountryProps = (strings: {
  representationRequired: string;
  representationInvalid: string;
}) => {
  const validate: CountryElementCountryPropsValidateFn = ({ key, value }) => {
    switch (key) {
      case "representation":
        return validateRepresentation(value as CountryRepresentation, strings);
    }
  };
  return validate;
};
