import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/logger";
import { mockSelfHostedFonts } from "../story.util";
import { GenderElementUpdateForm } from "./GenderElementUpdateForm";
import type {
  GenderElementFormUpdateState,
  GenderElementFormErrors,
} from "./types";

const meta: Meta<typeof GenderElementUpdateForm> = {
  title: "Template/Editor/Form/Element/Gender/GenderElementUpdateForm",
  component: GenderElementUpdateForm,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof GenderElementUpdateForm>;

const mockState: GenderElementFormUpdateState = {
  id: 1,
  base: {
    name: "Student Gender",
    description: "Displays student's gender",
    positionX: 100,
    positionY: 100,
    width: 200,
    height: 50,
    alignment: "START",
    renderOrder: 0,
  },
  textProps: {
    fontRef: { google: { identifier: "Roboto" } },
    color: "#000000",
    fontSize: 14,
    overflow: "TRUNCATE",
  },
};

const mockErrors: GenderElementFormErrors = {
  base: {},
  textProps: {},
};

export const Default: Story = {
  args: {
    state: mockState,
    errors: mockErrors,
    selfHostedFonts: mockSelfHostedFonts,
    locale: "en",
    updateBase: (key, value) => logger.info("updateBase", { key, value }),
    updateTextProps: (key, value) =>
      logger.info("updateTextProps", { key, value }),
    onSubmit: () => logger.info("Submit"),
    onCancel: () => logger.info("Cancel"),
    isSubmitting: false,
  },
};

export const WithPartialUpdate: Story = {
  args: {
    state: {
      id: 1,
      base: {
        name: "Updated Gender",
        width: 250,
      },
      textProps: {
        color: "#FF5722",
        fontSize: 16,
      },
    },
    errors: mockErrors,
    selfHostedFonts: mockSelfHostedFonts,
    locale: "en",
    updateBase: (key, value) => logger.info("updateBase", { key, value }),
    updateTextProps: (key, value) =>
      logger.info("updateTextProps", { key, value }),
    onSubmit: () => logger.info("Submit"),
    onCancel: () => logger.info("Cancel"),
    isSubmitting: false,
  },
};

export const WithErrors: Story = {
  args: {
    state: {
      id: 1,
      base: {
        name: "",
        width: 0,
        height: 0,
      },
      textProps: {
        fontSize: 0,
      },
    },
    errors: {
      base: {
        name: "Name is required",
        width: "Width must be greater than 0",
        height: "Height must be greater than 0",
      },
      textProps: {
        fontSize: "Font size must be at least 1",
      },
    },
    selfHostedFonts: mockSelfHostedFonts,
    locale: "en",
    updateBase: (key, value) => logger.info("updateBase", { key, value }),
    updateTextProps: (key, value) =>
      logger.info("updateTextProps", { key, value }),
    onSubmit: () => logger.info("Submit"),
    onCancel: () => logger.info("Cancel"),
    isSubmitting: false,
  },
};

export const Submitting: Story = {
  args: {
    state: mockState,
    errors: mockErrors,
    selfHostedFonts: mockSelfHostedFonts,
    locale: "en",
    updateBase: (key, value) => logger.info("updateBase", { key, value }),
    updateTextProps: (key, value) =>
      logger.info("updateTextProps", { key, value }),
    onSubmit: () => logger.info("Submit"),
    onCancel: () => logger.info("Cancel"),
    isSubmitting: true,
  },
};

export const Disabled: Story = {
  args: {
    state: mockState,
    errors: mockErrors,
    selfHostedFonts: mockSelfHostedFonts,
    locale: "en",
    updateBase: (key, value) => logger.info("updateBase", { key, value }),
    updateTextProps: (key, value) =>
      logger.info("updateTextProps", { key, value }),
    onSubmit: () => logger.info("Submit"),
    onCancel: () => logger.info("Cancel"),
    isSubmitting: false,
    disabled: true,
  },
};

