import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TemplateConfigCreateForm } from "./TemplateConfigCreateForm";
import { mockTemplate, withMockMutation } from "./templateConfigStoryMocks";
import * as GQL from "@/client/graphql/generated/gql/graphql";

const meta: Meta<typeof TemplateConfigCreateForm> = {
  title: "Template/Editor/Form/Config/TemplateConfigCreateForm",
  component: TemplateConfigCreateForm,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TemplateConfigCreateForm>;

// ============================================================================
// BASIC STATES
// ============================================================================

export const Default: Story = {
  args: {
    template: mockTemplate,
  },
  decorators: [
    withMockMutation({
      createState: { delay: 1000 },
    }),
  ],
};

export const WithDifferentTemplate: Story = {
  args: {
    template: {
      ...mockTemplate,
      id: 2,
      name: "Certificate of Completion",
      description: "Another template type",
    },
  },
  decorators: [
    withMockMutation({
      createState: { delay: 1000 },
    }),
  ],
};

// ============================================================================
// LOADING STATE
// ============================================================================

export const Creating: Story = {
  args: {
    template: mockTemplate,
  },
  decorators: [
    withMockMutation({
      createState: { delay: 10000 }, // Long delay to simulate loading
    }),
  ],
  play: async ({ canvasElement }) => {
    // Click the create button to trigger loading state
    const createButton = canvasElement.querySelector(
      "button"
    ) as HTMLButtonElement;
    if (createButton && !createButton.disabled) {
      createButton.click();
    }
  },
};

// ============================================================================
// ERROR STATES
// ============================================================================

export const CreateError: Story = {
  args: {
    template: mockTemplate,
  },
  decorators: [
    withMockMutation({
      createState: {
        error: new Error("Failed to create template configuration."),
        delay: 500,
      },
    }),
  ],
  play: async ({ canvasElement }) => {
    // Click create button to trigger error
    const createButton = canvasElement.querySelector(
      "button"
    ) as HTMLButtonElement;
    if (createButton) {
      createButton.click();
    }
  },
};

export const ValidationErrorWidth: Story = {
  args: {
    template: mockTemplate,
  },
  decorators: [
    withMockMutation({
      createState: { delay: 1000 },
    }),
  ],
  play: async ({ canvasElement }) => {
    // Set invalid width value
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
    template: mockTemplate,
  },
  decorators: [
    withMockMutation({
      createState: { delay: 1000 },
    }),
  ],
  play: async ({ canvasElement }) => {
    // Set invalid height value
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
// LOCALE VARIATIONS
// ============================================================================

export const USLocale: Story = {
  args: {
    template: mockTemplate,
  },
  decorators: [
    withMockMutation({
      createState: { delay: 1000 },
    }),
  ],
};

export const SaudiLocale: Story = {
  args: {
    template: mockTemplate,
  },
  decorators: [
    withMockMutation({
      createState: { delay: 1000 },
    }),
  ],
  play: async ({ canvasElement }) => {
    // Change locale to Saudi Arabia
    const localeSelect = canvasElement.querySelector(
      '[role="combobox"]'
    ) as HTMLElement;
    if (localeSelect) {
      localeSelect.click();
      // Wait for dropdown to open then select Saudi option
      setTimeout(() => {
        const saudiOption = document.querySelector(
          `[data-value="${GQL.CountryCode.Sa}"]`
        ) as HTMLElement;
        if (saudiOption) {
          saudiOption.click();
        }
      }, 100);
    }
  },
};

export const EgyptianLocale: Story = {
  args: {
    template: mockTemplate,
  },
  decorators: [
    withMockMutation({
      createState: { delay: 1000 },
    }),
  ],
  play: async ({ canvasElement }) => {
    // Change locale to Egypt
    const localeSelect = canvasElement.querySelector(
      '[role="combobox"]'
    ) as HTMLElement;
    if (localeSelect) {
      localeSelect.click();
      setTimeout(() => {
        const egyptOption = document.querySelector(
          `[data-value="${GQL.CountryCode.Eg}"]`
        ) as HTMLElement;
        if (egyptOption) {
          egyptOption.click();
        }
      }, 100);
    }
  },
};

// ============================================================================
// DIMENSION PRESETS
// ============================================================================

export const CustomDimensions: Story = {
  args: {
    template: mockTemplate,
  },
  decorators: [
    withMockMutation({
      createState: { delay: 1000 },
    }),
  ],
  play: async ({ canvasElement }) => {
    // Set custom dimensions
    const inputs = canvasElement.querySelectorAll('input[type="number"]');
    const widthInput = inputs[0] as HTMLInputElement;
    const heightInput = inputs[1] as HTMLInputElement;

    if (widthInput) {
      widthInput.value = "1280";
      widthInput.dispatchEvent(new Event("change", { bubbles: true }));
    }
    if (heightInput) {
      heightInput.value = "720";
      heightInput.dispatchEvent(new Event("change", { bubbles: true }));
    }
  },
};

export const PortraitDimensions: Story = {
  args: {
    template: mockTemplate,
  },
  decorators: [
    withMockMutation({
      createState: { delay: 1000 },
    }),
  ],
  play: async ({ canvasElement }) => {
    // Set portrait dimensions
    const inputs = canvasElement.querySelectorAll('input[type="number"]');
    const widthInput = inputs[0] as HTMLInputElement;
    const heightInput = inputs[1] as HTMLInputElement;

    if (widthInput) {
      widthInput.value = "800";
      widthInput.dispatchEvent(new Event("change", { bubbles: true }));
    }
    if (heightInput) {
      heightInput.value = "1200";
      heightInput.dispatchEvent(new Event("change", { bubbles: true }));
    }
  },
};

export const SquareDimensions: Story = {
  args: {
    template: mockTemplate,
  },
  decorators: [
    withMockMutation({
      createState: { delay: 1000 },
    }),
  ],
  play: async ({ canvasElement }) => {
    // Set square dimensions
    const inputs = canvasElement.querySelectorAll('input[type="number"]');
    const widthInput = inputs[0] as HTMLInputElement;
    const heightInput = inputs[1] as HTMLInputElement;

    if (widthInput) {
      widthInput.value = "1000";
      widthInput.dispatchEvent(new Event("change", { bubbles: true }));
    }
    if (heightInput) {
      heightInput.value = "1000";
      heightInput.dispatchEvent(new Event("change", { bubbles: true }));
    }
  },
};

// ============================================================================
// EDGE CASES
// ============================================================================

export const MinimumDimensions: Story = {
  args: {
    template: mockTemplate,
  },
  decorators: [
    withMockMutation({
      createState: { delay: 1000 },
    }),
  ],
  play: async ({ canvasElement }) => {
    // Set minimum dimensions
    const inputs = canvasElement.querySelectorAll('input[type="number"]');
    const widthInput = inputs[0] as HTMLInputElement;
    const heightInput = inputs[1] as HTMLInputElement;

    if (widthInput) {
      widthInput.value = "1";
      widthInput.dispatchEvent(new Event("change", { bubbles: true }));
    }
    if (heightInput) {
      heightInput.value = "1";
      heightInput.dispatchEvent(new Event("change", { bubbles: true }));
    }
  },
};

export const MaximumDimensions: Story = {
  args: {
    template: mockTemplate,
  },
  decorators: [
    withMockMutation({
      createState: { delay: 1000 },
    }),
  ],
  play: async ({ canvasElement }) => {
    // Set maximum dimensions
    const inputs = canvasElement.querySelectorAll('input[type="number"]');
    const widthInput = inputs[0] as HTMLInputElement;
    const heightInput = inputs[1] as HTMLInputElement;

    if (widthInput) {
      widthInput.value = "10000";
      widthInput.dispatchEvent(new Event("change", { bubbles: true }));
    }
    if (heightInput) {
      heightInput.value = "10000";
      heightInput.dispatchEvent(new Event("change", { bubbles: true }));
    }
  },
};
