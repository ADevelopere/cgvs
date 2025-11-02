import * as GQL from "@/client/graphql/generated/gql/graphql";
import React from "react";
import { TemplateConfigFormErrors, TemplateConfigFormUpdateFn } from "./types";
import { useTemplateConfigMutation } from "./useTemplateConfigMutation";
import { Box, Button, Stack, Typography } from "@mui/material";
import { TemplateConfigForm } from "./TemplateConfigForm";
import { logger } from "@/client/lib/logger";
import { useAppTranslation } from "@/client/locale/useAppTranslation";
import { useTemplateConfigFormValidateFn } from "./templateConfigValidator";
import { TemplateConfigTranslations } from "@/client/locale";

export type TemplateConfigCreateFormProps = {
  template: GQL.Template;
};

export type TemplateConfigCreateFormContentProps = {
  state: GQL.TemplateConfigCreateInput;
  errors: TemplateConfigFormErrors;
  creating: boolean;
  createError: string | null;
  updater: TemplateConfigFormUpdateFn;
  handleCreate: () => Promise<void>;
  strings: TemplateConfigTranslations;
};

export const TemplateConfigCreateFormContent: React.FC<
  TemplateConfigCreateFormContentProps
> = ({
  state,
  errors,
  creating,
  createError,
  updater,
  handleCreate,
  strings,
}) => {
  return (
    <Stack
      direction={"column"}
      spacing={{ xs: 2, md: 4 }}
      width="100%"
      height="100%"
      justifyContent="center"
      alignItems="center"
      // Add padding for better spacing on small screens
      sx={{ p: 2 }}
    >
      {/* title */}
      <Typography variant="h6">
        {strings.createTemplateConfiguration}
      </Typography>

      {/* This Box constrains the form's width and is centered by the Stack */}
      <Box sx={{ width: "100%", maxWidth: "600px" }}>
        {/* form */}
        <TemplateConfigForm
          state={state}
          errors={errors}
          updateFn={updater}
          disabled={creating}
        />
      </Box>

      {/* error message */}
      {createError && <Typography color="error">{createError}</Typography>}

      {/* action */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreate}
        disabled={creating}
        // Apply same width constraints to the button
        sx={{ width: "100%", maxWidth: "600px" }}
      >
        {strings.create}
      </Button>
    </Stack>
  );
};

export const TemplateConfigCreateForm: React.FC<
  TemplateConfigCreateFormProps
> = ({ template }) => {
  const { templateConfigTranslations: strings } = useAppTranslation();
  const { createTemplateConfigMutation } = useTemplateConfigMutation();
  const [state, setState] = React.useState<GQL.TemplateConfigCreateInput>({
    width: 800,
    height: 600,
    language: GQL.AppLanguage.Ar,
    templateId: template.id,
  });

  const [errors, setErrors] = React.useState<TemplateConfigFormErrors>({});
  const [creating, setCreating] = React.useState(false);
  const [createError, setCreateError] = React.useState<string | null>(null);
  const validateAction = useTemplateConfigFormValidateFn(strings);

  const updater: TemplateConfigFormUpdateFn = action => {
    const { key, value } = action;
    const errorMessage = validateAction(action);

    setErrors(prev => ({
      ...prev,
      [key]: errorMessage,
    }));

    setState(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCreate = React.useCallback(async () => {
    setCreating(true);
    try {
      await createTemplateConfigMutation({
        variables: {
          input: state,
        },
      });
    } catch (error) {
      setCreateError(strings.failedToCreateTemplateConfiguration);
      logger.error(
        "TemplateConfigCreateForm: Failed to create template config",
        {
          error,
        }
      );
    } finally {
      setCreating(false);
    }
  }, [
    createTemplateConfigMutation,
    state,
    strings.failedToCreateTemplateConfiguration,
  ]);

  return (
    <TemplateConfigCreateFormContent
      state={state}
      errors={errors}
      creating={creating}
      createError={createError}
      updater={updater}
      handleCreate={handleCreate}
      strings={strings}
    />
  );
};
