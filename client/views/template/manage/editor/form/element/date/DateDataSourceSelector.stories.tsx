import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/logger";
import { DateDataSourceSelector } from "./DateDataSourceSelector";

const meta: Meta<typeof DateDataSourceSelector> = {
  title: "Template/Editor/Form/Element/Date/DateDataSourceSelector",
  component: DateDataSourceSelector,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DateDataSourceSelector>;

export const Static: Story = {
  args: {
    selectedType: "STATIC",
    onTypeChange: (type) => logger.info("Type changed", { type }),
  },
};

export const StudentField: Story = {
  args: {
    selectedType: "STUDENT_DATE_FIELD",
    onTypeChange: (type) => logger.info("Type changed", { type }),
  },
};

export const CertificateField: Story = {
  args: {
    selectedType: "CERTIFICATE_DATE_FIELD",
    onTypeChange: (type) => logger.info("Type changed", { type }),
  },
};

export const TemplateVariable: Story = {
  args: {
    selectedType: "TEMPLATE_DATE_VARIABLE",
    onTypeChange: (type) => logger.info("Type changed", { type }),
  },
};

export const Disabled: Story = {
  args: {
    selectedType: "STATIC",
    onTypeChange: (type) => logger.info("Type changed", { type }),
    disabled: true,
  },
};

