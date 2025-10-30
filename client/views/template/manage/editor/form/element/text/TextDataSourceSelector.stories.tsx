import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DataSourceSelector } from "./TextDataSourceSelector";
import { logger } from "@/client/lib/logger";

const meta: Meta<typeof DataSourceSelector> = {
  title: "Template/Editor/Form/Element/Text/TextDataSourceSelector",
  component: DataSourceSelector,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DataSourceSelector>;

export const Static: Story = {
  args: {
    selectedType: "STATIC",
    onTypeChange: type => logger.info("Type changed:", type),
    disabled: false,
  },
};

export const StudentTextField: Story = {
  args: {
    selectedType: "STUDENT_TEXT_FIELD",
    onTypeChange: type => logger.info("Type changed:", type),
    disabled: false,
  },
};

export const CertificateTextField: Story = {
  args: {
    selectedType: "CERTIFICATE_TEXT_FIELD",
    onTypeChange: type => logger.info("Type changed:", type),
    disabled: false,
  },
};

export const TemplateTextVariable: Story = {
  args: {
    selectedType: "TEMPLATE_TEXT_VARIABLE",
    onTypeChange: type => logger.info("Type changed:", type),
    disabled: false,
  },
};

export const TemplateSelectVariable: Story = {
  args: {
    selectedType: "TEMPLATE_SELECT_VARIABLE",
    onTypeChange: type => logger.info("Type changed:", type),
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    selectedType: "STATIC",
    onTypeChange: type => logger.info("Type changed:", type),
    disabled: true,
  },
};
