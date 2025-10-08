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
import { TEMPLATE_IMAGE_PLACEHOLDER_URL } from "@/client/utils/templateImagePlaceHolder";
import { useAppTranslation } from "@/client/locale";
import { useTemplateCategoryManagement } from "@/client/contexts/template/TemplateCategoryManagementContext";
import { Template } from "@/client/graphql/generated/gql/graphql";

interface ListViewProps {
    templates: Template[];
}

const ListView: React.FC<ListViewProps> = ({ templates }) => {
    const { manageTemplate } = useTemplateCategoryManagement();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const strings = useAppTranslation("templateCategoryTranslations");

    return (
        <TableContainer component={Paper}>
            <Table size={isMobile ? "small" : "medium"}>
                <TableHead>
                    <TableRow>
                        <TableCell
                            sx={{ width: isMobile ? "30%" : "5%" }}
                        ></TableCell>
                        <TableCell sx={{ width: isMobile ? "50%" : "20%" }}>
                            {strings.columnName}
                        </TableCell>
                        {!isMobile && (
                            <>
                                <TableCell width="35%">
                                    {strings.columnDescription}
                                </TableCell>
                                <TableCell width="20%">
                                    {strings.columnCreated}
                                </TableCell>
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
                                            width: "auto",
                                            height: { xs: "32px", sm: "40px" },
                                            aspectRatio: "1/1",
                                            position: "relative",
                                            overflow: "hidden",
                                            borderRadius: 1,
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Avatar
                                            variant="rounded"
                                            src={
                                                template.imageUrl ||
                                                TEMPLATE_IMAGE_PLACEHOLDER_URL
                                            }
                                            alt={template.name}
                                            sx={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
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
                                        onClick={() =>
                                            manageTemplate(template.id)
                                        }
                                        sx={{
                                            minWidth: { sm: "100px" },
                                            justifyContent: "start",
                                        }}
                                    >
                                        {!isMobile
                                            ? strings.buttonManage
                                            : undefined}
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
