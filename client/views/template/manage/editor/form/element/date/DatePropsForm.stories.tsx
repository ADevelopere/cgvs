import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/logger";
import { DatePropsForm } from "./DatePropsForm";

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
      calendarType: "GREGORIAN",
      offsetDays: 0,
      transformation: null,
    },
    onUpdate: (key, value) => logger.info("Field updated", { key, value }),
    errors: {},
  },
};

export const HijriCalendar: Story = {
  args: {
    dateProps: {
      format: "DD/MM/YYYY",
      calendarType: "HIJRI",
      offsetDays: 0,
      transformation: null,
    },
    onUpdate: (key, value) => logger.info("Field updated", { key, value }),
    errors: {},
  },
};

export const WithOffset: Story = {
  args: {
    dateProps: {
      format: "MMMM DD, YYYY",
      calendarType: "GREGORIAN",
      offsetDays: 7,
      transformation: null,
    },
    onUpdate: (key, value) => logger.info("Field updated", { key, value }),
    errors: {},
  },
};

export const WithTransformation: Story = {
  args: {
    dateProps: {
      format: "YYYY-MM-DD",
      calendarType: "GREGORIAN",
      offsetDays: 0,
      transformation: "AGE_CALCULATION",
    },
    onUpdate: (key, value) => logger.info("Field updated", { key, value }),
    errors: {},
  },
};

export const WithErrors: Story = {
  args: {
    dateProps: {
      format: "",
      calendarType: "GREGORIAN",
      offsetDays: 0,
      transformation: null,
    },
    onUpdate: (key, value) => logger.info("Field updated", { key, value }),
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
      calendarType: "GREGORIAN",
      offsetDays: 0,
      transformation: null,
    },
    onUpdate: (key, value) => logger.info("Field updated", { key, value }),
    errors: {},
    disabled: true,
  },
};

