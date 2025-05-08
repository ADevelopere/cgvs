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
    IconButton,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { formatDate } from "@/utils/dateUtils";
import { useTemplate } from "@/contexts/template/TemplatesContext";
import { Template } from "@/graphql/generated/types";
import { TEMPLATE_IMAGE_PLACEHOLDER_URL } from "@/utils/templateImagePlaceHolder";

interface ListViewProps {
    templates: Template[];
}

const ListView: React.FC<ListViewProps> = ({ templates }) => {
    const { manageTemplate } = useTemplate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <TableContainer component={Paper}>
            <Table size={isMobile ? "small" : "medium"}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ width: isMobile ? "30%" : "15%" }}>
                            Background
                        </TableCell>
                        <TableCell sx={{ width: isMobile ? "50%" : "20%" }}>
                            Name
                        </TableCell>
                        {!isMobile && (
                            <>
                                <TableCell width="35%">Description</TableCell>
                                <TableCell width="15%">Created</TableCell>
                            </>
                        )}
                        <TableCell sx={{ width: isMobile ? "20%" : "15%" }}>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {templates.map((template) => (
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
                                            template.background_url ||
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
                                        {formatDate(template.created_at)}
                                    </TableCell>
                                </>
                            )}
                            <TableCell>
                                {isMobile ? (
                                    <IconButton
                                        size="small"
                                        onClick={() =>
                                            manageTemplate(template.id)
                                        }
                                        sx={{ padding: 1 }}
                                    >
                                        <SettingsIcon fontSize="small" />
                                    </IconButton>
                                ) : (
                                    <Button
                                        size="medium"
                                        startIcon={<SettingsIcon />}
                                        onClick={() =>
                                            manageTemplate(template.id)
                                        }
                                        sx={{
                                            minWidth: { sm: "100px" },
                                        }}
                                    >
                                        Manage
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ListView;
