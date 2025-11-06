import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/console";
import { DatePropsForm } from "./DatePropsForm";
import { CalendarType, DateTransformationType } from "@/client/graphql/generated/gql/graphql";

const meta: Meta<typeof DatePropsForm> = {
  title: "Template/Editor/Form/Element/Date/DatePropsForm",
  component: DatePropsForm,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DatePropsForm>;

export const Default: Story = {
  args: {
    dateProps: {
      format: "YYYY-MM-DD",
      calendarType: CalendarType.Gregorian,
      offsetDays: 0,
      transformation: null,
    },
    onUpdate: action => logger.info("Field updated", { ...action }),
    errors: {},
  },
};

export const HijriCalendar: Story = {
  args: {
    dateProps: {
      format: "DD/MM/YYYY",
      calendarType: CalendarType.Hijri,
      offsetDays: 0,
      transformation: null,
    },
    onUpdate: action => logger.info("Field updated", { ...action }),
    errors: {},
  },
};

export const WithOffset: Story = {
  args: {
    dateProps: {
      format: "MMMM DD, YYYY",
      calendarType: CalendarType.Gregorian,
      offsetDays: 7,
      transformation: null,
    },
    onUpdate: action => logger.info("Field updated", { ...action }),
    errors: {},
  },
};

export const WithTransformation: Story = {
  args: {
    dateProps: {
      format: "YYYY-MM-DD",
      calendarType: CalendarType.Gregorian,
      offsetDays: 0,
      transformation: DateTransformationType.AgeCalculation,
    },
    onUpdate: action => logger.info("Field updated", { ...action }),
    errors: {},
  },
};

export const WithErrors: Story = {
  args: {
    dateProps: {
      format: "",
      calendarType: CalendarType.Gregorian,
      offsetDays: 0,
      transformation: null,
    },
    onUpdate: action => logger.info("Field updated", { ...action }),
    errors: {
      format: "Date format is required",
      offsetDays: "Offset days must be an integer",
    },
  },
};

export const Disabled: Story = {
  args: {
    dateProps: {
      format: "YYYY-MM-DD",
      calendarType: CalendarType.Gregorian,
      offsetDays: 0,
      transformation: null,
    },
    onUpdate: action => logger.info("Field updated", { ...action }),
    errors: {},
    disabled: true,
  },
};
