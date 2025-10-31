import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/logger";
import { mockSelfHostedFonts } from "../story.util";
import { GenderElementForm } from "./GenderElementForm";
import type { GenderElementFormErrors, GenderElementFormState } from "./types";

const meta: Meta<typeof GenderElementForm> = {
  title: "Template/Editor/Form/Element/Gender/GenderElementForm",
  component: GenderElementForm,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof GenderElementForm>;

const mockState: GenderElementFormState = {
  base: {
    templateId: 1,
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

export const WithErrors: Story = {
  args: {
    state: {
      base: {
        templateId: 1,
        name: "",
        description: "",
        positionX: -10,
        positionY: 0,
        width: 0,
        height: 0,
        alignment: "START",
        renderOrder: 0,
      },
      textProps: {
        fontRef: { google: { identifier: "" } },
        color: "",
        fontSize: 0,
        overflow: "TRUNCATE",
      },
    },
    errors: {
      base: {
        name: "Name is required",
        positionX: "Position X must be non-negative",
        width: "Width must be greater than 0",
        height: "Height must be greater than 0",
      },
      textProps: {
        color: "Color is required",
        fontSize: "Font size must be at least 1",
        fontRef: "Font is required",
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
