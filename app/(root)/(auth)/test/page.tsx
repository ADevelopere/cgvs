"use client";

import React, { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { Box, Button, Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import { elementsByTemplateIdQueryDocument } from "@/client/views/template/manage/editor/hooks/element/documents/element.documents";
import { useCertificateElementMutation } from "@/client/views/template/manage/editor/hooks/element/useCertificateElementMutation";
import { TextElementForm } from "@/client/views/template/manage/editor/form/element/text/TextElementForm";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { TextElementFormErrors, TextElementFormState } from "@/client/views/template/manage/editor/form/element/text";

const TEST_TEMPLATE_ID = 1;

export default function TestElementsPage() {
  const { data, loading, error } = useQuery(elementsByTemplateIdQueryDocument, {
    variables: { templateId: TEST_TEMPLATE_ID },
  });
  const { createTextElementMutation } = useCertificateElementMutation(TEST_TEMPLATE_ID);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState<string>("");
  const [openForm, setOpenForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dummy state for TextElementForm
  const [formState, setFormState] = useState<TextElementFormState>({
    base: {
      name: "Text Element",
      description: "A text element",
      positionX: 100,
      positionY: 100,
      width: 200,
      height: 50,
      alignment: GQL.ElementAlignment.Baseline,
      renderOrder: 1,
      templateId: TEST_TEMPLATE_ID,
    },
    textProps: {
      fontRef: { google: { identifier: "Roboto" } },
      fontSize: 16,
      color: "#000000",
      overflow:  GQL.ElementOverflow.Wrap,
    },
    dataSource: {
      static: { value: "Certificate of Completion" },
    },
  });
  const [formErrors, setFormErrors] = useState<TextElementFormErrors>({
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
      await createTextElementMutation({ variables: { input: formState } });
      setOpenForm(false);
    } catch (err) {
      // For testing, just log error
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
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">Error: {error.message}</Typography>}
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" color="primary" onClick={() => setOpenForm(true)}>
          Create Text Element
        </Button>
      </Box>
      <Box>
        {data?.elementsByTemplateId?.map((el: any, idx: number) => (
          <Box key={el.base?.id ?? idx} sx={{ mb: 2, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
            <Typography variant="subtitle1">Element ID: {el.base?.id}</Typography>
            <Button variant="outlined" onClick={() => handleShowElement(el)}>
              Show Element JSON
            </Button>
          </Box>
        ))}
      </Box>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Element Object</DialogTitle>
        <DialogContent>
          <pre style={{ whiteSpace: "pre-wrap" }}>{dialogContent}</pre>
        </DialogContent>
      </Dialog>
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Text Element</DialogTitle>
        <DialogContent>
          <TextElementForm
            state={formState}
            errors={formErrors}
            updateBaseElement={(field, value) =>
              setFormState(prev => ({ ...prev, base: { ...prev.base, [field]: value } }))
            }
            updateTextProps={(field, value) =>
              setFormState(prev => ({ ...prev, textProps: { ...prev.textProps, [field]: value } }))
            }
            updateDataSource={dataSource =>
              setFormState(prev => ({ ...prev, dataSource }))
            }
            templateId={TEST_TEMPLATE_ID}
            locale="en"
            textVariables={mockTextVariables}
            selectVariables={mockSelectVariables}
            selfHostedFonts={mockSelfHostedFonts}
            onSubmit={handleCreateTextElement}
            onCancel={() => setOpenForm(false)}
            isSubmitting={isSubmitting}
            submitLabel="Create"
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
