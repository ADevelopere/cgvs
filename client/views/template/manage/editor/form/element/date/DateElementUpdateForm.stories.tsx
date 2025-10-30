import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/logger";
import { DateElementUpdateForm } from "./DateElementUpdateForm";
import { mockSelfHostedFonts } from "../story.util";
import type { DateElementFormUpdateState, DateElementFormErrors } from "./types";
import { TemplateDateVariable } from "@/client/graphql/generated/gql/graphql";

const mockDateVariables: TemplateDateVariable[] = [
  {
    __typename: "TemplateDateVariable",
    id: 1,
    name: "Course Start Date",
    description: "The date when the course started",
    required: true,
    format: "YYYY-MM-DD",
    minDate: new Date("2020-01-01"),
    maxDate: new Date("2030-12-31"),
    previewValue: "2024-01-15",
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const meta: Meta<typeof DateElementUpdateForm> = {
  title: "Template/Editor/Form/Element/Date/DateElementUpdateForm",
  component: DateElementUpdateForm,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DateElementUpdateForm>;

const defaultState: DateElementFormUpdateState = {
  base: {
    id: 1,
    name: "Date Element",
    description: "A date element",
    positionX: 100,
    positionY: 100,
    width: 200,
    height: 50,
    alignment: "CENTER",
    renderOrder: 1,
  },
  textProps: {
    fontRef: { google: { identifier: "Roboto" } },
    fontSize: 16,
    color: "#000000",
    overflow: "WRAP",
  },
  dateProps: {
    format: "YYYY-MM-DD",
    calendarType: "GREGORIAN",
    offsetDays: 0,
  },
  dataSource: {
    static: { value: "2024-01-15" },
  },
};

const defaultErrors: DateElementFormErrors = {
  base: {},
  textProps: {},
  dateProps: {},
  dataSource: {},
};

export const Default: Story = {
  args: {
    state: defaultState,
    errors: defaultErrors,
    updateBaseElement: (field, value) => logger.info("Base element updated:", { field, value }),
    updateTextProps: (field, value) => logger.info("Text props updated:", { field, value }),
    updateDateProps: (field, value) => logger.info("Date props updated:", { field, value }),
    updateDataSource: (dataSource) => logger.info("Data source updated:", { dataSource }),
    templateId: 1,
    locale: "en",
    dateVariables: mockDateVariables,
    selfHostedFonts: mockSelfHostedFonts,
    onSubmit: () => logger.info("Form submitted"),
    onCancel: () => logger.info("Form cancelled"),
    isSubmitting: false,
  },
};

export const WithStudentField: Story = {
  args: {
    state: {
      ...defaultState,
      dataSource: {
        studentField: { field: "DATE_OF_BIRTH" },
      },
    },
    errors: defaultErrors,
    updateBaseElement: (field, value) => logger.info("Base element updated:", { field, value }),
    updateTextProps: (field, value) => logger.info("Text props updated:", { field, value }),
    updateDateProps: (field, value) => logger.info("Date props updated:", { field, value }),
    updateDataSource: (dataSource) => logger.info("Data source updated:", { dataSource }),
    templateId: 1,
    locale: "en",
    dateVariables: mockDateVariables,
    selfHostedFonts: mockSelfHostedFonts,
    onSubmit: () => logger.info("Form submitted"),
    onCancel: () => logger.info("Form cancelled"),
    isSubmitting: false,
  },
};

export const Submitting: Story = {
  args: {
    state: defaultState,
    errors: defaultErrors,
    updateBaseElement: (field, value) => logger.info("Base element updated:", { field, value }),
    updateTextProps: (field, value) => logger.info("Text props updated:", { field, value }),
    updateDateProps: (field, value) => logger.info("Date props updated:", { field, value }),
    updateDataSource: (dataSource) => logger.info("Data source updated:", { dataSource }),
    templateId: 1,
    locale: "en",
    dateVariables: mockDateVariables,
    selfHostedFonts: mockSelfHostedFonts,
    onSubmit: () => logger.info("Form submitted"),
    onCancel: () => logger.info("Form cancelled"),
    isSubmitting: true,
  },
};

