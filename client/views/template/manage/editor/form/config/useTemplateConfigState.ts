import React from "react";
import { useMutation } from "@apollo/client/react";
import { useNotifications } from "@toolpad/core/useNotifications";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { updateTemplateConfigMutationDocument } from "../../glqDocuments";
import { logger } from "@/client/lib/logger";
import { useAppTranslation } from "@/client/locale";
import {
  TemplateConfigFormErrors,
  TemplateConfigFormUpdateFn,
  TemplateConfigUpdateAction,
} from "./types";
import { useTemplateConfigFormValidateFn } from "./templateConfigValidator";
import { useNodesStore } from "../../NodesStoreProvider";

const updateDebounceDelayMs = 10000; // 10 seconds

export type UseTemplateConfigStateParams = {
  config?: GQL.TemplateConfig | null;
};

export type UseTemplateConfigStateReturn = {
  state: GQL.TemplateConfigUpdateInput;
  updateFn: TemplateConfigFormUpdateFn;
  errors: TemplateConfigFormErrors;
  updating: boolean;
};

export function useTemplateConfigState(
  params: UseTemplateConfigStateParams
): UseTemplateConfigStateReturn {
  const { config } = params;
  const { templateConfigTranslations: strings } = useAppTranslation();
  const notifications = useNotifications();
  const {updateContainerNode} = useNodesStore();

  const [updateTemplateConfigMutation] = useMutation(
    updateTemplateConfigMutationDocument
  );

  const [state, setState] = React.useState<GQL.TemplateConfigUpdateInput>(() => {
    if(config){
      return {
        id: config.id,
        width: config.width,
        height: config.height,
        language: config.language,
      };
    }
    return {
      id: 0,
      width: 0,
      height: 0,
      language: GQL.AppLanguage.Ar,
    };
  });

  const [errors, setErrors] = React.useState<TemplateConfigFormErrors>({});
  const [updating, setUpdating] = React.useState(false);
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const validateAction = useTemplateConfigFormValidateFn(strings);

  // Refs for dependencies to stabilize callbacks
  const stateRef = React.useRef(state);
  stateRef.current = state;
  const errorsRef = React.useRef(errors);
  errorsRef.current = errors;
  const validateActionRef = React.useRef(validateAction);
  validateActionRef.current = validateAction;
  const updateContainerNodeRef = React.useRef(updateContainerNode);
  updateContainerNodeRef.current = updateContainerNode;

  const mutationFn = React.useCallback(
    async (updateState: GQL.TemplateConfigUpdateInput) => {
      setUpdating(true);
      try {
        await updateTemplateConfigMutation({
          variables: {
            input: updateState,
          },
        });
      } catch (error) {
        const errorMessage =
          strings.failedToUpdateTemplateConfiguration ||
          "Failed to update template configuration";
        logger.error(
          "useTemplateConfigState: Failed to update template config",
          { error }
        );
        notifications.show(errorMessage, {
          severity: "error",
          autoHideDuration: 3000,
        });
        throw error; // Re-throw to be caught by caller if needed
      } finally {
        setUpdating(false);
      }
    },
    [
      updateTemplateConfigMutation,
      notifications,
      strings.failedToUpdateTemplateConfiguration,
    ]
  );

  const mutationFnRef = React.useRef(mutationFn);
  mutationFnRef.current = mutationFn;

  const updateFn: TemplateConfigFormUpdateFn = React.useCallback(
    (action: TemplateConfigUpdateAction) => {
      const { key, value } = action;

      // Get current state
      const currentState = stateRef.current;

      // Validate
      const errorMessage = validateActionRef.current(action);

      // Update errors
      setErrors(prev => {
        const newErrors = { ...prev };
        if (errorMessage) {
          newErrors[key] = errorMessage;
        } else {
          delete newErrors[key];
        }
        return newErrors;
      });

      // Update state
      const newState = { ...currentState, [key]: value };
      setState(newState);

      // Update container node in the store immediately
      if (key === "width" || key === "height") {
        updateContainerNodeRef.current({
          [key]: value as number,
        });
      }

      // Clear existing debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Don't schedule update if there's an error
      if (errorMessage) {
        return;
      }

      // Set new debounce timer
      debounceTimerRef.current = setTimeout(() => {
        mutationFnRef.current(newState).catch(err => {
          logger.error("Debounced mutation failed", { err });
        });
      }, updateDebounceDelayMs);
    },
    [] // No dependencies - use refs instead
  );

  // Cleanup on unmount
  React.useEffect(() => {
    if(!config) return;
    // Capture the current ref values when effect runs
    const configSnapshot = config;
    const stateSnapshot = stateRef;
    const errorsSnapshot = errorsRef;
    const mutationFnOnUnmount = mutationFnRef.current;
    const timerRef = debounceTimerRef;

    return () => {
      // Clear timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      const latestState = stateSnapshot.current;
      const latestErrors = errorsSnapshot.current;

      const hasChanged =
        latestState.width !== configSnapshot.width ||
        latestState.height !== configSnapshot.height ||
        latestState.language !== configSnapshot.language;

      const hasErrors = Object.values(latestErrors).some(e => e !== undefined);

      if (hasChanged && !hasErrors) {
        mutationFnOnUnmount(latestState).catch(err => {
          logger.error("Save on unmount failed", { err });
        });
      }
    };
  }, [config]); // Only depend on config

  return {
    state,
    updateFn,
    errors,
    updating,
  };
}
