"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
    Typography,
    Box,
    Paper,
    TextField,
    InputAdornment,
    ToggleButtonGroup,
    ToggleButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import CardView from "./views/CardView";
import ListView from "./views/ListView";
import GridView from "./views/GridView";
import { Template } from "@/graphql/generated/types";
import useAppTranslation from "@/locale/useAppTranslation";
import { useTemplateCategoryManagement } from "@/contexts/template/TemplateCategoryManagementContext";

type ViewMode = "card" | "grid" | "list";

type TemplateListProps = {
    templates: Template[];
    style?: React.CSSProperties;
};

const TemplateListContent: React.FC<TemplateListProps> = ({ templates, style }) => {
    const strings = useAppTranslation("templateCategoryTranslations");
    const { currentCategory } = useTemplateCategoryManagement();

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [viewMode, setViewMode] = useState<ViewMode>(() => {
        const savedViewMode = localStorage.getItem("templateListViewMode");
        return (savedViewMode as ViewMode) || "card";
    });

    // Save view mode to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("templateListViewMode", viewMode);
    }, [viewMode]);

    // Filter templates based on search
    const searchTemplates = React.useMemo(() => {
        if (!Array.isArray(templates)) {
            return [];
        }
        return templates.filter((template) => {
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase();
            return (
                template.name?.toLowerCase().includes(query) ||
                template.description?.toLowerCase().includes(query)
            );
        });
    }, [templates, searchQuery]);

    const handleViewChange = useCallback(
        (_: React.MouseEvent<HTMLElement>, newView: ViewMode | null): void => {
            if (newView !== null) {
                setViewMode(newView);
            }
        },
        [setViewMode],
    );


    const renderTemplateView = useMemo(
        () => {
            if (searchTemplates?.length === 0) {
                return (
                    <Paper elevation={2}>
                        <Box p={3} textAlign="center">
                            <Typography color="textSecondary">
                                {searchQuery
                                    ? strings.noTemplatesFoundSearch
                                    : strings.noTemplatesFoundCreate}
                            </Typography>
                        </Box>
                    </Paper>
                );
            }

        switch (viewMode) {
            case "list":
                return <ListView templates={searchTemplates} />;
            case "grid":
                return <GridView templates={searchTemplates} />;
            default:
                return <CardView templates={searchTemplates} />;
        }
    }, [searchQuery, searchTemplates, strings.noTemplatesFoundCreate, strings.noTemplatesFoundSearch, viewMode]);

    return (
        <Box
            sx={{
                ...style,
                bgcolor: "background.default",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" }, // Stack on extra-small screens
                    justifyContent: "space-between",
                    alignItems: { xs: "stretch", sm: "center" }, // Align items differently on small screens
                    gap: 2,
                    mb: 3,
                }}
            >
                <Typography variant="h6">
                    {currentCategory?.name || strings.templates}
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" }, // Stack on extra-small screens
                        justifyContent: "space-between",
                        alignItems: { xs: "stretch", sm: "center" }, // Align items differently on small screens
                        gap: 2,
                    }}
                >
                    <TextField
                        placeholder={strings.searchTemplatesPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={{ width: { xs: "100%", sm: 300 } }} // Full width on extra-small screens
                    />

                    <ToggleButtonGroup
                        value={viewMode}
                        exclusive
                        onChange={handleViewChange}
                        sx={{ alignSelf: { xs: "center", sm: "auto" } }} // Center toggle buttons when stacked
                    >
                        <ToggleButton value="card">
                            <ViewModuleIcon />
                        </ToggleButton>
                        <ToggleButton value="grid">
                            <GridViewIcon />
                        </ToggleButton>
                        <ToggleButton value="list">
                            <ViewListIcon />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Box>

            {renderTemplateView}
        </Box>
    );
};

export default TemplateListContent;
