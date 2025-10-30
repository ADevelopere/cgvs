import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/logger";
import { NumberElementCreateForm } from "./NumberElementCreateForm";
import { mockSelfHostedFonts, mockNumberVariables } from "../story.util";
import type { NumberElementFormCreateState, NumberElementFormErrors } from "./types";

const meta: Meta<typeof NumberElementCreateForm> = {
  title: "Template/Editor/Form/Element/Number/NumberElementCreateForm",
  component: NumberElementCreateForm,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof NumberElementCreateForm>;

const defaultState: NumberElementFormCreateState = {
  base: {
    name: "GPA Display",
    description: "Student's grade point average",
    positionX: 100,
    positionY: 100,
    width: 150,
    height: 40,
    alignment: "CENTER",
    renderOrder: 1,
    templateId: 1,
  },
  textProps: {
    fontRef: { google: { identifier: "Roboto" } },
    fontSize: 18,
    color: "#000000",
    overflow: "WRAP",
  },
  dataSource: {
    variableId: 1,
  },
  mapping: {
    ar: "2",
    en: "2",
  },
};

const defaultErrors: NumberElementFormErrors = {
  base: {},
  textProps: {},
  dataSource: {},
  mapping: {},
};

export const Default: Story = {
  args: {
    state: defaultState,
    errors: defaultErrors,
    updateBaseElement: (field, value) => logger.info("Base element updated:", field, value),
    updateTextProps: (field, value) => logger.info("Text props updated:", field, value),
    updateDataSource: (dataSource) => logger.info("Data source updated:", dataSource),
    updateMapping: (mapping) => logger.info("Mapping updated:", mapping),
    templateId: 1,
    locale: "en",
    numberVariables: mockNumberVariables,
    selfHostedFonts: mockSelfHostedFonts,
    onSubmit: () => logger.info("Form submitted"),
    onCancel: () => logger.info("Form cancelled"),
    isSubmitting: false,
  },
};

export const WithErrors: Story = {
  args: {
    state: {
      ...defaultState,
      dataSource: { variableId: 0 },
      mapping: { ar: "-1", en: "abc" },
    },
    errors: {
      base: {},
      textProps: {},
      dataSource: {
        variableId: "Template number variable is required",
      },
      mapping: {
        ar: "Decimal places must be a non-negative number",
        en: "Decimal places must be a non-negative number",
      },
    },
    updateBaseElement: (field, value) => logger.info("Base element updated:", field, value),
    updateTextProps: (field, value) => logger.info("Text props updated:", field, value),
    updateDataSource: (dataSource) => logger.info("Data source updated:", dataSource),
    updateMapping: (mapping) => logger.info("Mapping updated:", mapping),
    templateId: 1,
    locale: "en",
    numberVariables: mockNumberVariables,
    selfHostedFonts: mockSelfHostedFonts,
    onSubmit: () => logger.info("Form submitted"),
    onCancel: () => logger.info("Form cancelled"),
    isSubmitting: false,
  },
};

export const Submitting: Story = {
  args: {
    state: defaultState,
    errors: defaultErrors,
    updateBaseElement: (field, value) => logger.info("Base element updated:", field, value),
    updateTextProps: (field, value) => logger.info("Text props updated:", field, value),
    updateDataSource: (dataSource) => logger.info("Data source updated:", dataSource),
    updateMapping: (mapping) => logger.info("Mapping updated:", mapping),
    templateId: 1,
    locale: "en",
    numberVariables: mockNumberVariables,
    selfHostedFonts: mockSelfHostedFonts,
    onSubmit: () => logger.info("Form submitted"),
    onCancel: () => logger.info("Form cancelled"),
    isSubmitting: true,
  },
};

export const MultipleLocales: Story = {
  args: {
    state: {
      ...defaultState,
      mapping: {
        ar: "2",
        en: "2",
        fr: "3",
        es: "1",
      },
    },
    errors: defaultErrors,
    updateBaseElement: (field, value) => logger.info("Base element updated:", field, value),
    updateTextProps: (field, value) => logger.info("Text props updated:", field, value),
    updateDataSource: (dataSource) => logger.info("Data source updated:", dataSource),
    updateMapping: (mapping) => logger.info("Mapping updated:", mapping),
    templateId: 1,
    locale: "en",
    numberVariables: mockNumberVariables,
    selfHostedFonts: mockSelfHostedFonts,
    onSubmit: () => logger.info("Form submitted"),
    onCancel: () => logger.info("Form cancelled"),
    isSubmitting: false,
  },
};

