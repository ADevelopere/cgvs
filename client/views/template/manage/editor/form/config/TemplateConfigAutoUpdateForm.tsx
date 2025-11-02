import * as GQL from "@/client/graphql/generated/gql/graphql";
import React from "react";
import { TemplateConfigFormErrors, TemplateConfigFormUpdateFn } from "./types";
import { useTemplateConfigMutation } from "./useTemplateConfigMutation";
import { CircularProgress, Stack, Typography } from "@mui/material";
import { TemplateConfigForm } from "./TemplateConfigForm";
import { logger } from "@/client/lib/logger";
import { useNotifications } from "@toolpad/core/useNotifications";
import { useAppTranslation } from "@/client/locale";

export type TemplateConfigAutoUpdateFormProps = {
  config: GQL.TemplateConfig;
};

export type TemplateConfigAutoUpdateFormInternalProps = {
  updating: boolean;
  state: GQL.TemplateConfigUpdateInput;
  errors: TemplateConfigFormErrors;
  updateError: string | null;
  updater: TemplateConfigFormUpdateFn;
};

export const TemplateConfigAutoUpdateFormContent: React.FC<
  TemplateConfigAutoUpdateFormInternalProps
> = ({ updating, state, errors, updateError, updater }) => {
  const { templateConfigTranslations: strings } = useAppTranslation();
  return (
    <Stack
      sx={{
        padding: 2,
        overflow: "hidden",
        height: "100%",
        width: "100%",
        gap: 2,
        direction: "column",
      }}
    >
      {/* title and current updating/saved icon */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent={"space-between"}
      >
        <Typography
          variant="h6"
          sx={{
            overflow: "hidden",
            textWrap: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {strings.templateConfiguration}
        </Typography>
        {updating && <CircularProgress size={16} />}
      </Stack>
      <div
        style={{
          overflowY: "auto",
          paddingInlineEnd: 8,
          flexGrow: 1,
          width: "100%",
        }}
      >
        <TemplateConfigForm
          state={state}
          errors={errors}
          updateFn={updater}
          disabled={false}
        />
      </div>
      {/* error message */}
      {updateError && <Typography color="error">{updateError}</Typography>}
    </Stack>
  );
};

export const TemplateConfigAutoUpdateForm: React.FC<
  TemplateConfigAutoUpdateFormProps
> = ({ config }) => {
  const { templateConfigTranslations: strings } = useAppTranslation();

  const { updateTemplateConfigMutation } = useTemplateConfigMutation();
  const [inputState, setInputState] =
    React.useState<GQL.TemplateConfigUpdateInput>({
      id: config.id,
      width: config.width,
      height: config.height,
      language: config.language,
    });

  const notifications = useNotifications();

  const [errors, setErrors] = React.useState<TemplateConfigFormErrors>({});
  const [updating, setUpdating] = React.useState(false);
  const [updateError, setUpdateError] = React.useState<string | null>(null);

  const updater: TemplateConfigFormUpdateFn = React.useCallback(
    action => {
      const { key, value } = action;

      if (key === "width" || key === "height") {
        if (value <= 0) {
          setErrors(prev => ({
            ...prev,
            [key]:
              strings.valueMustBeGreaterThanZero ?? `${key} must be positive`,
          }));
          setInputState(prev => ({
            ...prev,
            [key]: value,
          }));
          return;
        } else if (value > 10000) {
          logger.info("Value too large:", value);
          setErrors(prev => ({
            ...prev,
            [key]:
              strings.valueMustBeLessThanOrEqualTo10000 ??
              `${key} must be less than or equal to 10000`,
          }));
          setInputState(prev => ({
            ...prev,
            [key]: value,
          }));
          return;
        } else {
          setErrors(prev => {
            const { [key]: _, ...rest } = prev;
            return rest;
          });
        }
      }

      setInputState(prev => ({
        ...prev,
        [key]: value,
      }));
    },
    [
      strings.valueMustBeGreaterThanZero,
      strings.valueMustBeLessThanOrEqualTo10000,
    ]
  );

  const hasChanged = React.useMemo(() => {
    return (
      inputState.width !== config.width ||
      inputState.height !== config.height ||
      inputState.language !== config.language
    );
  }, [inputState, config]);

  const hasErrors = React.useMemo(() => {
    return Object.keys(errors).length > 0;
  }, [errors]);

  const update = React.useCallback(async () => {
    if (hasChanged && !hasErrors) {
      setUpdating(true);
      try {
        await updateTemplateConfigMutation({
          variables: {
            input: inputState,
          },
        });
      } catch (error) {
        const errorMessage = strings.failedToUpdateTemplateConfiguration;
        setUpdateError(errorMessage);
        logger.error(
          "TemplateConfigCreateForm: Failed to update template config",
          {
            error,
          }
        );
        notifications.show(errorMessage, {
          severity: "error",
          autoHideDuration: 3000,
        });
      } finally {
        setUpdating(false);
      }
    }
  }, [
    hasChanged,
    hasErrors,
    updateTemplateConfigMutation,
    inputState,
    strings.failedToUpdateTemplateConfiguration,
    notifications,
  ]);

  React.useEffect(() => {
    // Set a timer to call the update function after 3 seconds.
    // The `update` function itself already checks `if (hasChanged)`,
    // so we don't need to add that check here.
    const handler = setTimeout(() => {
      update();
    }, 10000); // 10000 milliseconds = 10 seconds

    // This cleanup function will run:
    // 1. Before the effect runs again (if inputState changes)
    // 2. When the component unmounts
    // This cancels the pending update, effectively "debouncing".
    return () => {
      clearTimeout(handler);
    };
  }, [inputState, update]);

  // Save on unmount if there are pending changes
  const pendingSaveRef = React.useRef(false);
  const latestStateRef = React.useRef(inputState);

  // Update refs when state changes
  React.useEffect(() => {
    latestStateRef.current = inputState;
    pendingSaveRef.current = hasChanged && !hasErrors;
  }, [inputState, hasChanged, hasErrors]);
  React.useEffect(() => {
    return () => {
      if (pendingSaveRef.current) {
        // Fire-and-forget save on unmount
        updateTemplateConfigMutation({
          variables: {
            input: latestStateRef.current,
          },
        }).catch(error => {
          const errorMessage = strings.failedToUpdateTemplateConfiguration;
          notifications.show(errorMessage, {
            severity: "error",
            autoHideDuration: 3000,
          });
          logger.error("Failed to save on unmount", { error });
        });
      }
    };
  }, [
    notifications,
    strings.failedToUpdateTemplateConfiguration,
    updateTemplateConfigMutation,
  ]);

  return (
    <TemplateConfigAutoUpdateFormContent
      updating={updating}
      state={inputState}
      errors={errors}
      updateError={updateError}
      updater={updater}
    />
  );
};
