import React from "react";
import { Decorator } from "@storybook/nextjs-vite";
import * as GQL from "@/client/graphql/generated/gql/graphql";

// ============================================================================
// MOCK DATA
// ============================================================================

export const mockTemplate: GQL.Template = {
  __typename: "Template",
  id: 1,
  name: "Certificate of Achievement",
  description: "A professional certificate template",
  imageUrl: null,
  imageFile: null,
  order: 1,
  category: null,
  preSuspensionCategory: null,
  recipientGroups: null,
  variables: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockTemplateConfig: GQL.TemplateConfig = {
  __typename: "TemplateConfig",
  id: 1,
  width: 1920,
  height: 1080,
  locale: GQL.CountryCode.Us,
  templateId: 1,
  template: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockTemplateConfigArabic: GQL.TemplateConfig = {
  ...mockTemplateConfig,
  id: 2,
  locale: GQL.CountryCode.Sa,
};

// ============================================================================
// MOCK HOOKS
// ============================================================================

type MockMutationState = {
  loading?: boolean;
  error?: Error | null;
  delay?: number;
};

type MockMutationOptions = {
  createState?: MockMutationState;
  updateState?: MockMutationState;
};

export const createMockTemplateConfigMutation = (
  options: MockMutationOptions = {}
) => {
  const { createState = {}, updateState = {} } = options;

  const createMutation = async (params: {
    variables: { input: GQL.TemplateConfigCreateInput };
  }) => {
    if (createState.delay) {
      await new Promise(resolve => setTimeout(resolve, createState.delay));
    }
    if (createState.error) {
      throw createState.error;
    }
    return {
      data: {
        createTemplateConfig: {
          ...mockTemplateConfig,
          ...params.variables.input,
        },
      },
    };
  };

  const updateMutation = async (params: {
    variables: { input: GQL.TemplateConfigUpdateInput };
  }) => {
    if (updateState.delay) {
      await new Promise(resolve => setTimeout(resolve, updateState.delay));
    }
    if (updateState.error) {
      throw updateState.error;
    }
    return {
      data: {
        updateTemplateConfig: {
          ...mockTemplateConfig,
          ...params.variables.input,
        },
      },
    };
  };

  return {
    createTemplateConfigMutation: createMutation,
    updateTemplateConfigMutation: updateMutation,
  };
};

// ============================================================================
// DECORATORS
// ============================================================================

export const withMockMutation = (
  _options: MockMutationOptions = {}
): Decorator => {
  const MockWrapper = (Story: React.ComponentType, context: unknown) => {
    // Mock mutation is created per render
    // In a real implementation, you'd use module mocking or a context provider
    // For stories, this serves as a placeholder that documents the intent
    return <Story {...(context as object)} />;
  };

  MockWrapper.displayName = "MockMutationWrapper";
  return MockWrapper;
};

export const withMockNotifications: Decorator = Story => {
  // Mock useNotifications hook from @toolpad/core
  // This is handled by the component's error handling
  return <Story />;
};
