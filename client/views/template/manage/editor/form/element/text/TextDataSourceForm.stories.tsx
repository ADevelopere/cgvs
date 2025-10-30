import { Meta, StoryObj } from "@storybook/nextjs-vite";
import logger from "@/client/lib/logger";
import { DataSourceForm } from "./TextDataSourceForm";
import type { TextDataSourceState, DataSourceFormErrors } from "./types";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

const meta: Meta<typeof DataSourceForm> = {
  title: "Template/Editor/Form/Element/Text/TextDataSourceForm",
  component: DataSourceForm,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DataSourceForm>;

const mockTextVariables: Graphql.TemplateTextVariable[] = [
  { id: 1, name: "Organization Name", __typename: "TemplateTextVariable" },
  { id: 2, name: "Course Name", __typename: "TemplateTextVariable" },
];

const mockSelectVariables: Graphql.TemplateSelectVariable[] = [
  { id: 1, name: "Certificate Type", __typename: "TemplateSelectVariable" },
  { id: 2, name: "Achievement Level", __typename: "TemplateSelectVariable" },
];

const defaultErrors: DataSourceFormErrors = {};

export const StaticSource: Story = {
  args: {
    dataSource: { type: "STATIC", value: "Sample Text" } as TextDataSourceState,
    textVariables: mockTextVariables,
    selectVariables: mockSelectVariables,
    onDataSourceChange: dataSource =>
      logger.log("Data source changed:", dataSource),
    errors: defaultErrors,
    disabled: false,
    showSelector: true,
  },
};

export const StudentField: Story = {
  args: {
    dataSource: {
      type: "STUDENT_TEXT_FIELD",
      field: "STUDENT_NAME",
    } as TextDataSourceState,
    textVariables: mockTextVariables,
    selectVariables: mockSelectVariables,
    onDataSourceChange: dataSource =>
      logger.log("Data source changed:", dataSource),
    errors: defaultErrors,
    disabled: false,
    showSelector: true,
  },
};

export const CertificateField: Story = {
  args: {
    dataSource: {
      type: "CERTIFICATE_TEXT_FIELD",
      field: "VERIFICATION_CODE",
    } as TextDataSourceState,
    textVariables: mockTextVariables,
    selectVariables: mockSelectVariables,
    onDataSourceChange: dataSource =>
      logger.log("Data source changed:", dataSource),
    errors: defaultErrors,
    disabled: false,
    showSelector: true,
  },
};

export const TemplateTextVariable: Story = {
  args: {
    dataSource: {
      type: "TEMPLATE_TEXT_VARIABLE",
      variableId: 1,
    } as TextDataSourceState,
    textVariables: mockTextVariables,
    selectVariables: mockSelectVariables,
    onDataSourceChange: dataSource =>
      logger.log("Data source changed:", dataSource),
    errors: defaultErrors,
    disabled: false,
    showSelector: true,
  },
};

export const TemplateSelectVariable: Story = {
  args: {
    dataSource: {
      type: "TEMPLATE_SELECT_VARIABLE",
      variableId: 1,
    } as TextDataSourceState,
    textVariables: mockTextVariables,
    selectVariables: mockSelectVariables,
    onDataSourceChange: dataSource =>
      logger.log("Data source changed:", dataSource),
    errors: defaultErrors,
    disabled: false,
    showSelector: true,
  },
};

export const WithoutSelector: Story = {
  args: {
    dataSource: { type: "STATIC", value: "Fixed Text" } as TextDataSourceState,
    textVariables: mockTextVariables,
    selectVariables: mockSelectVariables,
    onDataSourceChange: dataSource =>
      logger.log("Data source changed:", dataSource),
    errors: defaultErrors,
    disabled: false,
    showSelector: false,
  },
};

export const WithErrors: Story = {
  args: {
    dataSource: { type: "STATIC", value: "" } as TextDataSourceState,
    textVariables: mockTextVariables,
    selectVariables: mockSelectVariables,
    onDataSourceChange: dataSource =>
      logger.log("Data source changed:", dataSource),
    errors: { value: "Static value is required" },
    disabled: false,
    showSelector: true,
  },
};

export const Disabled: Story = {
  args: {
    dataSource: { type: "STATIC", value: "Sample Text" } as TextDataSourceState,
    textVariables: mockTextVariables,
    selectVariables: mockSelectVariables,
    onDataSourceChange: dataSource =>
      logger.log("Data source changed:", dataSource),
    errors: defaultErrors,
    disabled: true,
    showSelector: true,
  },
};
