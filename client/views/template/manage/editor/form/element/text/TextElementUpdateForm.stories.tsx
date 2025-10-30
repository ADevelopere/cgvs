import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from  "@/client/lib/logger";
import { TextElementUpdateForm } from "./TextElementUpdateForm";
import type {
  TextElementState,
  TextElementFormErrors,
  TemplateTextVariable,
  TemplateSelectVariable,
  Font,
} from "./types";

const meta: Meta<typeof TextElementUpdateForm> = {
  title: "Template/Editor/Form/Element/Text/TextElementUpdateForm",
  component: TextElementUpdateForm,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof TextElementUpdateForm>;

const mockTextVariables: TemplateTextVariable[] = [
  { id: 1, name: "Organization Name", __typename: "TemplateTextVariable" },
  { id: 2, name: "Course Name", __typename: "TemplateTextVariable" },
];

const mockSelectVariables: TemplateSelectVariable[] = [
  { id: 1, name: "Certificate Type", __typename: "TemplateSelectVariable" },
  { id: 2, name: "Achievement Level", __typename: "TemplateSelectVariable" },
];

const mockSelfHostedFonts: Font[] = [
  {
    id: 1,
    name: "Cairo",
    locale: ["all"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: "Amiri",
    locale: ["all"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    name: "Tajawal",
    locale: ["all"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const defaultState: TextElementState = {
  templateId: 1,
  name: "Existing Text Element",
  description: "This is an existing text element",
  positionX: 150,
  positionY: 200,
  width: 400,
  height: 60,
  alignment: "START",
  renderOrder: 2,
  textProps: {
    fontRef: { type: "GOOGLE", identifier: "Open Sans" },
    fontSize: 18,
    color: "#333333",
    overflow: "ELLIPSE",
  },
  dataSource: { type: "STUDENT_TEXT_FIELD", field: "STUDENT_NAME" },
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
    updateBaseElement: (key, value) =>
      logger.log("Base element updated:", key, value),
    updateTextProps: (key, value) =>
      logger.log("Text props updated:", key, value),
    updateDataSource: dataSource =>
      logger.log("Data source updated:", dataSource),
    templateId: 1,
    locale: "en",
    textVariables: mockTextVariables,
    selectVariables: mockSelectVariables,
    selfHostedFonts: mockSelfHostedFonts,
    onSubmit: () => logger.log("Form submitted"),
    onCancel: () => logger.log("Form cancelled"),
    isSubmitting: false,
  },
};

export const WithTemplateVariable: Story = {
  args: {
    state: {
      ...defaultState,
      dataSource: { type: "TEMPLATE_TEXT_VARIABLE", variableId: 1 },
    },
    errors: defaultErrors,
    updateBaseElement: (key, value) =>
      logger.log("Base element updated:", key, value),
    updateTextProps: (key, value) =>
      logger.log("Text props updated:", key, value),
    updateDataSource: dataSource =>
      logger.log("Data source updated:", dataSource),
    templateId: 1,
    locale: "en",
    textVariables: mockTextVariables,
    selectVariables: mockSelectVariables,
    selfHostedFonts: mockSelfHostedFonts,
    onSubmit: () => logger.log("Form submitted"),
    onCancel: () => logger.log("Form cancelled"),
    isSubmitting: false,
  },
};

export const WithErrors: Story = {
  args: {
    state: { ...defaultState, name: "", description: "" },
    errors: {
      base: {
        name: "Name is required",
        width: "Dimension must be positive",
      },
      textProps: {
        color: "Invalid color format",
      },
      dataSource: {
        field: "Student field is required",
      },
    },
    updateBaseElement: (key, value) =>
      logger.log("Base element updated:", key, value),
    updateTextProps: (key, value) =>
      logger.log("Text props updated:", key, value),
    updateDataSource: dataSource =>
      logger.log("Data source updated:", dataSource),
    templateId: 1,
    locale: "en",
    textVariables: mockTextVariables,
    selectVariables: mockSelectVariables,
    selfHostedFonts: mockSelfHostedFonts,
    onSubmit: () => logger.log("Form submitted"),
    onCancel: () => logger.log("Form cancelled"),
    isSubmitting: false,
  },
};

export const Submitting: Story = {
  args: {
    state: defaultState,
    errors: defaultErrors,
    updateBaseElement: (key, value) =>
      logger.log("Base element updated:", key, value),
    updateTextProps: (key, value) =>
      logger.log("Text props updated:", key, value),
    updateDataSource: dataSource =>
      logger.log("Data source updated:", dataSource),
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

export const ArabicLocale: Story = {
  args: {
    state: {
      ...defaultState,
      textProps: {
        fontRef: { type: "SELF_HOSTED", fontId: 2 },
        fontSize: 20,
        color: "#222222",
        overflow: "WRAP",
      },
    },
    errors: defaultErrors,
    updateBaseElement: (key, value) =>
      logger.log("Base element updated:", key, value),
    updateTextProps: (key, value) =>
      logger.log("Text props updated:", key, value),
    updateDataSource: dataSource =>
      logger.log("Data source updated:", dataSource),
    templateId: 1,
    locale: "ar",
    textVariables: mockTextVariables,
    selectVariables: mockSelectVariables,
    selfHostedFonts: mockSelfHostedFonts,
    onSubmit: () => logger.log("Form submitted"),
    onCancel: () => logger.log("Form cancelled"),
    isSubmitting: false,
  },
};
