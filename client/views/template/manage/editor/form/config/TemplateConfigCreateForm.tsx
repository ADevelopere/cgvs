import * as GQL from "@/client/graphql/generated/gql/graphql";
import React from "react";
import { TemplateConfigFormErrors, TemplateConfigFormUpdateFn } from "./types";
import { useTemplateConfigMutation } from "./useTemplateConfigMutation";
import { Button, Stack, Typography } from "@mui/material";
import { TemplateConfigForm } from "./TemplateConfigForm";
import { logger } from "@/client/lib/logger";

export type TemplateConfigCreateFormProps = {
  template: GQL.Template;
};

export const TemplateConfigCreateForm: React.FC<
  TemplateConfigCreateFormProps
> = ({ template }) => {
  const { createTemplateConfigMutation } = useTemplateConfigMutation();
  const [state, setState] = React.useState<GQL.TemplateConfigCreateInput>({
    width: 800,
    height: 600,
    locale: GQL.CountryCode.Ar,
    templateId: template.id,
  });

  const [errors, setErrors] = React.useState<TemplateConfigFormErrors>({});
  const [creating, setCreating] = React.useState(false);
  const [createError, setCreateError] = React.useState<string | null>(null);

  const updater: TemplateConfigFormUpdateFn = action => {
    const { key, value } = action;
    if (key === "width" || key === "height") {
      if (value <= 0) {
        setErrors(prev => ({
          ...prev,
          [key]: "Value must be greater than 0",
        }));
      } else if (value > 10000) {
        setErrors(prev => ({
          ...prev,
          [key]: "Value must be less than or equal to 10000",
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

  const handleCreate = React.useCallback(async () => {
    setCreating(true);
    try {
      await createTemplateConfigMutation({
        variables: {
          input: state,
        },
      });
    } catch (error) {
      setCreateError("Failed to create template configuration.");
      logger.error(
        "TemplateConfigCreateForm: Failed to create template config",
        {
          error,
        }
      );
    } finally {
      setCreating(false);
    }
  }, [createTemplateConfigMutation, state]);

  return (
    <Stack direction={"column"} spacing={2}>
      {/* title */}
      <Typography variant="h6">Create Template Configuration</Typography>
      {/* form */}
      <TemplateConfigForm
        state={state}
        errors={errors}
        updateFn={updater}
        disabled={creating}
      />
      {/* error message */}
      {createError && <Typography color="error">{createError}</Typography>}
      {/* action */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreate}
        disabled={creating}
      >
        Create
      </Button>
    </Stack>
  );
};
