import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/logger";
import { ImagePropsForm } from "./ImagePropsForm";
import { ElementImageFit } from "@/client/graphql/generated/gql/graphql";

const meta: Meta<typeof ImagePropsForm> = {
  title: "Template/Editor/Form/Element/Image/ImagePropsForm",
  component: ImagePropsForm,
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Disable form inputs",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ImagePropsForm>;

// Default - Contain
export const FitContain: Story = {
  args: {
    imageProps: {
      fit: ElementImageFit.Contain,
    },
    errors: {},
    updateImageProps: ({ key, value }) => {
      logger.info(`Image prop updated: ${key} =`, value);
    },
    disabled: false,
  },
};

// Fit Cover
export const FitCover: Story = {
  args: {
    imageProps: {
      fit: ElementImageFit.Cover,
    },
    errors: {},
    updateImageProps: ({ key, value }) => {
      logger.info(`Image prop updated: ${key} =`, value);
    },
    disabled: false,
  },
};

// Fit Fill
export const FitFill: Story = {
  args: {
    imageProps: {
      fit: ElementImageFit.Fill,
    },
    errors: {},
    updateImageProps: ({ key, value }) => {
      logger.info(`Image prop updated: ${key} =`, value);
    },
    disabled: false,
  },
};

// With validation error
export const WithError: Story = {
  args: {
    imageProps: {
      fit: ElementImageFit.Contain,
    },
    errors: {
      fit: "Image fit is required",
    },
    updateImageProps: ({ key, value }) => {
      logger.info(`Image prop updated: ${key} =`, value);
    },
    disabled: false,
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    imageProps: {
      fit: ElementImageFit.Contain,
    },
    errors: {},
    updateImageProps: ({ key, value }) => {
      logger.info(`Image prop updated: ${key} =`, value);
    },
    disabled: true,
  },
};
