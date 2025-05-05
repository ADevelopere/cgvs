import React, { useEffect } from "react";
import { Alert, Button, Container } from "@mui/material";
import { useAppBarHeight } from "@/hooks/useAppBarHeight";
import useAppTranslation from "@/locale/useAppTranslation";
import { TemplateCategoryManagementProvider, useTemplateCategoryManagement } from "@/contexts/template/TemplateCategoryManagementContext";
import SplitPaneViewController from "@/components/splitPane/SplitPaneViewController";
import TemplateCategoryManagementCategoryPane from "./TemplateCategoryManagementCategoryPane";
import TemplateCategoryManagementTemplatePane from "./TemplateCategoryManagementCoursePane";

const This: React.FC = () => {
  const strings = useAppTranslation("templateCategoryTranslations");
  const { fetchCategories, fetchError, currentCategory } = useTemplateCategoryManagement();
  const fetchErrorView = (
    (fetchError && (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Alert severity="error">
          {strings.errorLoadingCategories}: {fetchError.message}
        </Alert>
        <Button
          onClick={fetchCategories}
          variant="contained"
          color="primary"
          style={{ marginTop: "16px" }}
        >
          {strings.retry}
        </Button>
      </div>
    ))
  );

  return (
    <>
      {fetchErrorView ?(
        { fetchErrorView }
      ): (
        <SplitPaneViewController
          title={strings.templateCategoriesManagement}
          firstPaneButtonDisabled={!currentCategory}
          secondPaneButtonDisabled={false}
          firstPaneButtonTooltip={strings.toggleCategoriesPane}
          secondPaneButtonTooltip={strings.toggleTemplatesPane}
          firstPane={<TemplateCategoryManagementCategoryPane />}
          secondPane={<TemplateCategoryManagementTemplatePane />}
        />
      )}
    </>
  );

};

const TemplateCategoryManagement: React.FC = () => {
  const appBarHeight = useAppBarHeight();

  // todo: remove minWidth after fixing the layout
  useEffect(() => {
    const appBar = document.getElementById("header-appbar");
    if (appBar) {
      appBar.style.minWidth = "1024px";
    }
  }, []);

  return (
    <Container
      sx={{
        top: `${appBarHeight}px`,
        height: `calc(100vh - ${appBarHeight}px - 48px)`,
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        // todo: remove minWidth after fixing the layout
        minWidth: "1024px",
      }}
    >
      <TemplateCategoryManagementProvider>
        <This />
      </TemplateCategoryManagementProvider>
    </Container>
  );
};


export default TemplateCategoryManagement;
