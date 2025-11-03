import React from "react";
import { useMutation } from "@apollo/client/react";
import { useNotifications } from "@toolpad/core/useNotifications";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { updateCountryElementSpecPropsMutationDocument } from "../../glqDocuments/element/country.documents";
import { useElementState } from "./useElementState";
import { validateCountryElementCountryProps } from "../element/country/countryValidators";
import { logger } from "@/client/lib/logger";
import { useAppTranslation } from "@/client/locale";
import {
  SanitizedCountryPropsFormState,
  CountryPropsFormErrors,
  UpdateCountryPropsWithElementIdFn,
  ValidateCountryPropsFieldFn,
} from "../element/country";

export type UseCountryPropsStateParams = {
  templateId?: number;
  elements?: GQL.CertificateElementUnion[];
};

export type UseCountryPropsStateReturn = {
  getState: (elementId: number) => SanitizedCountryPropsFormState | null;
  updateFn: UpdateCountryPropsWithElementIdFn;
  pushUpdate: (elementId: number) => Promise<void>;
  errors: Map<number, CountryPropsFormErrors>;
};

/**
 * Extract countryProps state from CountryElement
 */
function extractCountryPropsState(
  element: GQL.CertificateElementUnion
): SanitizedCountryPropsFormState | null {
  if (element.__typename !== "CountryElement" || !element.countryProps) {
    return null;
  }

  return {
    representation: element.countryProps.representation as GQL.CountryRepresentation,
  };
}

/**
 * Convert countryProps input to update input
 */
function toUpdateInput(
  elementId: number,
  state: SanitizedCountryPropsFormState
): GQL.CountryElementSpecPropsStandaloneUpdateInput {
  return {
    elementId: elementId,
    countryProps: {
      representation: state.representation,
    },
  };
}

export function useCountryPropsState(
  params: UseCountryPropsStateParams
): UseCountryPropsStateReturn {
  const { templateId, elements } = params;
  const notifications = useNotifications();
  const { errorTranslations: errorStrings, certificateElementsTranslations } =
    useAppTranslation();

  const [updateCountryElementSpecPropsMutation] = useMutation(
    updateCountryElementSpecPropsMutationDocument
  );

  // Get validator with translations
  const validator: ValidateCountryPropsFieldFn = React.useMemo(
    () =>
      validateCountryElementCountryProps({
        representationRequired:
          certificateElementsTranslations?.countryElement
            ?.representationRequired || "Representation is required",
        representationInvalid:
          certificateElementsTranslations?.countryElement
            ?.representationInvalid || "Invalid representation",
      }),
    [certificateElementsTranslations]
  );

  // Mutation function
  const mutationFn = React.useCallback(
    async (elementId: number, state: SanitizedCountryPropsFormState) => {
      try {
        const updateInput = toUpdateInput(elementId, state);
        await updateCountryElementSpecPropsMutation({
          variables: {
            input: updateInput,
          },
        });
      } catch (error) {
        const errorMessage =
          errorStrings?.updateFailed || "Failed to update country properties";
        logger.error("useCountryPropsState: Mutation failed", {
          elementId,
          error,
        });
        notifications.show(errorMessage, {
          severity: "error",
          autoHideDuration: 3000,
        });
        throw error;
      }
    },
    [updateCountryElementSpecPropsMutation, notifications, errorStrings]
  );

  // Use generic hook
  const { getState, updateFn, pushUpdate, errors } = useElementState({
    templateId,
    elements,
    validator,
    extractInitialState: extractCountryPropsState,
    mutationFn,
    stateNamespace: "countryProps",
  });

  return {
    getState,
    updateFn,
    pushUpdate,
    errors,
  };
}

