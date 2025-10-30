import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/logger";
import { TextElementCreateForm } from "./TextElementCreateForm";
import type {
  TextElementState,
  TextElementFormErrors,
  TemplateTextVariable,
  TemplateSelectVariable,
  Font,
} from "./types";

const meta: Meta<typeof TextElementCreateForm> = {
  title: "Template/Editor/Form/Element/Text/TextElementCreateForm",
  component: TextElementCreateForm,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof TextElementCreateForm>;

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
  name: "Text Element",
  description: "Sample text element",
  positionX: 100,
  positionY: 150,
  width: 300,
  height: 50,
  alignment: "CENTER",
  renderOrder: 1,
  textProps: {
    fontRef: { type: "GOOGLE", identifier: "Roboto" },
    fontSize: 16,
    color: "#000000",
    overflow: "WRAP",
  },
  dataSource: { type: "STATIC", value: "Sample Text" },
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

export const WithErrors: Story = {
  args: {
    state: { ...defaultState, name: "", description: "" },
    errors: {
      base: {
        name: "Name is required",
        description: "Description is required",
      },
      textProps: {
        fontSize: "Font size must be positive",
      },
      dataSource: {
        value: "Static value is required",
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
        fontRef: { type: "SELF_HOSTED", fontId: 1 },
        fontSize: 18,
        color: "#333333",
        overflow: "RESIZE_DOWN",
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
