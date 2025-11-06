import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/console";
import { QrCodePropsForm } from "./QrCodePropsForm";
import { QrCodeErrorCorrection } from "@/client/graphql/generated/gql/graphql";

const meta: Meta<typeof QrCodePropsForm> = {
  title: "Template/Editor/Form/Element/QrCode/QrCodePropsForm",
  component: QrCodePropsForm,
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Disable form inputs",
    },
  },
};

export default meta;
type Story = StoryObj<typeof QrCodePropsForm>;

// Default - Low Error Correction
export const Default: Story = {
  args: {
    qrCodeProps: {
      foregroundColor: "#000000",
      backgroundColor: "#FFFFFF",
      errorCorrection: QrCodeErrorCorrection.L,
    },
    errors: {},
    updateQrCodeProps: ({ key, value }) => {
      logger.info(`QR code prop updated: ${key} =`, value);
    },
    disabled: false,
  },
};

// Medium Error Correction
export const MediumErrorCorrection: Story = {
  args: {
    qrCodeProps: {
      foregroundColor: "#000000",
      backgroundColor: "#FFFFFF",
      errorCorrection: QrCodeErrorCorrection.M,
    },
    errors: {},
    updateQrCodeProps: ({ key, value }) => {
      logger.info(`QR code prop updated: ${key} =`, value);
    },
    disabled: false,
  },
};

// Quartile Error Correction
export const QuartileErrorCorrection: Story = {
  args: {
    qrCodeProps: {
      foregroundColor: "#000000",
      backgroundColor: "#FFFFFF",
      errorCorrection: QrCodeErrorCorrection.Q,
    },
    errors: {},
    updateQrCodeProps: ({ key, value }) => {
      logger.info(`QR code prop updated: ${key} =`, value);
    },
    disabled: false,
  },
};

// High Error Correction
export const HighErrorCorrection: Story = {
  args: {
    qrCodeProps: {
      foregroundColor: "#000000",
      backgroundColor: "#FFFFFF",
      errorCorrection: QrCodeErrorCorrection.H,
    },
    errors: {},
    updateQrCodeProps: ({ key, value }) => {
      logger.info(`QR code prop updated: ${key} =`, value);
    },
    disabled: false,
  },
};

// Custom Colors - Blue QR Code
export const CustomColorsBlue: Story = {
  args: {
    qrCodeProps: {
      foregroundColor: "#1976D2",
      backgroundColor: "#E3F2FD",
      errorCorrection: QrCodeErrorCorrection.M,
    },
    errors: {},
    updateQrCodeProps: ({ key, value }) => {
      logger.info(`QR code prop updated: ${key} =`, value);
    },
    disabled: false,
  },
};

// Custom Colors - Dark Theme
export const CustomColorsDark: Story = {
  args: {
    qrCodeProps: {
      foregroundColor: "#FFFFFF",
      backgroundColor: "#212121",
      errorCorrection: QrCodeErrorCorrection.H,
    },
    errors: {},
    updateQrCodeProps: ({ key, value }) => {
      logger.info(`QR code prop updated: ${key} =`, value);
    },
    disabled: false,
  },
};

// Custom Colors - Green Brand
export const CustomColorsGreen: Story = {
  args: {
    qrCodeProps: {
      foregroundColor: "#2E7D32",
      backgroundColor: "#F1F8E9",
      errorCorrection: QrCodeErrorCorrection.Q,
    },
    errors: {},
    updateQrCodeProps: ({ key, value }) => {
      logger.info(`QR code prop updated: ${key} =`, value);
    },
    disabled: false,
  },
};

// With validation errors
export const WithErrors: Story = {
  args: {
    qrCodeProps: {
      foregroundColor: "",
      backgroundColor: "invalid",
      errorCorrection: QrCodeErrorCorrection.L,
    },
    errors: {
      foregroundColor: "Foreground color is required",
      backgroundColor: "Invalid hex color format (e.g., #FFFFFF)",
    },
    updateQrCodeProps: ({ key, value }) => {
      logger.info(`QR code prop updated: ${key} =`, value);
    },
    disabled: false,
  },
};

// All fields with errors
export const AllFieldsWithErrors: Story = {
  args: {
    qrCodeProps: {
      foregroundColor: "",
      backgroundColor: "",
      errorCorrection: QrCodeErrorCorrection.L,
    },
    errors: {
      foregroundColor: "Foreground color is required",
      backgroundColor: "Background color is required",
      errorCorrection: "Error correction level is required",
    },
    updateQrCodeProps: ({ key, value }) => {
      logger.info(`QR code prop updated: ${key} =`, value);
    },
    disabled: false,
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    qrCodeProps: {
      foregroundColor: "#000000",
      backgroundColor: "#FFFFFF",
      errorCorrection: QrCodeErrorCorrection.M,
    },
    errors: {},
    updateQrCodeProps: ({ key, value }) => {
      logger.info(`QR code prop updated: ${key} =`, value);
    },
    disabled: true,
  },
};
