import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/logger";
import { FontReferenceSelector } from "./FontReferenceSelector";
import { mockSelfHostedFonts } from "../story.util";
import { AppLanguage } from "@/client/graphql/generated/gql/graphql";

const meta: Meta<typeof FontReferenceSelector> = {
  title: "Template/Editor/Form/Element/TextProps/FontReferenceSelector",
  component: FontReferenceSelector,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FontReferenceSelector>;

export const GoogleFont: Story = {
  args: {
    fontRef: { google: { identifier: "Roboto" } },
    language: AppLanguage.En,
    selfHostedFonts: mockSelfHostedFonts,
    onFontRefChange: fontRef => logger.log("Font changed:", fontRef),
    disabled: false,
  },
};

export const SelfHostedFont: Story = {
  args: {
    fontRef: { selfHosted: { fontId: 1 } },
    language: AppLanguage.Ar,
    selfHostedFonts: mockSelfHostedFonts,
    onFontRefChange: fontRef => logger.log("Font changed:", fontRef),
    disabled: false,
  },
};

export const WithError: Story = {
  args: {
    fontRef: { google: { identifier: "" } },
    language: AppLanguage.En,
    selfHostedFonts: mockSelfHostedFonts,
    onFontRefChange: fontRef => logger.log("Font changed:", fontRef),
    error: "Font identifier is required",
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    fontRef: { google: { identifier: "Roboto" } },
    language: AppLanguage.En,
    selfHostedFonts: mockSelfHostedFonts,
    onFontRefChange: fontRef => logger.log("Font changed:", fontRef),
    disabled: true,
  },
};
