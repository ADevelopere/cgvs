import { Meta, StoryObj } from "@storybook/nextjs-vite";
import {logger} from "@/client/lib/logger";
import { FontReferenceSelector } from "./FontReferenceSelector";
import { mockSelfHostedFonts } from "./story.util";

const meta: Meta<typeof FontReferenceSelector> = {
  title: "Template/Editor/Form/Element/FontReferenceSelector",
  component: FontReferenceSelector,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FontReferenceSelector>;

export const GoogleFont: Story = {
  args: {
    fontRef: { type: "GOOGLE", identifier: "Roboto" },
    locale: "en",
    selfHostedFonts: mockSelfHostedFonts,
    onFontRefChange: (fontRef) => logger.log("Font changed:", fontRef),
    disabled: false,
  },
};

export const SelfHostedFont: Story = {
  args: {
    fontRef: { type: "SELF_HOSTED", fontId: 1 },
    locale: "ar",
    selfHostedFonts: mockSelfHostedFonts,
    onFontRefChange: (fontRef) => logger.log("Font changed:", fontRef),
    disabled: false,
  },
};

export const WithError: Story = {
  args: {
    fontRef: { type: "GOOGLE", identifier: "" },
    locale: "en",
    selfHostedFonts: mockSelfHostedFonts,
    onFontRefChange: (fontRef) => logger.log("Font changed:", fontRef),
    error: "Font identifier is required",
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    fontRef: { type: "GOOGLE", identifier: "Roboto" },
    locale: "en",
    selfHostedFonts: mockSelfHostedFonts,
    onFontRefChange: (fontRef) => logger.log("Font changed:", fontRef),
    disabled: true,
  },
};

