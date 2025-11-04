"use client";

import React, { useState, useMemo } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { elementsByTemplateIdQueryDocument } from "@/client/views/template/manage/editor/glqDocuments/element/element.documents";
import { TextElementForm } from "@/client/views/template/manage/editor/form/element/text/TextElementForm";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import {
  textDataSourceToInput,
  TextElementFormErrors,
  TextElementFormState,
} from "@/client/views/template/manage/editor/form/element/text";
import { fontsQueryDocument } from "@/client/views/font/hooks/font.documents";
import { templateVariablesByTemplateIdQueryDocument } from "@/client/views/template/manage/variables/hooks/templateVariable.documents";
import {
  updateTextElementMutationDocument,
} from "@/client/views/template/manage/editor/glqDocuments";
import { useElementCreateMutations } from "@/client/views/template/manage/editor/form/hooks";

const TEST_TEMPLATE_ID = 1;

export default function TestElementsPage() {
    const {createTextElementMutation} =  useElementCreateMutations()

  const [updateTextElementMutation] = useMutation(
    updateTextElementMutationDocument
  );
  // Query fonts with variables from store
  const {
    data: fontsData,
    loading: fontsLoading,
    error: fontsError,
  } = useQuery(fontsQueryDocument, {
    variables: {},
  });

  // Derive fonts from query data
  const fonts = useMemo(() => {
    return fontsData?.fonts?.data || [];
  }, [fontsData]);

  const {
    data: elData,
    loading: elLoading,
    error: elError,
  } = useQuery(elementsByTemplateIdQueryDocument, {
    variables: { templateId: TEST_TEMPLATE_ID },
  });

  const elements: GQL.CertificateElementUnion[] = useMemo(() => {
    return elData?.elementsByTemplateId || [];
  }, [elData]);

  const {
    data: varsData,
    loading: varsLoading,
    error: varsError,
  } = useQuery(templateVariablesByTemplateIdQueryDocument, {
    variables: { templateId: TEST_TEMPLATE_ID },
    fetchPolicy: "cache-first",
  });

  const textVariables: GQL.TemplateTextVariable[] = useMemo(
    () =>
      (varsData?.templateVariablesByTemplateId?.filter(
        variable => variable.type === GQL.TemplateVariableType.Text
      ) || []) as GQL.TemplateTextVariable[],
    [varsData]
  );

  const selectVariables: GQL.TemplateSelectVariable[] = useMemo(
    () =>
      (varsData?.templateVariablesByTemplateId?.filter(
        variable => variable.type === GQL.TemplateVariableType.Select
      ) || []) as GQL.TemplateSelectVariable[],
    [varsData]
  );

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState<string>("");
  const [openForm, setOpenForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateMode, setUpdateMode] = useState(false);
  const [elementToUpdate, setElementToUpdate] =
    useState<GQL.CertificateElementUnion | null>(null);

  // Dummy state for TextElementForm
  const [formState, setFormState] = useState<TextElementFormState>({
    base: {
      name: "Text Element",
      description: "A text element",
      positionX: 100,
      positionY: 100,
      width: 200,
      height: 50,
      alignment: GQL.ElementAlignment.Center,
      renderOrder: 1,
      templateId: TEST_TEMPLATE_ID,
    },
    textProps: {
      fontRef: { google: { identifier: "Roboto" } },
      fontSize: 16,
      color: "#000000",
      overflow: GQL.ElementOverflow.Wrap,
    },
    dataSource: {
      static: { value: "Certificate of Completion" },
    },
  });

  const [formErrors] = useState<TextElementFormErrors>({
    base: {},
    textProps: {},
    dataSource: {},
  });

  const handleShowElement = (element: GQL.CertificateElementUnion) => {
    setDialogContent(JSON.stringify(element, null, 2));
    setOpenDialog(true);
  };

  const handleCreateTextElement = async () => {
    setIsSubmitting(true);
    try {
      // Remove forbidden fields from base
      const { base, textProps, dataSource } = formState;
      const input = {
        base: base,
        textProps,
        dataSource,
      };
      await createTextElementMutation({ variables: { input } });
      setOpenForm(false);
    } catch (err) {
      setDialogContent("Error: " + String(err));
      setOpenDialog(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler for Update button
  const handleUpdateElementClick = (element: GQL.CertificateElementUnion) => {
    setUpdateMode(true);
    setElementToUpdate(element);
    // Only handle TextElement type for update form
    if (element.__typename === "TextElement") {
      // Convert fontRef to input type
      let fontRefInput: GQL.FontReferenceInput;
      if (element.textProps.fontRef.__typename === "FontReferenceGoogle") {
        fontRefInput = {
          google: { identifier: element.textProps.fontRef.identifier ?? "" },
        };
      } else if (
        element.textProps.fontRef.__typename === "FontReferenceSelfHosted"
      ) {
        fontRefInput = {
          selfHosted: { fontId: element.textProps.fontRef.fontId ?? 0 },
        };
      } else {
        fontRefInput = { google: { identifier: "Roboto" } };
      }

      const base: GQL.CertificateElementBaseInput = {
        name: element.base.name,
        description: element.base?.description ?? "",
        alignment: element.base.alignment,
        renderOrder: element.base.renderOrder,
        positionX: element.base.positionX,
        positionY: element.base.positionY,
        width: element.base.width,
        height: element.base.height,
        templateId: TEST_TEMPLATE_ID,
      };

      setFormState({
        base: base,
        textProps: {
          color: element.textProps.color,
          fontRef: fontRefInput,
          fontSize: element.textProps.fontSize,
          overflow: element.textProps.overflow,
        },
        dataSource: textDataSourceToInput(element.textDataSource),
      });
      setOpenForm(true);
    } else {
      setDialogContent("Update only supported for TextElement type.");
      setOpenDialog(true);
    }
  };

  const handleUpdateTextElement = async () => {
    setIsSubmitting(true);
    try {
      // Remove forbidden fields from base
      const { base, textProps, dataSource } = formState;
      // Omit forbidden fields using destructuring
      const updateInput: GQL.TextElementUpdateInput = {
        base: base,
        textProps,
        dataSource,
        id: elementToUpdate?.base.id ?? 0,
      };
      await updateTextElementMutation({ variables: { input: updateInput } });
      setOpenForm(false);
      setUpdateMode(false);
      setElementToUpdate(null);
    } catch (err) {
      setDialogContent("Error: " + String(err));
      setOpenDialog(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Test Elements By Template
      </Typography>
      {(elLoading || fontsLoading || varsLoading) && (
        <Typography>Loading...</Typography>
      )}
      {(elError || fontsError || varsError) && (
        <Typography color="error">
          Error: {elError?.message || fontsError?.message || varsError?.message}
        </Typography>
      )}
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenForm(true)}
        >
          Create Text Element
        </Button>
      </Box>
      <Box>
        {elements && elements.length > 0 && (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Alignment</TableCell>
                  <TableCell>Position X</TableCell>
                  <TableCell>Position Y</TableCell>
                  <TableCell>Width</TableCell>
                  <TableCell>Height</TableCell>
                  <TableCell>Render Order</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Updated At</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {elements.map(
                  (el: GQL.CertificateElementUnion, idx: number) => {
                    let updating = false;

                    if (elementToUpdate?.base.id === el.base?.id) {
                      updating = true;
                    }
                    return (
                      <TableRow
                        key={el.base?.id ?? idx}
                        sx={{
                          backgroundColor: updating
                            ? (formState as TextElementFormState).textProps
                                .color
                            : (el as GQL.TextElement).textProps.color,
                        }}
                      >
                        <TableCell>{el.base?.id}</TableCell>
                        <TableCell>
                          {updating ? formState.base.name : el.base?.name}
                        </TableCell>
                        <TableCell>
                          {updating
                            ? formState.base.description
                            : (el.base?.description ?? "")}
                        </TableCell>
                        <TableCell>{el.base?.type}</TableCell>
                        <TableCell>
                          {updating
                            ? formState.base.alignment
                            : el.base?.alignment}
                        </TableCell>
                        <TableCell>
                          {updating
                            ? formState.base.positionX
                            : el.base?.positionX}
                        </TableCell>
                        <TableCell>
                          {updating
                            ? formState.base.positionY
                            : el.base?.positionY}
                        </TableCell>
                        <TableCell>
                          {updating ? formState.base.width : el.base?.width}
                        </TableCell>
                        <TableCell>
                          {updating ? formState.base.height : el.base?.height}
                        </TableCell>
                        <TableCell>{el.base?.renderOrder}</TableCell>
                        <TableCell>{el.base?.createdAt}</TableCell>
                        <TableCell>{el.base?.updatedAt}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleShowElement(el)}
                          >
                            Show JSON
                          </Button>
                          <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            sx={{ ml: 1 }}
                            onClick={() => handleUpdateElementClick(el)}
                          >
                            Update
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  }
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
      {/* Dialog for showing element JSON */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Element Object</DialogTitle>
        <DialogContent>
          <pre style={{ whiteSpace: "pre-wrap", direction: "ltr" }}>
            {dialogContent}
          </pre>
        </DialogContent>
      </Dialog>
      {/* Dialog for create/update form */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {updateMode ? "Update Text Element" : "Create Text Element"}
        </DialogTitle>
        <DialogContent>
          {/* Only show form for TextElement type */}
          {(!updateMode ||
            (elementToUpdate &&
              elementToUpdate.__typename === "TextElement")) && (
            <TextElementForm
              state={formState}
              errors={formErrors}
              updateBaseElement={action => {
                if (!action) return;
                const { key, value } = action;
                setFormState(prev => ({
                  ...prev,
                  base: { ...prev.base, [key]: value },
                }));
              }}
              updateTextProps={({ key, value }) =>
                setFormState(prev => ({
                  ...prev,
                  textProps: { ...prev.textProps, [key]: value },
                }))
              }
              updateDataSource={dataSource => {
                setFormState(prev => ({ ...prev, dataSource }));
              }}
              language={GQL.AppLanguage.Ar}
              textVariables={textVariables}
              selectVariables={selectVariables}
              selfHostedFonts={fonts}
              onSubmit={
                updateMode ? handleUpdateTextElement : handleCreateTextElement
              }
              onCancel={() => {
                setOpenForm(false);
                setUpdateMode(false);
                setElementToUpdate(null);
              }}
              isSubmitting={isSubmitting}
              submitLabel={updateMode ? "Update" : "Create"}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
