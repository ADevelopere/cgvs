import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/console";
import { DateDataSourceSelector } from "./DateDataSourceSelector";
import { DateDataSourceType } from "@/client/graphql/generated/gql/graphql";

const meta: Meta<typeof DateDataSourceSelector> = {
  title: "Template/Editor/Form/Element/Date/DateDataSourceSelector",
  component: DateDataSourceSelector,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DateDataSourceSelector>;

export const Static: Story = {
  args: {
    selectedType: DateDataSourceType.Static,
    onTypeChange: type => logger.info("Type changed", { type }),
  },
};

export const StudentField: Story = {
  args: {
    selectedType: DateDataSourceType.StudentDateField,
    onTypeChange: type => logger.info("Type changed", { type }),
  },
};

export const CertificateField: Story = {
  args: {
    selectedType: DateDataSourceType.CertificateDateField,
    onTypeChange: type => logger.info("Type changed", { type }),
  },
};

export const TemplateVariable: Story = {
  args: {
    selectedType: DateDataSourceType.TemplateDateVariable,
    onTypeChange: type => logger.info("Type changed", { type }),
  },
};

export const Disabled: Story = {
  args: {
    selectedType: DateDataSourceType.Static,
    onTypeChange: type => logger.info("Type changed", { type }),
    disabled: true,
  },
};
