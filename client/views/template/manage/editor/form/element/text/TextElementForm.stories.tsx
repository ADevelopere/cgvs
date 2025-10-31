import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/logger";
import { TextElementForm } from "./TextElementForm";
import { mockSelfHostedFonts, mockTextVariables, mockSelectVariables } from "../story.util";
import type { TextElementFormErrors, TextElementFormState } from "./types";

const meta: Meta<typeof TextElementForm> = {
  title: "Template/Editor/Form/Element/Text/TextElementForm",
  component: TextElementForm,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TextElementForm>;

const defaultState: TextElementFormState = {
  base: {
    name: "Text Element",
    description: "A text element",
    positionX: 100,
    positionY: 100,
    width: 200,
    height: 50,
    alignment: "CENTER",
    renderOrder: 1,
    templateId: 1,
  },
  textProps: {
    fontRef: { google: { identifier: "Roboto" } },
    fontSize: 16,
    color: "#000000",
    overflow: "WRAP",
  },
  dataSource: {
    static: { value: "Certificate of Completion" },
  },
};

const defaultErrors: TextElementFormErrors = {
  base: {},
  textProps: {},
  dataSource: {},
};

export const Default: Story = {
  args: {
    state: defaultState,
    errors: defaultErrors,
    updateBaseElement: (field, value) => logger.log("Base element updated:", field, value),
    updateTextProps: (field, value) => logger.log("Text props updated:", field, value),
    updateDataSource: (dataSource) => logger.log("Data source updated:", dataSource),
    templateId: 1,
    locale: "en",
    textVariables: mockTextVariables,
    selectVariables: mockSelectVariables,
    selfHostedFonts: mockSelfHostedFonts,
    onSubmit: () => logger.log("Form submitted"),
    onCancel: () => logger.log("Form cancelled"),
    isSubmitting: false,
    submitLabel: "Submit",
  },
};

export const WithStudentField: Story = {
  args: {
    state: {
      ...defaultState,
      dataSource: {
        studentField: { field: "STUDENT_NAME" },
      },
    },
    errors: defaultErrors,
    updateBaseElement: (field, value) => logger.log("Base element updated:", field, value),
    updateTextProps: (field, value) => logger.log("Text props updated:", field, value),
    updateDataSource: (dataSource) => logger.log("Data source updated:", dataSource),
    templateId: 1,
    locale: "en",
    textVariables: mockTextVariables,
    selectVariables: mockSelectVariables,
    selfHostedFonts: mockSelfHostedFonts,
    onSubmit: () => logger.log("Form submitted"),
    onCancel: () => logger.log("Form cancelled"),
    isSubmitting: false,
    submitLabel: "Submit",
  },
};

export const Submitting: Story = {
  args: {
    state: defaultState,
    errors: defaultErrors,
    updateBaseElement: (field, value) => logger.log("Base element updated:", field, value),
    updateTextProps: (field, value) => logger.log("Text props updated:", field, value),
    updateDataSource: (dataSource) => logger.log("Data source updated:", dataSource),
    templateId: 1,
    locale: "en",
    textVariables: mockTextVariables,
    selectVariables: mockSelectVariables,
    selfHostedFonts: mockSelfHostedFonts,
    onSubmit: () => logger.log("Form submitted"),
    onCancel: () => logger.log("Form cancelled"),
    isSubmitting: true,
  },
};

