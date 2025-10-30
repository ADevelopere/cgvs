import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/logger";
import { ImageDataSourceForm } from "./ImageDataSourceForm";
import { ImageDataSourceInput } from "@/client/graphql/generated/gql/graphql";

const meta: Meta<typeof ImageDataSourceForm> = {
  title: "Template/Editor/Form/Element/Image/ImageDataSourceForm",
  component: ImageDataSourceForm,
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Disable form inputs",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ImageDataSourceForm>;

// Default story - no file selected
export const Default: Story = {
  args: {
    dataSource: {
      storageFile: {
        storageFileId: -1,
      },
    },
    errors: {},
    updateDataSource: (dataSource: ImageDataSourceInput) => {
      logger.info("Data source updated:", dataSource);
    },
    disabled: false,
  },
};

// With file selected
export const WithFileSelected: Story = {
  args: {
    dataSource: {
      storageFile: {
        storageFileId: 123,
      },
    },
    errors: {},
    updateDataSource: (dataSource: ImageDataSourceInput) => {
      logger.info("Data source updated:", dataSource);
    },
    disabled: false,
  },
};

// With validation error
export const WithError: Story = {
  args: {
    dataSource: {
      storageFile: {
        storageFileId: -1,
      },
    },
    errors: {
      storageFile: "Please select an image file",
    },
    updateDataSource: (dataSource: ImageDataSourceInput) => {
      logger.info("Data source updated:", dataSource);
    },
    disabled: false,
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    dataSource: {
      storageFile: {
        storageFileId: 123,
      },
    },
    errors: {},
    updateDataSource: (dataSource: ImageDataSourceInput) => {
      logger.info("Data source updated:", dataSource);
    },
    disabled: true,
  },
};

