import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TemplateConfigAutoUpdateFormContent } from "./TemplateConfigAutoUpdateForm";
import { mockTemplateConfig } from "./templateConfigStoryMocks";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { TemplateConfigFormUpdateFn } from "./types";
import logger from "@/client/lib/logger";

const meta: Meta<typeof TemplateConfigAutoUpdateFormContent> = {
  title: "Template/Editor/Form/Config/TemplateConfigAutoUpdateForm",
  component: TemplateConfigAutoUpdateFormContent,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TemplateConfigAutoUpdateFormContent>;

const mockUpdater: TemplateConfigFormUpdateFn = action => {
  logger.log("Update triggered:", action);
};

// ============================================================================
// BASIC STATES
// ============================================================================

export const Default: Story = {
  args: {
    updating: false,
    state: {
      id: mockTemplateConfig.id,
      width: mockTemplateConfig.width,
      height: mockTemplateConfig.height,
      language: mockTemplateConfig.language,
    },
    errors: {},
    updater: mockUpdater,
  },
};

export const ArabicLocale: Story = {
  args: {
    updating: false,
    state: {
      id: mockTemplateConfig.id,
      width: mockTemplateConfig.width,
      height: mockTemplateConfig.height,
      language: GQL.AppLanguage.Ar,
    },
    errors: {},
    updater: mockUpdater,
  },
};

export const PortraitDimensions: Story = {
  args: {
    updating: false,
    state: {
      id: mockTemplateConfig.id,
      width: 800,
      height: 1200,
      language: mockTemplateConfig.language,
    },
    errors: {},
    updater: mockUpdater,
  },
};

export const SquareDimensions: Story = {
  args: {
    updating: false,
    state: {
      id: mockTemplateConfig.id,
      width: 1000,
      height: 1000,
      language: mockTemplateConfig.language,
    },
    errors: {},
    updater: mockUpdater,
  },
};

// ============================================================================
// LOADING STATE
// ============================================================================

export const Updating: Story = {
  args: {
    updating: true,
    state: {
      id: mockTemplateConfig.id,
      width: mockTemplateConfig.width,
      height: mockTemplateConfig.height,
      language: mockTemplateConfig.language,
    },
    errors: {},
    updater: mockUpdater,
  },
};

// ============================================================================
// ERROR STATES
// ============================================================================

export const UpdateError: Story = {
  args: {
    updating: false,
    state: {
      id: mockTemplateConfig.id,
      width: mockTemplateConfig.width,
      height: mockTemplateConfig.height,
      language: mockTemplateConfig.language,
    },
    errors: {},
    updater: mockUpdater,
  },
};

export const ValidationErrorWidth: Story = {
  args: {
    updating: false,
    state: {
      id: mockTemplateConfig.id,
      width: 0,
      height: mockTemplateConfig.height,
      language: mockTemplateConfig.language,
    },
    errors: {
      width: "Value must be greater than 0",
    },
    updater: mockUpdater,
  },
};

export const ValidationErrorHeight: Story = {
  args: {
    updating: false,
    state: {
      id: mockTemplateConfig.id,
      width: mockTemplateConfig.width,
      height: 15000,
      language: mockTemplateConfig.language,
    },
    errors: {
      height: "Value must be less than or equal to 10000",
    },
    updater: mockUpdater,
  },
};

// ============================================================================
// Language VARIATIONS
// ============================================================================

export const ArabicLanguage: Story = {
  args: {
    updating: false,
    state: {
      id: mockTemplateConfig.id,
      width: mockTemplateConfig.width,
      height: mockTemplateConfig.height,
      language: GQL.AppLanguage.Ar,
    },
    errors: {},
    updater: mockUpdater,
  },
};

export const EnglishLanguage: Story = {
  args: {
    updating: false,
    state: {
      id: mockTemplateConfig.id,
      width: mockTemplateConfig.width,
      height: mockTemplateConfig.height,
      language: GQL.AppLanguage.En,
    },
    errors: {},
    updater: mockUpdater,
  },
};

// ============================================================================
// EDGE CASES
// ============================================================================

export const MinimumDimensions: Story = {
  args: {
    updating: false,
    state: {
      id: mockTemplateConfig.id,
      width: 1,
      height: 1,
      language: mockTemplateConfig.language,
    },
    errors: {},
    updater: mockUpdater,
  },
};

export const MaximumDimensions: Story = {
  args: {
    updating: false,
    state: {
      id: mockTemplateConfig.id,
      width: 10000,
      height: 10000,
      language: mockTemplateConfig.language,
    },
    errors: {},
    updater: mockUpdater,
  },
};
