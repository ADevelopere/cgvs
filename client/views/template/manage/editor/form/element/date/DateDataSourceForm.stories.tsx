import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/console";
import { DateDataSourceForm } from "./DateDataSourceForm";
import { CertificateDateField, StudentDateField, TemplateDateVariable } from "@/client/graphql/generated/gql/graphql";

const mockDateVariables: TemplateDateVariable[] = [
  {
    __typename: "TemplateDateVariable",
    id: 1,
    name: "Course Start Date",
    description: "The date when the course started",
    required: true,
    format: "YYYY-MM-DD",
    minDate: new Date("2020-01-01"),
    maxDate: new Date("2030-12-31"),
    previewValue: "2024-01-15",
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    __typename: "TemplateDateVariable",
    id: 2,
    name: "Graduation Date",
    description: "The date when student graduated",
    required: false,
    format: "DD/MM/YYYY",
    minDate: new Date("2020-01-01"),
    maxDate: new Date("2030-12-31"),
    previewValue: "15/06/2024",
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const meta: Meta<typeof DateDataSourceForm> = {
  title: "Template/Editor/Form/Element/Date/DateDataSourceForm",
  component: DateDataSourceForm,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DateDataSourceForm>;

export const Static: Story = {
  args: {
    dataSource: { static: { value: "2024-01-15" } },
    dateVariables: mockDateVariables,
    onDataSourceChange: dataSource => logger.info("Data source changed", { dataSource }),
    errors: {},
    showSelector: true,
  },
};

export const StudentField: Story = {
  args: {
    dataSource: { studentField: { field: StudentDateField.DateOfBirth } },
    dateVariables: mockDateVariables,
    onDataSourceChange: dataSource => logger.info("Data source changed", { dataSource }),
    errors: {},
    showSelector: true,
  },
};

export const CertificateField: Story = {
  args: {
    dataSource: {
      certificateField: { field: CertificateDateField.ReleaseDate },
    },
    dateVariables: mockDateVariables,
    onDataSourceChange: dataSource => logger.info("Data source changed", { dataSource }),
    errors: {},
    showSelector: true,
  },
};

export const TemplateVariable: Story = {
  args: {
    dataSource: { templateVariable: { variableId: 1 } },
    dateVariables: mockDateVariables,
    onDataSourceChange: dataSource => logger.info("Data source changed", { dataSource }),
    errors: {},
    showSelector: true,
  },
};

export const WithErrors: Story = {
  args: {
    dataSource: { static: { value: "" } },
    dateVariables: mockDateVariables,
    onDataSourceChange: dataSource => logger.info("Data source changed", { dataSource }),
    errors: { static: "Date is required" },
    showSelector: true,
  },
};

export const WithoutSelector: Story = {
  args: {
    dataSource: { static: { value: "2024-01-15" } },
    dateVariables: mockDateVariables,
    onDataSourceChange: dataSource => logger.info("Data source changed", { dataSource }),
    errors: {},
    showSelector: false,
  },
};
