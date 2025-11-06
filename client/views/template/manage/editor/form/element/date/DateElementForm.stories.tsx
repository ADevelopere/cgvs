import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/console";
import { DateElementForm } from "./DateElementForm";
import { mockSelfHostedFonts } from "../story.util";
import type { DateElementFormErrors, DateElementFormState, UpdateDatePropsFn } from "./types";
import {
  AppLanguage,
  CalendarType,
  ElementAlignment,
  ElementOverflow,
  StudentDateField,
  TemplateDateVariable,
} from "@/client/graphql/generated/gql/graphql";
import { UpdateBaseElementFn } from "../base";
import { UpdateTextPropsFn } from "../textProps";

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

const meta: Meta<typeof DateElementForm> = {
  title: "Template/Editor/Form/Element/Date/DateElementForm",
  component: DateElementForm,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DateElementForm>;

const defaultState: DateElementFormState = {
  base: {
    name: "Date Element",
    description: "A date element",
    positionX: 100,
    positionY: 100,
    width: 200,
    height: 50,
    alignment: ElementAlignment.Center,
    zIndex: 1,
    templateId: 1,
  },
  textProps: {
    fontRef: { google: { identifier: "Roboto" } },
    fontSize: 16,
    color: "#000000",
    overflow: ElementOverflow.Wrap,
  },
  dateProps: {
    format: "YYYY-MM-DD",
    calendarType: CalendarType.Gregorian,
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
    updateBaseElement: (({ key, value }) =>
      logger.info("Base element updated:", {
        key,
        value,
      })) satisfies UpdateBaseElementFn,
    updateTextProps: (({ key, value }) =>
      logger.info("Text props updated:", {
        key,
        value,
      })) satisfies UpdateTextPropsFn,
    updateDateProps: (action =>
      logger.info("Date props updated:", {
        ...action,
      })) satisfies UpdateDatePropsFn,
    updateDataSource: dataSource =>
      logger.info("Data source updated:", {
        dataSource,
      }),
    language: AppLanguage.Ar,
    dateVariables: mockDateVariables,
    selfHostedFonts: mockSelfHostedFonts,
    onSubmit: () => logger.info("Form submitted"),
    onCancel: () => logger.info("Form cancelled"),
    isSubmitting: false,
    submitLabel: "Submit",
  },
};

export const WithStudentField: Story = {
  args: {
    state: {
      ...defaultState,
      dataSource: {
        studentField: { field: StudentDateField.DateOfBirth },
      },
    },
    errors: defaultErrors,
    updateBaseElement: (({ key, value }) =>
      logger.info("Base element updated:", {
        key,
        value,
      })) satisfies UpdateBaseElementFn,
    updateTextProps: (({ key, value }) =>
      logger.info("Text props updated:", {
        key,
        value,
      })) satisfies UpdateTextPropsFn,
    updateDateProps: (action =>
      logger.info("Date props updated:", {
        ...action,
      })) satisfies UpdateDatePropsFn,
    updateDataSource: dataSource =>
      logger.info("Data source updated:", {
        dataSource,
      }),
    language: AppLanguage.En,
    dateVariables: mockDateVariables,
    selfHostedFonts: mockSelfHostedFonts,
    onSubmit: () => logger.info("Form submitted"),
    onCancel: () => logger.info("Form cancelled"),
    isSubmitting: false,
    submitLabel: "Submit",
  },
};

export const HijriCalendar: Story = {
  args: {
    state: {
      ...defaultState,
      dateProps: {
        format: "DD/MM/YYYY",
        calendarType: CalendarType.Hijri,
        offsetDays: 0,
      },
    },
    errors: defaultErrors,
    updateBaseElement: (({ key, value }) =>
      logger.info("Base element updated:", {
        key,
        value,
      })) satisfies UpdateBaseElementFn,
    updateTextProps: (({ key, value }) =>
      logger.info("Text props updated:", {
        key,
        value,
      })) satisfies UpdateTextPropsFn,
    updateDateProps: (action =>
      logger.info("Date props updated:", {
        ...action,
      })) satisfies UpdateDatePropsFn,
    updateDataSource: dataSource =>
      logger.info("Data source updated:", {
        dataSource,
      }),
    language: AppLanguage.Ar,
    dateVariables: mockDateVariables,
    selfHostedFonts: mockSelfHostedFonts,
    onSubmit: () => logger.info("Form submitted"),
    onCancel: () => logger.info("Form cancelled"),
    isSubmitting: false,
    submitLabel: "Submit",
  },
};

export const Submitting: Story = {
  args: {
    state: defaultState,
    errors: defaultErrors,
    updateBaseElement: (({ key, value }) =>
      logger.info("Base element updated:", {
        key,
        value,
      })) satisfies UpdateBaseElementFn,
    updateTextProps: (({ key, value }) =>
      logger.info("Text props updated:", {
        key,
        value,
      })) satisfies UpdateTextPropsFn,
    updateDateProps: (action =>
      logger.info("Date props updated:", {
        ...action,
      })) satisfies UpdateDatePropsFn,
    updateDataSource: dataSource =>
      logger.info("Data source updated:", {
        dataSource,
      }),
    language: AppLanguage.En,
    dateVariables: mockDateVariables,
    selfHostedFonts: mockSelfHostedFonts,
    onSubmit: () => logger.info("Form submitted"),
    onCancel: () => logger.info("Form cancelled"),
    isSubmitting: true,
    submitLabel: "Submit",
  },
};
