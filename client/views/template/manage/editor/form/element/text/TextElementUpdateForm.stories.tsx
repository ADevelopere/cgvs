import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/logger";
import { TextElementUpdateForm } from "./TextElementUpdateForm";
import { mockSelfHostedFonts, mockTextVariables, mockSelectVariables } from "../story.util";
import type { TextElementFormUpdateState, TextElementFormErrors } from "./types";

const meta: Meta<typeof TextElementUpdateForm> = {
  title: "Template/Editor/Form/Element/Text/TextElementUpdateForm",
  component: TextElementUpdateForm,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TextElementUpdateForm>;

const defaultState: TextElementFormUpdateState = {
  base: {
    id: 1,
    name: "Text Element",
    description: "A text element",
    positionX: 100,
    positionY: 100,
    width: 200,
    height: 50,
    alignment: "CENTER",
    renderOrder: 1,
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
  },
};

export const WithTemplateVariable: Story = {
  args: {
    state: {
      ...defaultState,
      dataSource: {
        templateTextVariable: { variableId: 1 },
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

