import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/logger";
import { NumberElementForm } from "./NumberElementForm";
import { mockSelfHostedFonts, mockNumberVariables } from "../story.util";
import type { NumberElementFormState, NumberElementFormErrors } from "./types";
import { UpdateBaseElementFn } from "../base";
import { UpdateTextPropsFn } from "../textProps";
import { AppLanguage, ElementAlignment, ElementOverflow } from "@/client/graphql/generated/gql/graphql";

const meta: Meta<typeof NumberElementForm> = {
  title: "Template/Editor/Form/Element/Number/NumberElementForm",
  component: NumberElementForm,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof NumberElementForm>;

const defaultState: NumberElementFormState = {
  base: {
    name: "GPA Display",
    description: "Student's grade point average",
    positionX: 100,
    positionY: 100,
    width: 150,
    height: 40,
    alignment: ElementAlignment.Center,
    zIndex: 1,
    templateId: 1,
  },
  textProps: {
    fontRef: { google: { identifier: "Roboto" } },
    fontSize: 18,
    color: "#000000",
    overflow: ElementOverflow.Wrap,
  },
  dataSource: {
    variableId: 1,
  },
  numberProps: {
    mapping: {
      ar: "2",
      en: "2",
    },
  },
};

const defaultErrors: NumberElementFormErrors = {
  base: {},
  textProps: {},
  dataSource: {},
  numberProps: {},
};

export const Default: Story = {
  args: {
    state: defaultState,
    errors: defaultErrors,
    updateBaseElement: (({ key, value }) =>
      logger.info("Base element updated:", {
        key,
        value,
      })) satisfies UpdateBaseElementFn,
    updateTextProps: (({ key, value }) =>
      logger.info("Text props updated:", {
        key,
        value,
      })) satisfies UpdateTextPropsFn,
    updateDataSource: dataSource => logger.info("Data source updated:", dataSource),
    updateMapping: mapping => logger.info("Mapping updated:", mapping),
    language: AppLanguage.Ar,
    numberVariables: mockNumberVariables,
    selfHostedFonts: mockSelfHostedFonts,
    onSubmit: () => logger.info("Form submitted"),
    onCancel: () => logger.info("Form cancelled"),
    isSubmitting: false,
    submitLabel: "submit",
  },
};

export const WithErrors: Story = {
  args: {
    state: {
      ...defaultState,
      dataSource: { variableId: 0 },
      numberProps: {
        ...defaultState.numberProps,
        mapping: { ar: "-1", en: "abc" },
      },
    },
    errors: {
      base: {},
      textProps: {},
      dataSource: {
        variableId: "Template number variable is required",
      },
      numberProps: {
        mapping: {
          ar: "Decimal places must be a non-negative number",
          en: "Decimal places must be a non-negative number",
        },
      },
    },
    updateBaseElement: (({ key, value }) =>
      logger.info("Base element updated:", {
        key,
        value,
      })) satisfies UpdateBaseElementFn,
    updateTextProps: (({ key, value }) =>
      logger.info("Text props updated:", {
        key,
        value,
      })) satisfies UpdateTextPropsFn,
    updateDataSource: dataSource => logger.info("Data source updated:", dataSource),
    updateMapping: mapping => logger.info("Mapping updated:", mapping),
    language: AppLanguage.Ar,
    numberVariables: mockNumberVariables,
    selfHostedFonts: mockSelfHostedFonts,
    onSubmit: () => logger.info("Form submitted"),
    onCancel: () => logger.info("Form cancelled"),
    isSubmitting: false,
    submitLabel: "submit",
  },
};

export const Submitting: Story = {
  args: {
    state: defaultState,
    errors: defaultErrors,
    updateBaseElement: (({ key, value }) =>
      logger.info("Base element updated:", {
        key,
        value,
      })) satisfies UpdateBaseElementFn,
    updateTextProps: (({ key, value }) =>
      logger.info("Text props updated:", {
        key,
        value,
      })) satisfies UpdateTextPropsFn,
    updateDataSource: dataSource => logger.info("Data source updated:", dataSource),
    updateMapping: mapping => logger.info("Mapping updated:", mapping),
    language: AppLanguage.Ar,
    numberVariables: mockNumberVariables,
    selfHostedFonts: mockSelfHostedFonts,
    onSubmit: () => logger.info("Form submitted"),
    onCancel: () => logger.info("Form cancelled"),
    isSubmitting: true,
    submitLabel: "submit",
  },
};

export const MultipleLocales: Story = {
  args: {
    state: {
      ...defaultState,
      numberProps: {
        ...defaultState.numberProps,
        mapping: { ar: "-1", en: "abc" },
      },
    },
    errors: defaultErrors,
    updateBaseElement: (({ key, value }) =>
      logger.info("Base element updated:", {
        key,
        value,
      })) satisfies UpdateBaseElementFn,
    updateTextProps: (({ key, value }) =>
      logger.info("Text props updated:", {
        key,
        value,
      })) satisfies UpdateTextPropsFn,
    updateDataSource: dataSource => logger.info("Data source updated:", dataSource),
    updateMapping: mapping => logger.info("Mapping updated:", mapping),
    language: AppLanguage.En,
    numberVariables: mockNumberVariables,
    selfHostedFonts: mockSelfHostedFonts,
    onSubmit: () => logger.info("Form submitted"),
    onCancel: () => logger.info("Form cancelled"),
    isSubmitting: false,
  },
};
