"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { useAppTranslation } from "@/client/locale";

const SelectGroupPrompt: React.FC = () => {
    const strings = useAppTranslation("recipientGroupTranslations");

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "400px",
                textAlign: "center",
                padding: 4,
            }}
        >
            <GroupAddIcon sx={{ fontSize: 80, color: "grey.500", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
                {strings.selectGroupToAddStudents}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {strings.studentsNotInGroup}
            </Typography>
        </Box>
    );
};

export default SelectGroupPrompt;

