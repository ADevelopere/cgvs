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
  CountryPropsFormState,
  CountryPropsFormErrors,
  UpdateCountryPropsWithElementIdFn,
  UpdateCountryPropsFn,
} from "../element/country";
import { useCertificateElementStates } from "../../CertificateElementContext";

export type UseCountryPropsStateParams = {
  templateId?: number;
  elements?: GQL.CertificateElementUnion[];
};

export type UseCountryPropsStateReturn = {
  countryPropsStates: Map<number, CountryPropsFormState>;
  updateCountryPropsStateFn: UpdateCountryPropsWithElementIdFn;
  pushCountryPropsStateUpdate: (elementId: number) => Promise<void>;
  initCountryPropsState: (elementId: number) => CountryPropsFormState;
  countryPropsStateErrors: Map<number, CountryPropsFormErrors>;
};

/**
 * Extract countryProps state from CountryElement
 */
function extractCountryPropsState(
  element: GQL.CertificateElementUnion
): CountryPropsFormState | null {
  if (element.__typename !== "CountryElement" || !element.countryProps) {
    return null;
  }

  return {
    representation: element.countryProps
      .representation as GQL.CountryRepresentation,
  };
}

/**
 * Convert countryProps input to update input
 */
function toUpdateInput(
  elementId: number,
  state: CountryPropsFormState
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
  const validator = React.useMemo(
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
    async (elementId: number, state: CountryPropsFormState) => {
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
  const { states, updateFn, pushUpdate, initState, errors } = useElementState<
    CountryPropsFormState,
    CountryPropsFormErrors,
    string | undefined
  >({
    templateId,
    elements,
    validator,
    extractInitialState: extractCountryPropsState,
    mutationFn,
    stateNamespace: "countryProps",
  });

  return {
    countryPropsStates: states,
    updateCountryPropsStateFn: updateFn,
    pushCountryPropsStateUpdate: pushUpdate,
    initCountryPropsState: initState,
    countryPropsStateErrors: errors,
  };
}

export type UseCountryPropsParams = {
  elementId: number;
};

export const useCountryProps = (params: UseCountryPropsParams) => {
  const {
    countryProps: {
      countryPropsStates,
      updateCountryPropsStateFn,
      pushCountryPropsStateUpdate,
      initCountryPropsState,
      countryPropsStateErrors,
    },
  } = useCertificateElementStates();

  // Get state or initialize if not present (only initialize once)
  const countryProps: CountryPropsFormState = React.useMemo(() => {
    return (
      countryPropsStates.get(params.elementId) ??
      initCountryPropsState(params.elementId)
    );
  }, [countryPropsStates, params.elementId, initCountryPropsState]);

  const updateCountryProps: UpdateCountryPropsFn = React.useCallback(
    action => {
      updateCountryPropsStateFn(params.elementId, action);
    },
    [params.elementId, updateCountryPropsStateFn]
  );

  const pushCountryPropsUpdate = React.useCallback(async () => {
    await pushCountryPropsStateUpdate(params.elementId);
  }, [params.elementId, pushCountryPropsStateUpdate]);

  const errors: CountryPropsFormErrors = React.useMemo(() => {
    return countryPropsStateErrors.get(params.elementId) || {};
  }, [countryPropsStateErrors, params.elementId]);

  return {
    countryPropsState: countryProps,
    updateCountryProps,
    pushCountryPropsUpdate,
    countryPropsErrors: errors,
  };
};
