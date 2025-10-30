import type { CountryRepresentation } from "@/client/graphql/generated/gql/graphql";

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

  if (representation !== "COUNTRY_NAME" && representation !== "NATIONALITY") {
    return strings.representationInvalid;
  }

  return undefined;
};

