import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/logger";
import { ImageElementUpdateForm } from "./ImageElementUpdateForm";
import {
  ImageElement,
  ImageElementUpdateInput,
} from "@/client/graphql/generated/gql/graphql";

const meta: Meta<typeof ImageElementUpdateForm> = {
  title: "Template/Editor/Form/Element/Image/ImageElementUpdateForm",
  component: ImageElementUpdateForm,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ImageElementUpdateForm>;

const mockImageElement: ImageElement = {
  __typename: "ImageElement",
  id: 1,
  name: "Certificate Logo",
  description: "Company logo displayed on certificate",
  type: "IMAGE",
  positionX: 50,
  positionY: 50,
  width: 200,
  height: 150,
  alignment: "CENTER",
  renderOrder: 1,
  fit: "CONTAIN",
  imageDataSource: {
    __typename: "ImageDataSourceStorageFile",
    storageFileId: 123,
    type: "STORAGE_FILE",
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  template: {
    __typename: "Template",
    id: 1,
    name: "Certificate Template",
  },
};

export const Default: Story = {
  args: {
    element: mockImageElement,
    onSubmit: async (input: ImageElementUpdateInput) => {
      logger.info("Form submitted:", input);
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    onCancel: () => {
      logger.info("Form cancelled");
    },
    loading: false,
  },
};

export const FitCover: Story = {
  args: {
    element: {
      ...mockImageElement,
      fit: "COVER",
    },
    onSubmit: async (input: ImageElementUpdateInput) => {
      logger.info("Form submitted:", input);
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    onCancel: () => {
      logger.info("Form cancelled");
    },
    loading: false,
  },
};

export const FitFill: Story = {
  args: {
    element: {
      ...mockImageElement,
      fit: "FILL",
    },
    onSubmit: async (input: ImageElementUpdateInput) => {
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
    element: mockImageElement,
    onSubmit: async (input: ImageElementUpdateInput) => {
      logger.info("Form submitted:", input);
    },
    onCancel: () => {
      logger.info("Form cancelled");
    },
    loading: true,
  },
};

