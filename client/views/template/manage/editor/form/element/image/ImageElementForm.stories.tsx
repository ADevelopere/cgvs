import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/logger";
import { ImageElementForm } from "./ImageElementForm";
import type { ImageElementFormErrors, ImageElementFormState, UpdateImageDataSourceFn, UpdateImagePropsFn } from "./types";
import { UpdateBaseElementFn } from "../base";
import { ElementAlignment, ElementImageFit } from "@/client/graphql/generated/gql/graphql";

const meta: Meta<typeof ImageElementForm> = {
  title: "Template/Editor/Form/Element/Image/ImageElementForm",
  component: ImageElementForm,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ImageElementForm>;

const defaultState: ImageElementFormState = {
  base: {
    name: "Image Element",
    description: "An image element",
    positionX: 100,
    positionY: 100,
    width: 200,
    height: 120,
    alignment: ElementAlignment.Baseline,
    renderOrder: 1,
    templateId: 1,
  },
  imageProps: {
    fit: ElementImageFit.Contain,
  },
  dataSource: {
    storageFile: { storageFileId: 1 },
  },
};

const defaultErrors: ImageElementFormErrors = {
  base: {},
  imageProps: {},
  dataSource: {},
};

export const Default: Story = {
  args: {
    state: defaultState,
    errors: defaultErrors,
    updateBaseElement: (({key, value}) => logger.info("Base element updated:", { key, value })) satisfies UpdateBaseElementFn,
    updateImageProps: (({key, value}) => logger.info("Image props updated:", { key, value })) satisfies UpdateImagePropsFn,
    updateDataSource: ((dataSource) => logger.info("Data source updated:", { dataSource })) satisfies UpdateImageDataSourceFn,
    onSubmit: () => logger.info("Form submitted"),
    onCancel: () => logger.info("Form cancelled"),
    isSubmitting: false,
    submitLabel: "Submit",
  },
};

export const Loading: Story = {
  args: {
    state: defaultState,
    errors: defaultErrors,
    updateBaseElement: (({key, value}) => logger.info("Base element updated:", { key, value })) satisfies UpdateBaseElementFn,
    updateImageProps: (({key, value}) => logger.info("Image props updated:", { key, value })) satisfies UpdateImagePropsFn,
    updateDataSource: ((dataSource) => logger.info("Data source updated:", { dataSource })) satisfies UpdateImageDataSourceFn,
    onSubmit: () => logger.info("Form submitted"),
    onCancel: () => logger.info("Form cancelled"),
    isSubmitting: true,
    submitLabel: "Submit",
  },
};

