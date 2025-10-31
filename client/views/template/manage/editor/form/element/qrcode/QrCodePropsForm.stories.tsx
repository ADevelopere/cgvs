import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/logger";
import { QrCodePropsForm } from "./QrCodePropsForm";
import { QrCodePropsState } from "./types";

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
      errorCorrection: "L",
    },
    errors: {},
    updateQrCodeProps: <K extends keyof QrCodePropsState>(
      key: K,
      value: QrCodePropsState[K]
    ) => {
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
      errorCorrection: "M",
    },
    errors: {},
    updateQrCodeProps: <K extends keyof QrCodePropsState>(
      key: K,
      value: QrCodePropsState[K]
    ) => {
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
      errorCorrection: "Q",
    },
    errors: {},
    updateQrCodeProps: <K extends keyof QrCodePropsState>(
      key: K,
      value: QrCodePropsState[K]
    ) => {
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
      errorCorrection: "H",
    },
    errors: {},
    updateQrCodeProps: <K extends keyof QrCodePropsState>(
      key: K,
      value: QrCodePropsState[K]
    ) => {
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
      errorCorrection: "M",
    },
    errors: {},
    updateQrCodeProps: <K extends keyof QrCodePropsState>(
      key: K,
      value: QrCodePropsState[K]
    ) => {
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
      errorCorrection: "M",
    },
    errors: {},
    updateQrCodeProps: <K extends keyof QrCodePropsState>(
      key: K,
      value: QrCodePropsState[K]
    ) => {
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
      errorCorrection: "Q",
    },
    errors: {},
    updateQrCodeProps: <K extends keyof QrCodePropsState>(
      key: K,
      value: QrCodePropsState[K]
    ) => {
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
      errorCorrection: "L",
    },
    errors: {
      foregroundColor: "Foreground color is required",
      backgroundColor: "Invalid hex color format (e.g., #FFFFFF)",
    },
    updateQrCodeProps: <K extends keyof QrCodePropsState>(
      key: K,
      value: QrCodePropsState[K]
    ) => {
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
      errorCorrection: "L",
    },
    errors: {
      foregroundColor: "Foreground color is required",
      backgroundColor: "Background color is required",
      errorCorrection: "Error correction level is required",
    },
    updateQrCodeProps: <K extends keyof QrCodePropsState>(
      key: K,
      value: QrCodePropsState[K]
    ) => {
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
      errorCorrection: "M",
    },
    errors: {},
    updateQrCodeProps: <K extends keyof QrCodePropsState>(
      key: K,
      value: QrCodePropsState[K]
    ) => {
      logger.info(`QR code prop updated: ${key} =`, value);
    },
    disabled: true,
  },
};
