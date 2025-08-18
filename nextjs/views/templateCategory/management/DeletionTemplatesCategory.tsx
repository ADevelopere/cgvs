import { useState } from "react";
import { Box, Button } from "@mui/material";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import { useTemplateCategoryManagement } from "@/contexts/template/TemplateCategoryManagementContext";
import { formatDate } from "@/utils/dateUtils";
import useAppTranslation from "@/locale/useAppTranslation";
import { useAppBarHeight } from "@/hooks/useAppBarHeight";
import { useAppTheme } from "@/contexts/ThemeContext";
import { TEMPLATE_IMAGE_PLACEHOLDER_URL } from "@/utils/templateImagePlaceHolder";

interface TemplateRow {
    id: string;
    name: string;
    createdAt: string;
    imageUrl: string | null;
}

const DeletionTemplatesCategory: React.FC = () => {
    const strings = useAppTranslation("templateCategoryTranslations");
    const { theme } = useAppTheme();
    const { suspensionCategory, suspendTemplate } =
        useTemplateCategoryManagement();
    const [sortModel, setSortModel] = useState<GridSortModel>([
        {
            field: "trashed_at",
            sort: "desc",
        },
    ]);

    // Get templates from the deleted category
    const templates = suspensionCategory?.templates ?? [];

    const columns: GridColDef[] = [
        {
            field: "background",
            headerName: strings.image,
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                    }}
                >
                    <Box
                        component="img"
                        src={
                            params.row.imageUrl ??
                            TEMPLATE_IMAGE_PLACEHOLDER_URL
                        }
                        alt={`${params.row.name} ${strings.image}`}
                        sx={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 1,
                        }}
                    />
                </Box>
            ),
        },
        {
            field: "name",
            headerName: strings.name,
            flex: 1,
        },
        {
            field: "createdAt",
            headerName: strings.createdAt,
            flex: 1,
            renderCell: (params) => formatDate(params.row.createdAt),
        },
        {
            field: "trashed_at",
            headerName: strings.deletedAt,
            flex: 1,
            renderCell: (params) => formatDate(params.row.trashed_at),
        },
        {
            field: "actions",
            headerName: strings.actions,
            width: 150,
            sortable: false,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => suspendTemplate(params.row.id)}
                    color="primary"
                >
                    {strings.restoreTemplate}
                </Button>
            ),
        },
    ];

    const rows: TemplateRow[] = templates.map((template) => ({
        id: template.id.toString(),
        name: template.name,
        createdAt: template.createdAt,
        imageUrl: template.imageUrl ?? null,
    }));

    const appBarHeight = useAppBarHeight();

    return (
        <Box
            sx={{
                height: `calc(100vh - 220px - ${appBarHeight}px)`,
            }}
            id="deletion-templates-category"
        >
            <DataGrid
                rows={rows}
                columns={columns}
                sortModel={sortModel}
                onSortModelChange={(model) => setSortModel(model)}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                }}
                pageSizeOptions={[5, 10, 25]}
                disableRowSelectionOnClick
                rowHeight={72}
                slotProps={{
                    row: {
                        style: {
                            backgroundColor: theme.palette.background.paper,
                        },
                    },
                    cell: {
                        style: {
                            textAlign:
                                theme.direction === "rtl" ? "right" : "left",
                        },
                    },
                }}
            />
        </Box>
    );
};

export default DeletionTemplatesCategory;
