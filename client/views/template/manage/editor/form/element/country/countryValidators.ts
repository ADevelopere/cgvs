import { CountryRepresentation } from "@/client/graphql/generated/gql/graphql";
import { CountryPropsFormErrors, ValidateCountryPropsFn } from "./types";

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
}): ValidateCountryPropsFn => {
  const validate: ValidateCountryPropsFn = ({ value: countryProps }) => {
    const errors: CountryPropsFormErrors = { countryProps: {} };

    const representationError = validateRepresentation(
      countryProps.representation,
      strings
    );

    if (representationError) {
      if (errors.countryProps)
        errors.countryProps.representation = representationError;
    }

    if (Object.keys(errors.countryProps ?? {}).length === 0) {
      return undefined;
    }

    return errors;
  };
  return validate;
};
