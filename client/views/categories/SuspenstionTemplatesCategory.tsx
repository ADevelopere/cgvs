"use client";

import { useState } from "react";
import { Box, Button } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridSortModel,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { useQuery } from "@apollo/client/react";
import { formatDate } from "@/client/utils/dateUtils";
import { useAppTranslation } from "@/client/locale";
import { useAppBarHeight } from "@/client/hooks/useAppBarHeight";
import { useAppTheme } from "@/client/contexts/ThemeContext";
import { getTemplateImageUrl } from "@/client/utils/template/getTemplateImageUrl";
import * as sharedDocuments from "@/client/graphql/sharedDocuments";
import { useTemplateCategoryOperations } from "./hooks/useTemplateCategoryOperations";

interface TemplateRow {
  id: number;
  name: string;
  createdAt: string;
  imageUrl?: string | null;
  trashed_at?: string | null;
}

const SuspenstionTemplatesCategory: React.FC = () => {
  const strings = useAppTranslation("templateCategoryTranslations");
  const { theme } = useAppTheme();
  const { unsuspendTemplate } = useTemplateCategoryOperations();
  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: "trashed_at",
      sort: "desc",
    },
  ]);

  // Fetch suspended templates
  const { data: suspendedData, loading: suspensionTemplatesLoading } = useQuery(
    sharedDocuments.suspendedTemplatesQueryDocument,
    {
      fetchPolicy: "cache-first",
    },
  );
  const templates = suspendedData?.suspendedTemplates ?? [];

  const columns: GridColDef[] = [
    {
      field: "background",
      headerName: strings.image,
      width: 100,
      sortable: false,
      renderCell: (params: GridRenderCellParams<TemplateRow>) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Box
            component="img"
            src={getTemplateImageUrl(
              { imageUrl: params.row.imageUrl },
              theme.palette.mode === "dark",
            )}
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
      renderCell: (params: GridRenderCellParams<TemplateRow>) =>
        formatDate(params.row.createdAt),
    },
    {
      field: "trashed_at",
      headerName: strings.deletedAt,
      flex: 1,
      renderCell: (params: GridRenderCellParams<TemplateRow>) =>
        formatDate(params.row.trashed_at),
    },
    {
      field: "actions",
      headerName: strings.actions,
      width: 150,
      sortable: false,
      renderCell: (params: GridRenderCellParams<TemplateRow>) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => unsuspendTemplate(params.row.id)}
          color="primary"
        >
          {strings.restoreTemplate}
        </Button>
      ),
    },
  ];

  const rows: TemplateRow[] = templates.map((template) => {
    if (!template.name) {
      throw new Error("Template name is required");
    }
    return {
      id: template.id,
      name: template.name,
      createdAt: template.createdAt,
      // todo
      imageUrl: template.imageUrl,
    };
  });

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
        loading={suspensionTemplatesLoading}
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
              textAlign: theme.direction === "rtl" ? "right" : "left",
            },
          },
        }}
      />
    </Box>
  );
};

export default SuspenstionTemplatesCategory;
