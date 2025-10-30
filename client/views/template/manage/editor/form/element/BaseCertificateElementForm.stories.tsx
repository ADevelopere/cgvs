import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BaseCertificateElementForm } from "./BaseCertificateElementForm";
import type { BaseElementState, BaseElementFormErrors } from "./text/types";
import { logger } from "@/client/lib/logger";

const meta: Meta<typeof BaseCertificateElementForm> = {
  title: "Template/Editor/Form/Element/BaseCertificateElementForm",
  component: BaseCertificateElementForm,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BaseCertificateElementForm>;

const defaultBaseProps: BaseElementState = {
  templateId: 1,
  name: "Sample Element",
  description: "This is a sample element description",
  positionX: 100,
  positionY: 150,
  width: 300,
  height: 50,
  alignment: "CENTER",
  renderOrder: 1,
};

const defaultErrors: BaseElementFormErrors = {};

export const Default: Story = {
  args: {
    baseProps: defaultBaseProps,
    onFieldChange: (key, value) => logger.info("Field changed:", key, value),
    errors: defaultErrors,
    disabled: false,
  },
};

export const WithErrors: Story = {
  args: {
    baseProps: { ...defaultBaseProps, name: "" },
    onFieldChange: (key, value) => logger.info("Field changed:", key, value),
    errors: {
      name: "Name is required",
      width: "Dimension must be positive",
    },
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    baseProps: defaultBaseProps,
    onFieldChange: (key, value) => logger.info("Field changed:", key, value),
    errors: defaultErrors,
    disabled: true,
  },
};

