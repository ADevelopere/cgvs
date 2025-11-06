import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/logger";
import { DataSourceForm } from "./TextDataSourceForm";
import { mockTextVariables, mockSelectVariables } from "../story.util";
import { CertificateTextField, StudentTextField } from "@/client/graphql/generated/gql/graphql";

const meta: Meta<typeof DataSourceForm> = {
  title: "Template/Editor/Form/Element/Text/DataSourceForm",
  component: DataSourceForm,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DataSourceForm>;

export const StaticSource: Story = {
  args: {
    dataSource: { static: { value: "Certificate of Completion" } },
    textVariables: mockTextVariables,
    selectVariables: mockSelectVariables,
    updateDataSource: dataSource => logger.log("Data source changed:", dataSource),
    errors: {},
    disabled: false,
    showSelector: true,
  },
};

export const StudentFieldSource: Story = {
  args: {
    dataSource: { studentField: { field: StudentTextField.StudentName } },
    textVariables: mockTextVariables,
    selectVariables: mockSelectVariables,
    updateDataSource: dataSource => logger.log("Data source changed:", dataSource),
    errors: {},
    disabled: false,
    showSelector: true,
  },
};

export const CertificateFieldSource: Story = {
  args: {
    dataSource: {
      certificateField: { field: CertificateTextField.VerificationCode },
    },
    textVariables: mockTextVariables,
    selectVariables: mockSelectVariables,
    updateDataSource: dataSource => logger.log("Data source changed:", dataSource),
    errors: {},
    disabled: false,
    showSelector: true,
  },
};

export const TemplateTextVariableSource: Story = {
  args: {
    dataSource: { templateTextVariable: { variableId: 1 } },
    textVariables: mockTextVariables,
    selectVariables: mockSelectVariables,
    updateDataSource: dataSource => logger.log("Data source changed:", dataSource),
    errors: {},
    disabled: false,
    showSelector: true,
  },
};

export const TemplateSelectVariableSource: Story = {
  args: {
    dataSource: { templateSelectVariable: { variableId: 1 } },
    textVariables: mockTextVariables,
    selectVariables: mockSelectVariables,
    updateDataSource: dataSource => logger.log("Data source changed:", dataSource),
    errors: {},
    disabled: false,
    showSelector: true,
  },
};

export const WithErrors: Story = {
  args: {
    dataSource: { static: { value: "" } },
    textVariables: mockTextVariables,
    selectVariables: mockSelectVariables,
    updateDataSource: dataSource => logger.log("Data source changed:", dataSource),
    errors: { dataSource: { static: "Value is required" } },
    disabled: false,
    showSelector: true,
  },
};

export const WithoutSelector: Story = {
  args: {
    dataSource: { static: { value: "Certificate of Completion" } },
    textVariables: mockTextVariables,
    selectVariables: mockSelectVariables,
    updateDataSource: dataSource => logger.log("Data source changed:", dataSource),
    errors: {},
    disabled: false,
    showSelector: false,
  },
};

export const Disabled: Story = {
  args: {
    dataSource: { static: { value: "Certificate of Completion" } },
    textVariables: mockTextVariables,
    selectVariables: mockSelectVariables,
    updateDataSource: dataSource => logger.log("Data source changed:", dataSource),
    errors: {},
    disabled: true,
    showSelector: true,
  },
};
