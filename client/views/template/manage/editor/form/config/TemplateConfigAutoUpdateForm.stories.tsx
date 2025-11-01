import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TemplateConfigAutoUpdateForm } from "./TemplateConfigAutoUpdateForm";
import {
  mockTemplateConfig,
  mockTemplateConfigArabic,
  withMockMutation,
  withMockNotifications,
} from "./templateConfigStoryMocks";
import * as GQL from "@/client/graphql/generated/gql/graphql";

const meta: Meta<typeof TemplateConfigAutoUpdateForm> = {
  title: "Template/Editor/Form/Config/TemplateConfigAutoUpdateForm",
  component: TemplateConfigAutoUpdateForm,
  tags: ["autodocs"],
  decorators: [withMockNotifications],
};

export default meta;
type Story = StoryObj<typeof TemplateConfigAutoUpdateForm>;

// ============================================================================
// BASIC STATES
// ============================================================================

export const Default: Story = {
  args: {
    config: mockTemplateConfig,
  },
  decorators: [
    withMockMutation({
      updateState: { delay: 1000 },
    }),
  ],
};

export const ArabicLocale: Story = {
  args: {
    config: mockTemplateConfigArabic,
  },
  decorators: [
    withMockMutation({
      updateState: { delay: 1000 },
    }),
  ],
};

export const PortraitDimensions: Story = {
  args: {
    config: {
      ...mockTemplateConfig,
      width: 800,
      height: 1200,
    },
  },
  decorators: [
    withMockMutation({
      updateState: { delay: 1000 },
    }),
  ],
};

export const SquareDimensions: Story = {
  args: {
    config: {
      ...mockTemplateConfig,
      width: 1000,
      height: 1000,
    },
  },
  decorators: [
    withMockMutation({
      updateState: { delay: 1000 },
    }),
  ],
};

// ============================================================================
// LOADING STATE
// ============================================================================

export const Updating: Story = {
  args: {
    config: mockTemplateConfig,
  },
  decorators: [
    withMockMutation({
      updateState: { delay: 10000 }, // Long delay to simulate loading
    }),
  ],
  play: async ({ canvasElement }) => {
    // Trigger an update by simulating user interaction
    const input = canvasElement.querySelector(
      'input[type="number"]'
    ) as HTMLInputElement;
    if (input) {
      input.value = "1920";
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
  },
};

// ============================================================================
// ERROR STATES
// ============================================================================

export const UpdateError: Story = {
  args: {
    config: mockTemplateConfig,
  },
  decorators: [
    withMockMutation({
      updateState: {
        error: new Error("Failed to update template configuration."),
        delay: 500,
      },
    }),
  ],
  play: async ({ canvasElement }) => {
    // Trigger an update to show error
    const input = canvasElement.querySelector(
      'input[type="number"]'
    ) as HTMLInputElement;
    if (input) {
      input.value = "2000";
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
  },
};

export const ValidationErrorWidth: Story = {
  args: {
    config: mockTemplateConfig,
  },
  decorators: [
    withMockMutation({
      updateState: { delay: 1000 },
    }),
  ],
  play: async ({ canvasElement }) => {
    // Trigger validation error by entering invalid value
    const widthInput = canvasElement.querySelectorAll(
      'input[type="number"]'
    )[0] as HTMLInputElement;
    if (widthInput) {
      widthInput.value = "0";
      widthInput.dispatchEvent(new Event("change", { bubbles: true }));
    }
  },
};

export const ValidationErrorHeight: Story = {
  args: {
    config: mockTemplateConfig,
  },
  decorators: [
    withMockMutation({
      updateState: { delay: 1000 },
    }),
  ],
  play: async ({ canvasElement }) => {
    // Trigger validation error by entering invalid value
    const heightInput = canvasElement.querySelectorAll(
      'input[type="number"]'
    )[1] as HTMLInputElement;
    if (heightInput) {
      heightInput.value = "15000";
      heightInput.dispatchEvent(new Event("change", { bubbles: true }));
    }
  },
};

// ============================================================================
// Language VARIATIONS
// ============================================================================

export const ArabicLanguage: Story = {
  args: {
    config: {
      ...mockTemplateConfig,
      language: GQL.AppLanguage.Ar,
    },
  },
  decorators: [
    withMockMutation({
      updateState: { delay: 1000 },
    }),
  ],
};

export const EnglishLanguage: Story = {
  args: {
    config: {
      ...mockTemplateConfig,
      language: GQL.AppLanguage.En,
    },
  },
  decorators: [
    withMockMutation({
      updateState: { delay: 1000 },
    }),
  ],
};

// ============================================================================
// EDGE CASES
// ============================================================================

export const MinimumDimensions: Story = {
  args: {
    config: {
      ...mockTemplateConfig,
      width: 1,
      height: 1,
    },
  },
  decorators: [
    withMockMutation({
      updateState: { delay: 1000 },
    }),
  ],
};

export const MaximumDimensions: Story = {
  args: {
    config: {
      ...mockTemplateConfig,
      width: 10000,
      height: 10000,
    },
  },
  decorators: [
    withMockMutation({
      updateState: { delay: 1000 },
    }),
  ],
};
