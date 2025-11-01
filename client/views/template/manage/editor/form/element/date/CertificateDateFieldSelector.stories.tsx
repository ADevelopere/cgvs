import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/logger";
import { CertificateDateFieldSelector } from "./CertificateDateFieldSelector";
import { CertificateDateField } from "@/client/graphql/generated/gql/graphql";

const meta: Meta<typeof CertificateDateFieldSelector> = {
  title: "Template/Editor/Form/Element/Date/CertificateDateFieldSelector",
  component: CertificateDateFieldSelector,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CertificateDateFieldSelector>;

export const Default: Story = {
  args: {
    value: CertificateDateField.ReleaseDate,
    onChange: field => logger.info("Certificate field changed", { field }),
  },
};

export const WithError: Story = {
  args: {
    value: CertificateDateField.ReleaseDate,
    onChange: field => logger.info("Certificate field changed", { field }),
    error: "Certificate field is required",
  },
};

export const Disabled: Story = {
  args: {
    value: CertificateDateField.ReleaseDate,
    onChange: field => logger.info("Certificate field changed", { field }),
    disabled: true,
  },
};
