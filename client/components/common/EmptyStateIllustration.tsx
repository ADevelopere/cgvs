import React from "react";
import { Box, Typography } from "@mui/material";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

export const EmptyStateIllustration: React.FC<{ message: string }> = ({ message }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        textAlign: "center",
        padding: "16px",
      }}
    >
      <SentimentDissatisfiedIcon sx={{ fontSize: 80, color: "grey.500" }} />
      <Typography variant="h6" sx={{ marginTop: "16px" }}>
        {message}
      </Typography>
    </Box>
  );
};
