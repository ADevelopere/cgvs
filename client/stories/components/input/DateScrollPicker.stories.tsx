import React, { useState } from "react";
import { Meta, StoryFn } from "@storybook/nextjs";

import withGlobalStyles from "@/client/stories/Decorators";
import { Box } from "@mui/material";
import moment from "moment-hijri";
import {
  commonStoryArgTypes,
  CommonStoryArgTypesProps,
  defaultStoryArgs,
} from "@/client/stories/argTypes";
import AppRouterCacheProvider from "@/client/components/appRouter/AppRouterCacheProvider";
import DateScrollPicker, { DateScrollPickerProps } from "@/client/components/input/DateScrollPicker";
import Calendar from "@/types/Calendar";
import useStoryTheme from "../../useStoryTheme";

export default {
  title: "Components/Input/DateScrollPicker",
  component: DateScrollPicker,
  decorators: [withGlobalStyles],
  argTypes: {
    ...commonStoryArgTypes,
    calendar: {
      table: {
        disable: true,
      },
    },
    setCalendar: {
      table: {
        disable: true,
      },
    },
    selectedDate: {
      table: {
        disable: true,
      },
    },
    onChange: {
      table: {
        disable: true,
      },
    },
  },
} as Meta;

type DateScrollPickerStoryProps = DateScrollPickerProps &
  CommonStoryArgTypesProps;

const Template: StoryFn<DateScrollPickerStoryProps> = (
  args: DateScrollPickerStoryProps,
) => {
  const [calendar, setCalendar] = useState(Calendar.Gregorian);
  const [selectedDate, setSelectedDate] = useState(moment());
  useStoryTheme(args);

  return (
    <AppRouterCacheProvider>
      <Box
        sx={{
          height: "100vh",
          paddingX: { xs: "1em", sm: "2em", md: "20em", lg: "30em" },
          backgroundColor: "background.default",
          color: "onBackground",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "start",
        }}
      >
        <DateScrollPicker
          calendar={calendar}
          setCalendar={setCalendar}
          selectedDate={selectedDate}
          onChange={setSelectedDate}
        />
      </Box>
    </AppRouterCacheProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  ...defaultStoryArgs,
  calendar: Calendar.Hijri,
};