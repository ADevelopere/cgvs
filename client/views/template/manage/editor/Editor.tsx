import * as GQL from "@/client/graphql/generated/gql/graphql";
import { useQuery } from "@apollo/client/react";
import React from "react";
import { templateConfigsByTemplateIdQueryDocument } from "./glqDocuments";
import { CircularProgress } from "@mui/material";
import { TemplateConfigCreateForm } from "./form/config/TemplateConfigCreateForm";

type EditorProps = {
  template: GQL.Template;
};

export const Editor: React.FC<EditorProps> = ({ template }) => {
  const {
    data: configData,
    loading: configApolloLoading,
    error: configError,
  } = useQuery(templateConfigsByTemplateIdQueryDocument, {
    variables: { templateId: template.id! },
    skip: !template.id,
  });

  const [configLoading, setConfigLoading] = React.useState(true);

  const config: GQL.TemplateConfig | null | undefined = React.useMemo(() => {
    const config = configData?.templateConfigsByTemplateId;
    setConfigLoading(configApolloLoading);
    return config;
  }, [configApolloLoading, configData?.templateConfigsByTemplateId]);

  if (configError) {
    return <div>Error loading template config: {configError.message}</div>;
  }

  if (configLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress size={24} />
      </div>
    );
  }

  if (!configLoading && !config) {
    return <TemplateConfigCreateForm template={template} />;
  }

  return <div>Editor Component</div>;
};
