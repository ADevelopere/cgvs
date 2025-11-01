import * as GQL from "@/client/graphql/generated/gql/graphql";
import React from "react";
import { TemplateConfigFormErrors, TemplateConfigFormUpdateFn } from "./types";
import { useTemplateConfigMutation } from "./useTemplateConfigMutation";
import { useDebouncedCallback } from "@/client/hooks/useDebouncedCallback";
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
    <Stack direction={"column"} spacing={2} height="100%">
      {/* title and current updating/saved icon */}
      <Stack>
        <Typography variant="h6">{strings.templateConfiguration}</Typography>
        {updating && <CircularProgress size={16} />}
      </Stack>
      <div style={{ overflowY: "auto", paddingInlineEnd: 8 }}>
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
  const [state, setState] = React.useState<GQL.TemplateConfigUpdateInput>({
    id: config.id,
    width: config.width,
    height: config.height,
    language: config.language,
  });

  const notifications = useNotifications();

  const [errors, setErrors] = React.useState<TemplateConfigFormErrors>({});
  const [updating, setUpdating] = React.useState(false);
  const [updateError, setUpdateError] = React.useState<string | null>(null);

  const updater: TemplateConfigFormUpdateFn = action => {
    const { key, value } = action;
    if (key === "width" || key === "height") {
      if (value <= 0) {
        setErrors(prev => ({
          ...prev,
          [key]: strings.valueMustBePositive,
        }));
      } else if (value > 10000) {
        setErrors(prev => ({
          ...prev,
          [key]: strings.valueMustBeLessThan10000,
        }));
      }
    }
    setErrors(prev => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
    setState(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const update = React.useCallback(async () => {
    setUpdating(true);
    try {
      await updateTemplateConfigMutation({
        variables: {
          input: state,
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
  }, [
    updateTemplateConfigMutation,
    state,
    strings.failedToUpdateTemplateConfiguration,
    notifications,
  ]);

  const debouncedUpdate = useDebouncedCallback(update, 3000);

  React.useEffect(() => {
    debouncedUpdate();
  }, [state, debouncedUpdate]);

  React.useEffect(() => {
    return () => {
      update();
    };
  }, [update]);

  return (
    <TemplateConfigAutoUpdateFormContent
      updating={updating}
      state={state}
      errors={errors}
      updateError={updateError}
      updater={updater}
    />
  );
};
