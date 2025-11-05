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
import { useNodesStore } from "../../useNodesStore";

const updateDebounceDelayMs = 10000; // 10 seconds

export type UseTemplateConfigStateParams = {
  config: GQL.TemplateConfig;
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

  const [state, setState] = React.useState<GQL.TemplateConfigUpdateInput>({
    id: config.id,
    width: config.width,
    height: config.height,
    language: config.language,
  });

  const [errors, setErrors] = React.useState<TemplateConfigFormErrors>({});
  const [updating, setUpdating] = React.useState(false);
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const validateAction = useTemplateConfigFormValidateFn(strings);

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

  const updateFn: TemplateConfigFormUpdateFn = React.useCallback(
    (action: TemplateConfigUpdateAction) => {
      const { key, value } = action;

      const errorMessage = validateAction(action);

      setErrors(prev => {
        const newErrors = { ...prev };
        if (errorMessage) {
          newErrors[key] = errorMessage;
        } else {
          delete newErrors[key];
        }
        return newErrors;
      });

      const newState = { ...state, [key]: value };
      setState(newState);

      // Update container node in the store immediately
      if (key === "width" || key === "height") {
        updateContainerNode({
          [key]: value as number,
        });
      }

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      const hasErrors = Object.values(errors).some(e => e !== undefined);
      if (errorMessage || hasErrors) {
        return;
      }

      debounceTimerRef.current = setTimeout(() => {
        mutationFn(newState).catch(err => {
          logger.error("Debounced mutation failed", { err });
        });
      }, updateDebounceDelayMs);
    },
    [validateAction, state, errors, mutationFn, updateContainerNode, config.templateId]
  );

  // Cleanup on unmount
  React.useEffect(() => {
    const latestState = state;
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      const hasChanged =
        latestState.width !== config.width ||
        latestState.height !== config.height ||
        latestState.language !== config.language;

      const hasErrors = Object.values(errors).some(e => e !== undefined);

      if (hasChanged && !hasErrors) {
        mutationFn(latestState).catch(err => {
          logger.error("Save on unmount failed", { err });
        });
      }
    };
  }, [state, config, errors, mutationFn]);

  return {
    state,
    updateFn,
    errors,
    updating,
  };
}
