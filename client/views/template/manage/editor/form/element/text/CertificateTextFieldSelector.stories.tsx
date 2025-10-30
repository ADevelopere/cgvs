import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/logger";
import { CertificateFieldSelector } from "./CertificateTextFieldSelector";

const meta: Meta<typeof CertificateFieldSelector> = {
  title: "Template/Editor/Form/Element/Text/CertificateFieldSelector",
  component: CertificateFieldSelector,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CertificateFieldSelector>;

export const Default: Story = {
  args: {
    value: "VERIFICATION_CODE",
    onChange: (field) => logger.log("Field changed:", field),
    disabled: false,
  },
};

export const WithError: Story = {
  args: {
    value: "VERIFICATION_CODE",
    onChange: (field) => logger.log("Field changed:", field),
    error: "Field is required",
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    value: "VERIFICATION_CODE",
    onChange: (field) => logger.log("Field changed:", field),
    disabled: true,
  },
};

