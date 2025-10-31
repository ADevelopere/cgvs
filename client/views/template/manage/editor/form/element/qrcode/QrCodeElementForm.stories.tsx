import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/logger";
import { QrCodeElementForm } from "./QrCodeElementForm";
import type {
  QrCodeElementFormErrors,
  QrCodeElementFormState,
  UpdateQrCodePropsFn,
} from "./types";
import { UpdateBaseElementFn } from "../base";

const meta: Meta<typeof QrCodeElementForm> = {
  title: "Template/Editor/Form/Element/QrCode/QrCodeElementForm",
  component: QrCodeElementForm,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof QrCodeElementForm>;

const defaultState: QrCodeElementFormState = {
  base: {
    name: "QR Code Element",
    description: "A QR code element",
    positionX: 100,
    positionY: 100,
    width: 150,
    height: 150,
    alignment: "CENTER",
    renderOrder: 1,
    templateId: 1,
  },
  qrCodeProps: {
    foregroundColor: "#000000",
    backgroundColor: "#FFFFFF",
    errorCorrection: "M",
  },
};

const defaultErrors: QrCodeElementFormErrors = {
  base: {},
  qrCodeProps: {},
};

export const Default: Story = {
  args: {
    state: defaultState,
    errors: defaultErrors,
    updateBaseElement: ((field, value) =>
      logger.info("Base element updated:", { field, value })) satisfies UpdateBaseElementFn,
    updateQrCodeProps: ((field, value) =>
      logger.info("QR code props updated:", { field, value })) satisfies UpdateQrCodePropsFn,
    onSubmit: () => logger.info("Form submitted"),
    onCancel: () => logger.info("Form cancelled"),
    isSubmitting: false,
    submitLabel: "Create QR Code Element",
  },
};

export const LowErrorCorrection: Story = {
  args: {
    state: {
      ...defaultState,
      qrCodeProps: {
        foregroundColor: "#000000",
        backgroundColor: "#FFFFFF",
        errorCorrection: "L",
      },
    },
    errors: defaultErrors,
    updateBaseElement: ((field, value) =>
      logger.info("Base element updated:", { field, value })) satisfies UpdateBaseElementFn,
    updateQrCodeProps: ((field, value) =>
      logger.info("QR code props updated:", { field, value })) satisfies UpdateQrCodePropsFn,
    onSubmit: () => logger.info("Form submitted"),
    onCancel: () => logger.info("Form cancelled"),
    isSubmitting: false,
    submitLabel: "Create QR Code Element",
  },
};

export const HighErrorCorrection: Story = {
  args: {
    state: {
      ...defaultState,
      qrCodeProps: {
        foregroundColor: "#000000",
        backgroundColor: "#FFFFFF",
        errorCorrection: "H",
      },
    },
    errors: defaultErrors,
    updateBaseElement: ((field, value) =>
      logger.info("Base element updated:", { field, value })) satisfies UpdateBaseElementFn,
    updateQrCodeProps: ((field, value) =>
      logger.info("QR code props updated:", { field, value })) satisfies UpdateQrCodePropsFn,
    onSubmit: () => logger.info("Form submitted"),
    onCancel: () => logger.info("Form cancelled"),
    isSubmitting: false,
    submitLabel: "Create QR Code Element",
  },
};

export const CustomColorsBlueBrand: Story = {
  args: {
    state: {
      ...defaultState,
      base: {
        ...defaultState.base,
        name: "Certificate Verification QR",
        description: "Blue branded QR code for certificate verification",
      },
      qrCodeProps: {
        foregroundColor: "#1976D2",
        backgroundColor: "#E3F2FD",
        errorCorrection: "Q",
      },
    },
    errors: defaultErrors,
    updateBaseElement: ((field, value) =>
      logger.info("Base element updated:", { field, value })) satisfies UpdateBaseElementFn,
    updateQrCodeProps: ((field, value) =>
      logger.info("QR code props updated:", { field, value })) satisfies UpdateQrCodePropsFn,
    onSubmit: () => logger.info("Form submitted"),
    onCancel: () => logger.info("Form cancelled"),
    isSubmitting: false,
    submitLabel: "Create QR Code Element",
  },
};

export const DarkTheme: Story = {
  args: {
    state: {
      ...defaultState,
      base: {
        ...defaultState.base,
        name: "Dark QR Code",
        description: "QR code with dark theme colors",
      },
      qrCodeProps: {
        foregroundColor: "#FFFFFF",
        backgroundColor: "#212121",
        errorCorrection: "M",
      },
    },
    errors: defaultErrors,
    updateBaseElement: ((field, value) =>
      logger.info("Base element updated:", { field, value })) satisfies UpdateBaseElementFn,
    updateQrCodeProps: ((field, value) =>
      logger.info("QR code props updated:", { field, value })) satisfies UpdateQrCodePropsFn,
    onSubmit: () => logger.info("Form submitted"),
    onCancel: () => logger.info("Form cancelled"),
    isSubmitting: false,
    submitLabel: "Create QR Code Element",
  },
};

export const GreenBrand: Story = {
  args: {
    state: {
      ...defaultState,
      base: {
        ...defaultState.base,
        name: "Green QR Code",
        description: "QR code with green brand colors",
      },
      qrCodeProps: {
        foregroundColor: "#2E7D32",
        backgroundColor: "#F1F8E9",
        errorCorrection: "Q",
      },
    },
    errors: defaultErrors,
    updateBaseElement: ((field, value) =>
      logger.info("Base element updated:", { field, value })) satisfies UpdateBaseElementFn,
    updateQrCodeProps: ((field, value) =>
      logger.info("QR code props updated:", { field, value })) satisfies UpdateQrCodePropsFn,
    onSubmit: () => logger.info("Form submitted"),
    onCancel: () => logger.info("Form cancelled"),
    isSubmitting: false,
    submitLabel: "Create QR Code Element",
  },
};

export const WithBaseErrors: Story = {
  args: {
    state: {
      ...defaultState,
      base: {
        ...defaultState.base,
        name: "",
        width: -10,
      },
    },
    errors: {
      base: {
        name: "Name is required",
        width: "Width must be positive",
      },
      qrCodeProps: {},
    },
    updateBaseElement: ((field, value) =>
      logger.info("Base element updated:", { field, value })) satisfies UpdateBaseElementFn,
    updateQrCodeProps: ((field, value) =>
      logger.info("QR code props updated:", { field, value })) satisfies UpdateQrCodePropsFn,
    onSubmit: () => logger.info("Form submitted"),
    onCancel: () => logger.info("Form cancelled"),
    isSubmitting: false,
    submitLabel: "Create QR Code Element",
  },
};

export const WithQrCodePropsErrors: Story = {
  args: {
    state: {
      ...defaultState,
      qrCodeProps: {
        foregroundColor: "",
        backgroundColor: "invalid",
        errorCorrection: "M",
      },
    },
    errors: {
      base: {},
      qrCodeProps: {
        foregroundColor: "Foreground color is required",
        backgroundColor: "Invalid hex color format (e.g., #FFFFFF)",
      },
    },
    updateBaseElement: ((field, value) =>
      logger.info("Base element updated:", { field, value })) satisfies UpdateBaseElementFn,
    updateQrCodeProps: ((field, value) =>
      logger.info("QR code props updated:", { field, value })) satisfies UpdateQrCodePropsFn,
    onSubmit: () => logger.info("Form submitted"),
    onCancel: () => logger.info("Form cancelled"),
    isSubmitting: false,
    submitLabel: "Create QR Code Element",
  },
};

export const AllFieldsWithErrors: Story = {
  args: {
    state: {
      base: {
        ...defaultState.base,
        name: "",
        description: "",
        width: 0,
        height: 0,
      },
      qrCodeProps: {
        foregroundColor: "",
        backgroundColor: "",
        errorCorrection: "M",
      },
    },
    errors: {
      base: {
        name: "Name is required",
        description: "Description is required",
        width: "Width must be positive",
        height: "Height must be positive",
      },
      qrCodeProps: {
        foregroundColor: "Foreground color is required",
        backgroundColor: "Background color is required",
        errorCorrection: "Error correction level is required",
      },
    },
    updateBaseElement: ((field, value) =>
      logger.info("Base element updated:", { field, value })) satisfies UpdateBaseElementFn,
    updateQrCodeProps: ((field, value) =>
      logger.info("QR code props updated:", { field, value })) satisfies UpdateQrCodePropsFn,
    onSubmit: () => logger.info("Form submitted"),
    onCancel: () => logger.info("Form cancelled"),
    isSubmitting: false,
    submitLabel: "Create QR Code Element",
  },
};

export const Submitting: Story = {
  args: {
    state: defaultState,
    errors: defaultErrors,
    updateBaseElement: ((field, value) =>
      logger.info("Base element updated:", { field, value })) satisfies UpdateBaseElementFn,
    updateQrCodeProps: ((field, value) =>
      logger.info("QR code props updated:", { field, value })) satisfies UpdateQrCodePropsFn,
    onSubmit: () => logger.info("Form submitted"),
    onCancel: () => logger.info("Form cancelled"),
    isSubmitting: true,
    submitLabel: "Creating...",
  },
};

export const UpdateMode: Story = {
  args: {
    state: {
      base: {
        name: "Certificate Verification",
        description: "QR code for certificate verification link",
        positionX: 850,
        positionY: 50,
        width: 100,
        height: 100,
        alignment: "END",
        renderOrder: 10,
        templateId: 1,
      },
      qrCodeProps: {
        foregroundColor: "#000000",
        backgroundColor: "#FFFFFF",
        errorCorrection: "H",
      },
    },
    errors: defaultErrors,
    updateBaseElement: ((field, value) =>
      logger.info("Base element updated:", { field, value })) satisfies UpdateBaseElementFn,
    updateQrCodeProps: ((field, value) =>
      logger.info("QR code props updated:", { field, value })) satisfies UpdateQrCodePropsFn,
    onSubmit: () => logger.info("Form submitted"),
    onCancel: () => logger.info("Form cancelled"),
    isSubmitting: false,
    submitLabel: "Update QR Code Element",
  },
};
