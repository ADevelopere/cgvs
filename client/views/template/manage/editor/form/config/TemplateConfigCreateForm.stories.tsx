import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TemplateConfigCreateFormContent } from "./TemplateConfigCreateForm";
import { mockTemplate } from "./templateConfigStoryMocks";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { TemplateConfigFormUpdateFn } from "./types";
import logger from "@/client/lib/logger";

const meta: Meta<typeof TemplateConfigCreateFormContent> = {
  title: "Template/Editor/Form/Config/TemplateConfigCreateForm",
  component: TemplateConfigCreateFormContent,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TemplateConfigCreateFormContent>;

const mockUpdater: TemplateConfigFormUpdateFn = action => {
  logger.log("Update triggered:", action);
};

const mockHandleCreate = async () => {
  logger.log("Create triggered");
};

// ============================================================================
// BASIC STATES
// ============================================================================

export const Default: Story = {
  args: {
    state: {
      width: 800,
      height: 600,
      language: GQL.AppLanguage.Ar,
      templateId: mockTemplate.id,
    },
    errors: {},
    creating: false,
    createError: null,
    updater: mockUpdater,
    handleCreate: mockHandleCreate,
  },
};

export const WithDifferentTemplate: Story = {
  args: {
    state: {
      width: 800,
      height: 600,
      language: GQL.AppLanguage.Ar,
      templateId: 2,
    },
    errors: {},
    creating: false,
    createError: null,
    updater: mockUpdater,
    handleCreate: mockHandleCreate,
  },
};

// ============================================================================
// LOADING STATE
// ============================================================================

export const Creating: Story = {
  args: {
    state: {
      width: 800,
      height: 600,
      language: GQL.AppLanguage.Ar,
      templateId: mockTemplate.id,
    },
    errors: {},
    creating: true,
    createError: null,
    updater: mockUpdater,
    handleCreate: mockHandleCreate,
  },
};

// ============================================================================
// ERROR STATES
// ============================================================================

export const CreateError: Story = {
  args: {
    state: {
      width: 800,
      height: 600,
      language: GQL.AppLanguage.Ar,
      templateId: mockTemplate.id,
    },
    errors: {},
    creating: false,
    createError: "Failed to create template configuration.",
    updater: mockUpdater,
    handleCreate: mockHandleCreate,
  },
};

export const ValidationErrorWidth: Story = {
  args: {
    state: {
      width: 0,
      height: 600,
      language: GQL.AppLanguage.Ar,
      templateId: mockTemplate.id,
    },
    errors: {
      width: "Value must be greater than 0",
    },
    creating: false,
    createError: null,
    updater: mockUpdater,
    handleCreate: mockHandleCreate,
  },
};

export const ValidationErrorHeight: Story = {
  args: {
    state: {
      width: 800,
      height: 15000,
      language: GQL.AppLanguage.Ar,
      templateId: mockTemplate.id,
    },
    errors: {
      height: "Value must be less than or equal to 10000",
    },
    creating: false,
    createError: null,
    updater: mockUpdater,
    handleCreate: mockHandleCreate,
  },
};

// ============================================================================
// LANGUAGE VARIATIONS
// ============================================================================

export const ArabicLanguage: Story = {
  args: {
    state: {
      width: 800,
      height: 600,
      language: GQL.AppLanguage.Ar,
      templateId: mockTemplate.id,
    },
    errors: {},
    creating: false,
    createError: null,
    updater: mockUpdater,
    handleCreate: mockHandleCreate,
  },
};

export const EnglishLanguage: Story = {
  args: {
    state: {
      width: 800,
      height: 600,
      language: GQL.AppLanguage.En,
      templateId: mockTemplate.id,
    },
    errors: {},
    creating: false,
    createError: null,
    updater: mockUpdater,
    handleCreate: mockHandleCreate,
  },
};

// ============================================================================
// DIMENSION PRESETS
// ============================================================================

export const CustomDimensions: Story = {
  args: {
    state: {
      width: 1280,
      height: 720,
      language: GQL.AppLanguage.Ar,
      templateId: mockTemplate.id,
    },
    errors: {},
    creating: false,
    createError: null,
    updater: mockUpdater,
    handleCreate: mockHandleCreate,
  },
};

export const PortraitDimensions: Story = {
  args: {
    state: {
      width: 800,
      height: 1200,
      language: GQL.AppLanguage.Ar,
      templateId: mockTemplate.id,
    },
    errors: {},
    creating: false,
    createError: null,
    updater: mockUpdater,
    handleCreate: mockHandleCreate,
  },
};

export const SquareDimensions: Story = {
  args: {
    state: {
      width: 1000,
      height: 1000,
      language: GQL.AppLanguage.Ar,
      templateId: mockTemplate.id,
    },
    errors: {},
    creating: false,
    createError: null,
    updater: mockUpdater,
    handleCreate: mockHandleCreate,
  },
};

// ============================================================================
// EDGE CASES
// ============================================================================

export const MinimumDimensions: Story = {
  args: {
    state: {
      width: 1,
      height: 1,
      language: GQL.AppLanguage.Ar,
      templateId: mockTemplate.id,
    },
    errors: {},
    creating: false,
    createError: null,
    updater: mockUpdater,
    handleCreate: mockHandleCreate,
  },
};

export const MaximumDimensions: Story = {
  args: {
    state: {
      width: 10000,
      height: 10000,
      language: GQL.AppLanguage.Ar,
      templateId: mockTemplate.id,
    },
    errors: {},
    creating: false,
    createError: null,
    updater: mockUpdater,
    handleCreate: mockHandleCreate,
  },
};
