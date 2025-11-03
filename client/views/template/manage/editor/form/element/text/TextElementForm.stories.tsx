import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/logger";
import { TextElementForm } from "./TextElementForm";
import {
  mockSelfHostedFonts,
  mockTextVariables,
  mockSelectVariables,
} from "../story.util";
import type { TextElementFormErrors, TextElementFormState } from "./types";
import {
  AppLanguage,
  ElementAlignment,
  ElementOverflow,
  StudentTextField,
} from "@/client/graphql/generated/gql/graphql";

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
    alignment: ElementAlignment.Center,
    renderOrder: 1,
    templateId: 1,
  },
  textProps: {
    fontRef: { google: { identifier: "Roboto" } },
    fontSize: 16,
    color: "#000000",
    overflow: ElementOverflow.Wrap,
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
    updateBaseElement: ({ key, value }) =>
      logger.log("Base element updated:", key, value),
    updateTextProps: ({ key, value }) =>
      logger.log("Text props updated:", key, value),
    updateDataSource: dataSource =>
      logger.log("Data source updated:", dataSource),
    language: AppLanguage.Ar,
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
        studentField: { field: StudentTextField.StudentName },
      },
    },
    errors: defaultErrors,
    updateBaseElement: ({ key, value }) =>
      logger.log("Base element updated:", key, value),
    updateTextProps: ({ key, value }) =>
      logger.log("Text props updated:", key, value),
    updateDataSource: dataSource =>
      logger.log("Data source updated:", dataSource),
    language: AppLanguage.En,
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
    updateBaseElement: ({ key, value }) =>
      logger.log("Base element updated:", key, value),
    updateTextProps: ({ key, value }) =>
      logger.log("Text props updated:", key, value),
    updateDataSource: dataSource =>
      logger.log("Data source updated:", dataSource),
    language: AppLanguage.En,
    textVariables: mockTextVariables,
    selectVariables: mockSelectVariables,
    selfHostedFonts: mockSelfHostedFonts,
    onSubmit: () => logger.log("Form submitted"),
    onCancel: () => logger.log("Form cancelled"),
    isSubmitting: true,
  },
};
