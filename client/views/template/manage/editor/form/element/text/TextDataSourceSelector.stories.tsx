import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/logger";
import { DataSourceSelector } from "./TextDataSourceSelector";
import { TextDataSourceType } from "@/client/graphql/generated/gql/graphql";

const meta: Meta<typeof DataSourceSelector> = {
  title: "Template/Editor/Form/Element/Text/DataSourceSelector",
  component: DataSourceSelector,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DataSourceSelector>;

export const Static: Story = {
  args: {
    selectedType: TextDataSourceType.Static,
    onTypeChange: type => logger.log("Type changed:", type),
    disabled: false,
  },
};

export const StudentField: Story = {
  args: {
    selectedType: TextDataSourceType.StudentTextField,
    onTypeChange: type => logger.log("Type changed:", type),
    disabled: false,
  },
};

export const CertificateField: Story = {
  args: {
    selectedType: TextDataSourceType.CertificateTextField,
    onTypeChange: type => logger.log("Type changed:", type),
    disabled: false,
  },
};

export const TemplateTextVariable: Story = {
  args: {
    selectedType: TextDataSourceType.TemplateTextVariable,
    onTypeChange: type => logger.log("Type changed:", type),
    disabled: false,
  },
};

export const TemplateSelectVariable: Story = {
  args: {
    selectedType: TextDataSourceType.TemplateSelectVariable,
    onTypeChange: type => logger.log("Type changed:", type),
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    selectedType: TextDataSourceType.Static,
    onTypeChange: type => logger.log("Type changed:", type),
    disabled: true,
  },
};
