"use client";

import React from "react";
import { Box, Button, Typography, Link as MuiLink } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useRecipientManagement } from "@/client/contexts/recipient";
import { useAppTranslation } from "@/client/locale";
import Link from "next/link";

const AddStudentsFooter: React.FC = () => {
 const strings = useAppTranslation("recipientGroupTranslations");
 const { selectedStudentIds, addStudentsToGroup, clearSelection, loading } =
  useRecipientManagement();

 const handleAddToGroup = async () => {
  await addStudentsToGroup();
 };

 return (
  <Box
   sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    p: 2,
    borderTop: 1,
    borderColor: "divider",
    bgcolor: "background.paper",
   }}
  >
   <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
    <Typography variant="body2" color="text.secondary">
     {strings.selectedStudents}: <strong>{selectedStudentIds.size}</strong>
    </Typography>
    <MuiLink
     component={Link}
     href="/admin/students"
     sx={{
      display: "flex",
      alignItems: "center",
      gap: 0.5,
      textDecoration: "none",
     }}
    >
     {strings.goToStudentsPage}
     <OpenInNewIcon fontSize="small" />
    </MuiLink>
   </Box>

   <Box sx={{ display: "flex", gap: 2 }}>
    <Button
     variant="outlined"
     startIcon={<ClearIcon />}
     onClick={clearSelection}
     disabled={selectedStudentIds.size === 0 || loading}
    >
     {strings.clearSelection}
    </Button>
    <Button
     variant="contained"
     startIcon={<AddIcon />}
     onClick={handleAddToGroup}
     disabled={selectedStudentIds.size === 0 || loading}
    >
     {strings.addToGroup}
    </Button>
   </Box>
  </Box>
 );
};

export default AddStudentsFooter;
