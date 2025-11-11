import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TextPropsForm } from "./TextPropsForm";
import type { TextPropsFormErrors } from "./types";
import { ElementOverflow, FontFamilyName, type TextPropsInput } from "@/client/graphql/generated/gql/graphql";
import { logger } from "@/client/lib/console";
import { mockFontFamilies } from "../story.util";

const meta: Meta<typeof TextPropsForm> = {
  title: "Template/Editor/Form/Element/TextProps/TextPropsForm",
  component: TextPropsForm,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TextPropsForm>;

const defaultTextProps: TextPropsInput = {
  fontRef: { google: { family: FontFamilyName.Roboto, variant: "400" } },
  fontSize: 16,
  color: "#000000",
  overflow: ElementOverflow.Truncate,
};

const defaultErrors: TextPropsFormErrors = {};

export const Default: Story = {
  args: {
    textProps: defaultTextProps,
    language: "en",
    fontFamilies: mockFontFamilies,
    onTextPropsChange: ({ key, value }) => logger.info("Text prop changed:", key, value),
    errors: defaultErrors,
    disabled: false,
  },
};

export const ArabicLocale: Story = {
  args: {
    textProps: {
      fontRef: { selfHosted: { fontVariantId: 1 } },
      fontSize: 18,
      color: "#333333",
      overflow: ElementOverflow.ResizeDown,
    },
    language: "ar",
    fontFamilies: mockFontFamilies,
    onTextPropsChange: ({ key, value }) => logger.info("Text prop changed:", key, value),
    errors: defaultErrors,
    disabled: false,
  },
};

export const WithErrors: Story = {
  args: {
    textProps: { ...defaultTextProps, fontSize: 0, color: "invalid" },
    language: "en",
    fontFamilies: mockFontFamilies,
    onTextPropsChange: ({ key, value }) => logger.info("Text prop changed:", key, value),
    errors: {
      fontSize: "Font size must be positive",
      color: "Invalid color format",
    },
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    textProps: defaultTextProps,
    language: "en",
    fontFamilies: mockFontFamilies,
    onTextPropsChange: ({ key, value }) => logger.info("Text prop changed:", key, value),
    errors: defaultErrors,
    disabled: true,
  },
};
