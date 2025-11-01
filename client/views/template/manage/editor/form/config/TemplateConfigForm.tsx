import React from "react";
import { Stack, TextField } from "@mui/material";
import { TemplateConfigCreateInput } from "@/client/graphql/generated/gql/graphql";
import { LocaleSelector } from "./LocaleSelector";

interface TemplateConfigFormProps {
  state: TemplateConfigCreateInput;
  updateFn: <K extends keyof TemplateConfigCreateInput>(
    key: K,
    value: TemplateConfigCreateInput[K]
  ) => void;
}

export const TemplateConfigForm: React.FC<TemplateConfigFormProps> = ({
  state,
  updateFn,
}) => {
  return (
    <Stack spacing={2} direction="column">
      <TextField
        label="Width"
        type="number"
        value={state.width}
        onChange={(e) => updateFn("width", parseInt(e.target.value, 10))}
        fullWidth
      />
      <TextField
        label="Height"
        type="number"
        value={state.height}
        onChange={(e) => updateFn("height", parseInt(e.target.value, 10))}
        fullWidth
      />
      <LocaleSelector
        value={state.locale}
        onChange={(value) => updateFn("locale", value)}
      />
    </Stack>
  );
};