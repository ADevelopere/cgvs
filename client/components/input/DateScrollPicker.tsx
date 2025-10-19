"use client";

// Reordered imports: third-party libraries first, then local modules
import React, { useEffect, useMemo, useRef, useState } from "react";
import moment from "moment-hijri";
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { CalendarTranslations, useAppTranslation } from "@/client/locale";
import { Calendar } from "@/lib/enum";

export type DateScrollPickerProps = {
  setCalendarAction: (calendar: Calendar) => void;
  selectedDate: moment.Moment;
  onChangeAction: (birthDate: moment.Moment) => void;
  calendar?: Calendar;
  minDate?: moment.Moment;
  maxDate?: moment.Moment;
  title?: string;
};

// Date boundaries according to the library documentation, but increased by 1 year
const minPossibleGregorianDate = moment("1941-01-01", "YYYY-MM-DD"); //1360-01-01
const maxPossibleGregorianDate = moment("2075-12-31", "YYYY-MM-DD");

/**
 * DateScrollPicker Component
 *
 * Allows users to select a date using a scrollable picker.
 * Supports both Gregorian and Hijri calendars.
 * @param {DateScrollPickerProps} props - The properties for the component.
 */
export const DateScrollPicker: React.FC<DateScrollPickerProps> = ({
  setCalendarAction: setCalendar,
  selectedDate,
  onChangeAction: onChange,
  calendar = Calendar.Gregorian,
  minDate,
  maxDate,
  title,
}) => {
  // Translation strings
  const strings: CalendarTranslations = useAppTranslation(
    "calendarTranslations"
  );

  useEffect(() => {
    moment.locale("en-US");
  });

  const maxGregorianDate = useMemo(() => {
    return maxDate &&
      maxDate.isValid() &&
      maxDate.isBefore(maxPossibleGregorianDate)
      ? maxDate.clone()
      : maxPossibleGregorianDate.clone();
  }, [maxDate]);

  const minGregorianDate: moment.Moment = useMemo(() => {
    return minDate &&
      minDate.isValid() &&
      minDate.isAfter(minPossibleGregorianDate)
      ? minDate.clone()
      : minPossibleGregorianDate.clone();
  }, [minDate]);

  const years = useMemo(() => {
    let maxYear = maxGregorianDate.year();
    let minYear = minGregorianDate.year();
    if (calendar === Calendar.Hijri) {
      maxYear = maxGregorianDate.iYear();
      minYear = minGregorianDate.iYear();
    }

    return Array.from(
      { length: maxYear - minYear + 1 },
      (_, i) => minYear + i
    ).reverse();
  }, [maxGregorianDate, minGregorianDate, calendar]);

  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  const daysInMonth = useMemo(() => {
    let daysCount = 0;
    if (calendar === Calendar.Gregorian) {
      daysCount = selectedDate.daysInMonth();
    } else {
      daysCount = moment.iDaysInMonth(
        selectedDate.iYear(),
        selectedDate.iMonth()
      );
    }

    return Array.from({ length: daysCount }, (_, i) => i + 1);
  }, [selectedDate, calendar]);

  const gregorianMonthNames = useMemo(
    () => [
      strings.january,
      strings.february,
      strings.march,
      strings.april,
      strings.may,
      strings.june,
      strings.july,
      strings.august,
      strings.september,
      strings.october,
      strings.november,
      strings.december,
    ],
    [strings]
  );

  const hijriMonthNames = useMemo(
    () => [
      strings.muharram,
      strings.safar,
      strings.rabiul_awwal,
      strings.rabiul_akhir,
      strings.jamadil_awwal,
      strings.jamadil_akhir,
      strings.rajab,
      strings.shaaban,
      strings.ramadan,
      strings.shawwal,
      strings.dhu_al_qidah,
      strings.dhu_al_hijjah,
    ],
    [strings]
  );

  const monthNames = useMemo(() => {
    if (calendar === Calendar.Gregorian) {
      return gregorianMonthNames;
    } else {
      return hijriMonthNames;
    }
  }, [calendar, gregorianMonthNames, hijriMonthNames]);

  const [anchorElDay, setAnchorElDay] = useState<null | HTMLElement>(null);
  const [anchorElMonth, setAnchorElMonth] = useState<null | HTMLElement>(null);
  const [anchorElYear, setAnchorElYear] = useState<null | HTMLElement>(null);

  const dayInputRef = useRef<HTMLInputElement>(null);
  const monthInputRef = useRef<HTMLInputElement>(null);
  const yearInputRef = useRef<HTMLInputElement>(null);

  const [dayInputValue, setDayInputValue] = useState<string>(
    calendar === Calendar.Gregorian
      ? selectedDate.date().toString()
      : selectedDate.iDate().toString()
  );
  const [monthInputValue, setMonthInputValue] = useState<string>(
    calendar === Calendar.Gregorian
      ? (selectedDate.month() + 1).toString()
      : (selectedDate.iMonth() + 1).toString()
  );
  const [yearInputValue, setYearInputValue] = useState<string>(
    calendar === Calendar.Gregorian
      ? selectedDate.year().toString()
      : selectedDate.iYear().toString()
  );

  // Event handlers for opening menus
  const handleOpenDayMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElDay(event.currentTarget);
  };
  const handleOpenMonthMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElMonth(event.currentTarget);
  };
  const handleOpenYearMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElYear(event.currentTarget);
  };

  // Event handlers for closing menus
  const handleCloseDayMenu = () => {
    setAnchorElDay(null);
  };
  const handleCloseMonthMenu = () => {
    setAnchorElMonth(null);
  };
  const handleCloseYearMenu = () => {
    setAnchorElYear(null);
  };

  // Handlers for changing day, month, and year
  const handleDayChange = (day: number) => {
    if (calendar === Calendar.Gregorian) {
      onChange(selectedDate.date(day));
    } else {
      onChange(selectedDate.iDate(day));
    }
    setDayInputValue(day.toString());
  };

  const handleMonthChange = (month: number) => {
    if (calendar === Calendar.Gregorian) {
      onChange(selectedDate.month(month - 1));
    } else {
      onChange(selectedDate.iMonth(month - 1));
    }
    setMonthInputValue(month.toString());
  };

  const handleYearChange = (year: number) => {
    if (calendar === Calendar.Gregorian) {
      onChange(selectedDate.year(year));
    } else {
      onChange(selectedDate.iYear(year));
    }
    setYearInputValue(year.toString());
  };

  const handleDayInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const day = event.target.value;
    setDayInputValue(day);
    const dayNumber = Number(day);
    if (dayNumber >= 1) {
      if (dayNumber <= daysInMonth.length) {
        handleDayChange(dayNumber);
      } else {
        const extraDays = dayNumber - daysInMonth.length;
        let newDate;
        let updateInputFunction: () => void;
        if (calendar === Calendar.Hijri) {
          newDate = selectedDate.clone().endOf("iMonth").add(extraDays, "days");
          updateInputFunction = updateInputValuesHijri;
        } else {
          newDate = selectedDate.clone().endOf("month").add(extraDays, "days");
          updateInputFunction = updateInputValuesGregorian;
        }

        if (newDate.isAfter(maxGregorianDate)) {
          newDate = maxGregorianDate.clone();
        }
        onChange(newDate);
        updateInputFunction();
      }
    }
  };

  const handleMonthInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const month = event.target.value;
    setMonthInputValue(month);
    const monthNumber = Number(month);
    if (monthNumber >= 1 && monthNumber <= 12) {
      handleMonthChange(monthNumber);
    } else if (monthNumber > 12) {
      const extraMonths = monthNumber - 12;
      let newDate;
      let updateInputFunction: () => void;
      if (calendar === Calendar.Hijri) {
        newDate = selectedDate
          .clone()
          .endOf("iYear")
          .add(extraMonths, "iMonth");
        updateInputFunction = updateInputValuesHijri;
      } else {
        newDate = selectedDate.clone().endOf("year").add(extraMonths, "months");
        updateInputFunction = updateInputValuesGregorian;
      }

      if (newDate.isAfter(maxGregorianDate)) {
        newDate = maxGregorianDate.clone();
      }
      onChange(newDate);
      updateInputFunction();
    }
  };

  const handleYearInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const year = event.target.value;
    setYearInputValue(year);
    const yearNumber = Number(year);
    if (years.includes(yearNumber)) {
      handleYearChange(yearNumber);
    }
  };

  const handleDayInputBlur = () => {
    if (dayInputValue === "" || !daysInMonth.includes(Number(dayInputValue))) {
      setDayInputValue(
        calendar === Calendar.Gregorian
          ? selectedDate.date().toString()
          : selectedDate.iDate().toString()
      );
    }
  };

  const handleMonthInputBlur = () => {
    if (monthInputValue === "" || !months.includes(Number(monthInputValue))) {
      setMonthInputValue(
        calendar === Calendar.Gregorian
          ? (selectedDate.month() + 1).toString()
          : (selectedDate.iMonth() + 1).toString()
      );
    }
  };

  const handleYearInputBlur = () => {
    if (yearInputValue === "" || !years.includes(Number(yearInputValue))) {
      setYearInputValue(
        calendar === Calendar.Gregorian
          ? selectedDate.year().toString()
          : selectedDate.iYear().toString()
      );
    }
  };

  const updateInputValuesHijri = () => {
    setDayInputValue(selectedDate.iDate().toString());
    setMonthInputValue((selectedDate.iMonth() + 1).toString());
    setYearInputValue(selectedDate.iYear().toString());
  };

  const updateInputValuesGregorian = () => {
    setDayInputValue(selectedDate.date().toString());
    setMonthInputValue((selectedDate.month() + 1).toString());
    setYearInputValue(selectedDate.year().toString());
  };

  const handleCalendarChange = (newCalendar: Calendar) => {
    setCalendar(newCalendar);
    if (newCalendar === Calendar.Hijri) {
      updateInputValuesHijri();
    } else {
      updateInputValuesGregorian();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "end",
        gap: 1,
        width: "100%",
        flexWrap: "wrap",
        minWidth: 0,
      }}
    >
      {/* calendar title and selection */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
          width: "100%",
          flexWrap: "wrap",
          minWidth: 0,
        }}
      >
        {/* calender title */}
        <Typography
          sx={{
            overflow: "show",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
          }}
          variant={"subtitle1"}
        >
          {title ?? strings.date}
        </Typography>
        {/* calendar selection button group */}
        <ButtonGroup
          disableElevation
          variant="outlined"
          aria-label="calendar selection button group"
          sx={{
            width: "70%",
          }}
        >
          {/* Hijri button */}
          <Button
            onClick={() => {
              handleCalendarChange(Calendar.Hijri);
            }}
            variant={calendar === Calendar.Hijri ? "contained" : "outlined"}
            sx={{ width: "50%", minWidth: 0 }}
          >
            {strings.hijri}
          </Button>

          {/* Gregorian button */}
          <Button
            onClick={() => {
              handleCalendarChange(Calendar.Gregorian);
            }}
            variant={calendar === Calendar.Gregorian ? "contained" : "outlined"}
            sx={{ width: "50%", minWidth: 0 }}
          >
            {strings.gregorian}
          </Button>
        </ButtonGroup>
      </Box>

      {/* date picker */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          width: "fit-content",
          gap: 2,
          flexWrap: "nowrap",
          overflow: "hidden",
        }}
      >
        {/* day input */}
        <TextField
          variant={"standard"}
          label={strings.day}
          value={dayInputValue}
          onChange={handleDayInputChange}
          onBlur={handleDayInputBlur}
          type="text"
          slotProps={{
            htmlInput: {
              min: 1,
              max: daysInMonth.length,
              dir: "rtl",
              style: { width: "2ch" },
            },
            input: {
              endAdornment: (
                <InputAdornment
                  position="end"
                  sx={{ marginLeft: 0, marginRight: 0 }}
                >
                  <IconButton onClick={handleOpenDayMenu}>
                    <ArrowDropDownIcon />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          inputRef={dayInputRef}
        />

        {/* day menu */}
        <Menu
          anchorEl={anchorElDay}
          open={Boolean(anchorElDay)}
          onClose={handleCloseDayMenu}
          slotProps={{
            list: {
              autoFocusItem: true,
              sx: {
                "& .Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "white",
                },
              },
            },
          }}
        >
          {daysInMonth.map(day => (
            <MenuItem
              key={day}
              selected={
                calendar === Calendar.Gregorian
                  ? selectedDate.date() === day
                  : selectedDate.iDate() === day
              }
              onClick={() => {
                handleDayChange(day);
                handleCloseDayMenu();
              }}
            >
              {day}
            </MenuItem>
          ))}
        </Menu>

        {/* month input */}
        <TextField
          variant={"standard"}
          label={strings.month}
          value={monthInputValue}
          onChange={handleMonthInputChange}
          onBlur={handleMonthInputBlur}
          type="text"
          slotProps={{
            htmlInput: {
              min: 1,
              max: 12,
              dir: "rtl",
              style: { width: "2ch" },
            },
            input: {
              endAdornment: (
                <InputAdornment
                  position="end"
                  sx={{ marginLeft: 0, marginRight: 0 }}
                >
                  <IconButton onClick={handleOpenMonthMenu}>
                    <ArrowDropDownIcon />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          inputRef={monthInputRef}
        />

        {/* month menu */}
        <Menu
          anchorEl={anchorElMonth}
          open={Boolean(anchorElMonth)}
          onClose={handleCloseMonthMenu}
          slotProps={{
            list: {
              autoFocusItem: true,
              sx: {
                "& .Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "white",
                },
              },
            },
          }}
        >
          {months.map(month => (
            <MenuItem
              key={month}
              selected={
                calendar === Calendar.Gregorian
                  ? selectedDate.month() + 1 === month
                  : selectedDate.iMonth() + 1 === month
              }
              onClick={() => {
                handleMonthChange(month);
                handleCloseMonthMenu();
              }}
            >
              {month}.. {monthNames[month - 1]}
            </MenuItem>
          ))}
        </Menu>

        {/* year input */}
        <TextField
          variant={"standard"}
          label={strings.year}
          value={yearInputValue}
          onChange={handleYearInputChange}
          onBlur={handleYearInputBlur}
          type="text"
          slotProps={{
            htmlInput: {
              dir: "rtl",
              style: { width: "4ch" },
            },
            input: {
              endAdornment: (
                <InputAdornment
                  position="end"
                  sx={{ marginLeft: 0, marginRight: 0 }}
                >
                  <IconButton onClick={handleOpenYearMenu}>
                    <ArrowDropDownIcon />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          inputRef={yearInputRef}
        />

        {/* year menu */}
        <Menu
          anchorEl={anchorElYear}
          open={Boolean(anchorElYear)}
          onClose={handleCloseYearMenu}
          slotProps={{
            list: {
              autoFocusItem: true,
              sx: {
                "& .Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "white",
                },
              },
            },
          }}
        >
          {years.map(year => (
            <MenuItem
              key={year}
              selected={
                calendar === Calendar.Gregorian
                  ? selectedDate.year() === year
                  : selectedDate.iYear() === year
              }
              onClick={() => {
                handleYearChange(year);
                handleCloseYearMenu();
              }}
            >
              {year}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Box>
  );
};
