import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/logger";
import { ImageElementCreateForm } from "./ImageElementCreateForm";
import { ImageElementCreateInput } from "@/client/graphql/generated/gql/graphql";

const meta: Meta<typeof ImageElementCreateForm> = {
  title: "Template/Editor/Form/Element/Image/ImageElementCreateForm",
  component: ImageElementCreateForm,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ImageElementCreateForm>;

export const Default: Story = {
  args: {
    templateId: 1,
    onSubmit: async (input: ImageElementCreateInput) => {
      logger.info("Form submitted:", input);
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    onCancel: () => {
      logger.info("Form cancelled");
    },
    loading: false,
  },
};

export const Loading: Story = {
  args: {
    templateId: 1,
    onSubmit: async (input: ImageElementCreateInput) => {
      logger.info("Form submitted:", input);
    },
    onCancel: () => {
      logger.info("Form cancelled");
    },
    loading: true,
  },
};

