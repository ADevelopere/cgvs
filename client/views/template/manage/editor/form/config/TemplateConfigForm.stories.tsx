
import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/logger";
import { TemplateConfigForm } from "./TemplateConfigForm";
import {
  CountryCode,
  TemplateConfigCreateInput,
} from "@/client/graphql/generated/gql/graphql";

const meta: Meta<typeof TemplateConfigForm> = {
  title: "Template/Editor/Form/Config/TemplateConfigForm",
  component: TemplateConfigForm,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TemplateConfigForm>;

const defaultState: TemplateConfigCreateInput = {
  width: 1920,
  height: 1080,
  locale: CountryCode.Us,
  templateId: 1,
};

export const Default: Story = {
  args: {
    state: defaultState,
    updateFn: (key, value) =>
      logger.info("Template config updated:", {
        key,
        value,
      }),
  },
};

export const ArabicLocale: Story = {
    args: {
      state: {
        ...defaultState,
        locale: CountryCode.Sa,
      },
      updateFn: (key, value) =>
        logger.info("Template config updated:", {
          key,
          value,
        }),
    },
  };
