import type React from "react"
import { Switch, FormControlLabel, Box, Paper, Divider, useTheme } from "@mui/material"

interface TableFiltersProps {
  useCustomRowStyle: boolean
  onToggleCustomRowStyle: (e: React.ChangeEvent<HTMLInputElement>) => void
  usePagination: boolean
  onTogglePagination: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const TableFilters: React.FC<TableFiltersProps> = ({
  useCustomRowStyle,
  onToggleCustomRowStyle,
  usePagination,
  onTogglePagination,
}) => {
  const theme = useTheme()

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <FormControlLabel
          control={<Switch checked={useCustomRowStyle} onChange={onToggleCustomRowStyle} color="primary" />}
          label={useCustomRowStyle ? "Using status-based row colors" : "Using alternating row colors"}
        />
        <Box>
          <span
            style={{
              display: "inline-block",
              width: 12,
              height: 12,
              backgroundColor: theme.palette.success.light,
              marginRight: 4,
            }}
          ></span>{" "}
          Active
          <span
            style={{
              display: "inline-block",
              width: 12,
              height: 12,
              backgroundColor: theme.palette.warning.light,
              marginRight: 4,
              marginLeft: 8,
            }}
          ></span>{" "}
          Inactive
          <span
            style={{
              display: "inline-block",
              width: 12,
              height: 12,
              backgroundColor: theme.palette.info.light,
              marginRight: 4,
              marginLeft: 8,
            }}
          ></span>{" "}
          Pending
          <span
            style={{
              display: "inline-block",
              width: 12,
              height: 12,
              backgroundColor: theme.palette.error.light,
              marginRight: 4,
              marginLeft: 8,
            }}
          ></span>{" "}
          Suspended
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <FormControlLabel
        control={<Switch checked={usePagination} onChange={onTogglePagination} color="primary" />}
        label={usePagination ? "Using server-side pagination" : "Using infinite scroll"}
      />
    </Paper>
  )
}

export default TableFilters
