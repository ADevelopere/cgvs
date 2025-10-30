import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/logger";
import { CountryElementUpdateForm } from "./CountryElementUpdateForm";
import { mockSelfHostedFonts } from "../story.util";
import type { CountryElementFormUpdateState, CountryElementFormErrors } from "./types";

const meta: Meta<typeof CountryElementUpdateForm> = {
  title: "Template/Editor/Form/Element/Country/CountryElementUpdateForm",
  component: CountryElementUpdateForm,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CountryElementUpdateForm>;

const defaultState: CountryElementFormUpdateState = {
  base: {
    id: 1,
    name: "Country Element",
    description: "Student's nationality",
    positionX: 100,
    positionY: 100,
    width: 200,
    height: 50,
    alignment: "CENTER",
    renderOrder: 1,
  },
  textProps: {
    fontRef: { google: { identifier: "Roboto" } },
    fontSize: 16,
    color: "#000000",
    overflow: "WRAP",
  },
  representation: "COUNTRY_NAME",
};

const defaultErrors: CountryElementFormErrors = {
  base: {},
  textProps: {},
  representation: undefined,
};

export const Default: Story = {
  args: {
    state: defaultState,
    errors: defaultErrors,
    updateBaseElement: (field, value) => logger.log("Base element updated:", field, value),
    updateTextProps: (field, value) => logger.log("Text props updated:", field, value),
    updateRepresentation: (value) => logger.log("Representation updated:", value),
    locale: "en",
    selfHostedFonts: mockSelfHostedFonts,
    onSubmit: () => logger.log("Form submitted"),
    onCancel: () => logger.log("Form cancelled"),
    isSubmitting: false,
  },
};

export const WithNationality: Story = {
  args: {
    state: {
      ...defaultState,
      representation: "NATIONALITY",
    },
    errors: defaultErrors,
    updateBaseElement: (field, value) => logger.log("Base element updated:", field, value),
    updateTextProps: (field, value) => logger.log("Text props updated:", field, value),
    updateRepresentation: (value) => logger.log("Representation updated:", value),
    locale: "en",
    selfHostedFonts: mockSelfHostedFonts,
    onSubmit: () => logger.log("Form submitted"),
    onCancel: () => logger.log("Form cancelled"),
    isSubmitting: false,
  },
};

export const WithErrors: Story = {
  args: {
    state: {
      base: {
        id: 1,
        name: "",
        width: 0,
        height: 0,
      },
      textProps: {
        fontRef: { google: { identifier: "" } },
        fontSize: 0,
        color: "",
        overflow: "WRAP",
      },
      representation: "COUNTRY_NAME",
    },
    errors: {
      base: {
        name: "Name is required",
        width: "Width must be positive",
        height: "Height must be positive",
      },
      textProps: {
        color: "Color is required",
        fontSize: "Font size must be positive",
      },
      representation: undefined,
    },
    updateBaseElement: (field, value) => logger.log("Base element updated:", field, value),
    updateTextProps: (field, value) => logger.log("Text props updated:", field, value),
    updateRepresentation: (value) => logger.log("Representation updated:", value),
    locale: "en",
    selfHostedFonts: mockSelfHostedFonts,
    onSubmit: () => logger.log("Form submitted"),
    onCancel: () => logger.log("Form cancelled"),
    isSubmitting: false,
  },
};

export const Submitting: Story = {
  args: {
    state: defaultState,
    errors: defaultErrors,
    updateBaseElement: (field, value) => logger.log("Base element updated:", field, value),
    updateTextProps: (field, value) => logger.log("Text props updated:", field, value),
    updateRepresentation: (value) => logger.log("Representation updated:", value),
    locale: "en",
    selfHostedFonts: mockSelfHostedFonts,
    onSubmit: () => logger.log("Form submitted"),
    onCancel: () => logger.log("Form cancelled"),
    isSubmitting: true,
  },
};

