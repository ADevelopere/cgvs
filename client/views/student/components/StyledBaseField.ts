import { styled, Theme } from "@mui/material/styles";
import { TextField } from "@mui/material";

export const createStyledTextField = (focusColor: string) => {
  return styled(TextField)(({ theme }: { theme: Theme }) => ({
    "& .MuiOutlinedInput-root": {
      transition: "all 0.3s ease",
      backgroundColor: theme.palette.background.paper,
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: focusColor,
        borderWidth: "2px",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: focusColor,
        borderWidth: "2px",
      },
      "&.Mui-focused": {
        backgroundColor: theme.palette.action.hover,
        transform: "scale(1.02)",
      },
      "&.Mui-error .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.error.main,
      },
      "&.Mui-disabled": {
        backgroundColor: theme.palette.action.disabledBackground,
      },
    },
    "& .MuiInputLabel-root": {
      "&.Mui-focused": {
        color: focusColor,
      },
    },
  }));
};
