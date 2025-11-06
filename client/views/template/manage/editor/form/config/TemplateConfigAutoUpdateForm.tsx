import * as GQL from "@/client/graphql/generated/gql/graphql";
import React from "react";
import { TemplateConfigFormErrors, TemplateConfigFormUpdateFn } from "./types";
import { CircularProgress, Stack, Typography } from "@mui/material";
import { TemplateConfigForm } from "./TemplateConfigForm";
import { useAppTranslation } from "@/client/locale";
import { useCertificateElementStates } from "../../CertificateElementContext";

export type TemplateConfigAutoUpdateFormInternalProps = {
  updating: boolean;
  state: GQL.TemplateConfigUpdateInput;
  errors: TemplateConfigFormErrors;
  updater: TemplateConfigFormUpdateFn;
};

export const TemplateConfigAutoUpdateFormContent: React.FC<TemplateConfigAutoUpdateFormInternalProps> = ({
  updating,
  state,
  errors,
  updater,
}) => {
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
      <Stack direction="row" alignItems="center" justifyContent={"space-between"}>
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
        <TemplateConfigForm state={state} errors={errors} updateFn={updater} disabled={false} />
      </div>
    </Stack>
  );
};

export const TemplateConfigAutoUpdateForm: React.FC = () => {
  const {
    config: { state, updateFn, errors, updating },
  } = useCertificateElementStates();

  return <TemplateConfigAutoUpdateFormContent updating={updating} state={state} errors={errors} updater={updateFn} />;
};
