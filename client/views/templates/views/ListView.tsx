"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Avatar,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { formatDate } from "@/client/utils/dateUtils";
import { useAppTranslation } from "@/client/locale";
import { getTemplateImageUrl } from "@/client/utils/template/getTemplateImageUrl";
import { useAppTheme } from "@/client/contexts/ThemeContext";
import { Template } from "@/client/graphql/generated/gql/graphql";

interface ListViewProps {
  templates: Template[];
  manageTemplate: (templateId: number) => void;
}

const ListView: React.FC<ListViewProps> = ({ templates, manageTemplate }) => {
  const { isDark } = useAppTheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const strings = useAppTranslation("templateCategoryTranslations");

  return (
    <TableContainer component={Paper}>
      <Table size={isMobile ? "small" : "medium"}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: isMobile ? "30%" : "5%" }}></TableCell>
            <TableCell sx={{ width: isMobile ? "50%" : "20%" }}>
              {strings.columnName}
            </TableCell>
            {!isMobile && (
              <>
                <TableCell width="35%">{strings.columnDescription}</TableCell>
                <TableCell width="20%">{strings.columnCreated}</TableCell>
              </>
            )}
            <TableCell sx={{ width: isMobile ? "20%" : "15%" }}>
              {strings.columnActions}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {templates.map((template) => {
            if (!template.name) {
              throw new Error("Template name is required");
            }

            return (
              <TableRow key={template.id}>
                <TableCell>
                  <Box
                    sx={{
                      width: { xs: 40, sm: 48 },
                      height: { xs: 40, sm: 48 },
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "grey.100",
                    }}
                  >
                    <Avatar
                      variant="rounded"
                      src={getTemplateImageUrl(template, isDark)}
                      alt={template.name}
                      sx={{
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    maxWidth: { xs: "120px", sm: "150px" },
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {template.name}
                </TableCell>
                {!isMobile && (
                  <>
                    <TableCell
                      sx={{
                        maxWidth: { sm: "300px" },
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {template.description}
                    </TableCell>
                    <TableCell
                      sx={{
                        minWidth: { sm: "120px" },
                      }}
                    >
                      {formatDate(template.createdAt)}
                    </TableCell>
                  </>
                )}
                <TableCell>
                  <Button
                    size="medium"
                    startIcon={<SettingsIcon />}
                    onClick={() => manageTemplate(template.id)}
                    sx={{
                      minWidth: { sm: "100px" },
                      justifyContent: "start",
                    }}
                  >
                    {!isMobile ? strings.buttonManage : undefined}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ListView;
