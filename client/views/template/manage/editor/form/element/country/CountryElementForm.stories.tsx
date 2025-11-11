import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/console";
import { CountryElementForm } from "./CountryElementForm";
import { mockFontFamilies } from "../story.util";
import type { CountryElementFormState, CountryElementFormErrors } from "./types";
import {
  CountryRepresentation,
  ElementAlignment,
  ElementOverflow,
  FontFamilyName,
} from "@/client/graphql/generated/gql/graphql";

const meta: Meta<typeof CountryElementForm> = {
  title: "Template/Editor/Form/Element/Country/CountryElementForm",
  component: CountryElementForm,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CountryElementForm>;

const defaultState: CountryElementFormState = {
  base: {
    name: "Country Element",
    description: "Student's nationality",
    positionX: 100,
    positionY: 100,
    width: 200,
    height: 50,
    alignment: ElementAlignment.Center,
    zIndex: 1,
    templateId: 1,
  },
  textProps: {
    fontRef: { google: { family: FontFamilyName.Roboto, variant: "400" } },
    fontSize: 16,
    color: "#000000",
    overflow: ElementOverflow.Wrap,
  },
  countryProps: {
    representation: CountryRepresentation.CountryName,
  },
};

const defaultErrors: CountryElementFormErrors = {
  base: {},
  textProps: {},
  countryProps: {},
};

export const Default: Story = {
  args: {
    state: defaultState,
    errors: defaultErrors,
    updateBaseElement: ({ key, value }) => logger.log("Base element updated:", key, value),
    updateTextProps: ({ key, value }) => logger.log("Text props updated:", key, value),
    updateRepresentation: value => logger.log("Representation updated:", value),
    locale: "en",
    fontFamilies: mockFontFamilies,
    onSubmit: () => logger.log("Form submitted"),
    onCancel: () => logger.log("Form cancelled"),
    isSubmitting: false,
  },
};

export const WithNationality: Story = {
  args: {
    state: {
      ...defaultState,
    },
    errors: defaultErrors,
    updateBaseElement: ({ key, value }) => logger.log("Base element updated:", key, value),
    updateTextProps: ({ key, value }) => logger.log("Text props updated:", key, value),
    updateRepresentation: value => logger.log("Representation updated:", value),
    locale: "en",
    fontFamilies: mockFontFamilies,
    onSubmit: () => logger.log("Form submitted"),
    onCancel: () => logger.log("Form cancelled"),
    isSubmitting: false,
  },
};

export const WithErrors: Story = {
  args: {
    state: {
      base: {
        name: "",
        description: "",
        positionX: 0,
        positionY: 0,
        width: 0,
        height: 0,
        alignment: ElementAlignment.TopCenter,
        zIndex: 0,
        templateId: 1,
      },
      textProps: {
        fontRef: { google: { family: FontFamilyName.Roboto, variant: "" } },
        fontSize: 0,
        color: "",
        overflow: ElementOverflow.Wrap,
      },
      countryProps: {
        representation: CountryRepresentation.CountryName,
      },
    },
    errors: {
      base: {
        name: "Name is required",
        description: "Description is required",
        width: "Width must be positive",
        height: "Height must be positive",
      },
      textProps: {
        color: "Color is required",
        fontSize: "Font size must be positive",
      },
      countryProps: {
        representation: "Representation is required",
      },
    },
    updateBaseElement: ({ key, value }) => logger.log("Base element updated:", key, value),
    updateTextProps: ({ key, value }) => logger.log("Text props updated:", key, value),
    updateRepresentation: value => logger.log("Representation updated:", value),
    locale: "en",
    fontFamilies: mockFontFamilies,
    onSubmit: () => logger.log("Form submitted"),
    onCancel: () => logger.log("Form cancelled"),
    isSubmitting: false,
    submitLabel: "Save",
  },
};

export const Submitting: Story = {
  args: {
    state: defaultState,
    errors: defaultErrors,
    updateBaseElement: ({ key, value }) => logger.log("Base element updated:", key, value),
    updateTextProps: ({ key, value }) => logger.log("Text props updated:", key, value),
    updateRepresentation: value => logger.log("Representation updated:", value),
    locale: "en",
    fontFamilies: mockFontFamilies,
    onSubmit: () => logger.log("Form submitted"),
    onCancel: () => logger.log("Form cancelled"),
    isSubmitting: true,
  },
};
