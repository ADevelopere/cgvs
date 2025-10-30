import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CertificateFieldSelector } from "./CertificateTextFieldSelector";
import logger from "@/client/lib/logger";

const meta: Meta<typeof CertificateFieldSelector> = {
  title: "Template/Editor/Form/Element/Text/CertificateTextFieldSelector",
  component: CertificateFieldSelector,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CertificateFieldSelector>;

export const VerificationCode: Story = {
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
    error: "Certificate field is required",
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

