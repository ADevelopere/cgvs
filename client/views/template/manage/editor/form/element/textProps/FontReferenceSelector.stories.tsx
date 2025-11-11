import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/console";
import { FontReferenceSelector } from "./FontReferenceSelector";
import { mockFontFamilies } from "../story.util";
import { AppLanguage, FontFamilyName } from "@/client/graphql/generated/gql/graphql";

const meta: Meta<typeof FontReferenceSelector> = {
  title: "Template/Editor/Form/Element/TextProps/FontReferenceSelector",
  component: FontReferenceSelector,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FontReferenceSelector>;

export const GoogleFont: Story = {
  args: {
    fontRef: { google: { family: FontFamilyName.Roboto, variant: "400" } },
    language: AppLanguage.En,
    fontFamilies: mockFontFamilies,
    onFontRefChange: fontRef => logger.log("Font changed:", fontRef),
    disabled: false,
  },
};

export const SelfHostedFont: Story = {
  args: {
    fontRef: { selfHosted: { fontVariantId: 1 } },
    language: AppLanguage.Ar,
    fontFamilies: mockFontFamilies,
    onFontRefChange: fontRef => logger.log("Font changed:", fontRef),
    disabled: false,
  },
};

export const WithError: Story = {
  args: {
    fontRef: { google: { family: FontFamilyName.Roboto, variant: "" } },
    language: AppLanguage.En,
    fontFamilies: mockFontFamilies,
    onFontRefChange: fontRef => logger.log("Font changed:", fontRef),
    error: "Font identifier is required",
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    fontRef: { google: { family: FontFamilyName.Roboto, variant: "400" } },
    language: AppLanguage.En,
    fontFamilies: mockFontFamilies,
    onFontRefChange: fontRef => logger.log("Font changed:", fontRef),
    disabled: true,
  },
};
