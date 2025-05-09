"use client"

import type React from "react"
import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  TextField,
  Popover,
  Box,
  Typography,
  Pagination,
  Stack,
} from "@mui/material"
import {
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Clear as ClearIcon,
} from "@mui/icons-material"
import { format } from "date-fns"
import { useStudentManagement } from "@/contexts/student/StudentManagementContext"

// Define column configuration
const columns = [
  { id: "name", label: "Name", sortable: true, filterable: true },
  { id: "email", label: "Email", sortable: true, filterable: true },
  { id: "date_of_birth", label: "Date of Birth", sortable: true, filterable: true },
  { id: "gender", label: "Gender", sortable: true, filterable: true },
  { id: "nationality", label: "Nationality", sortable: true, filterable: true },
  { id: "phone_number", label: "Phone Number", sortable: true, filterable: true },
  { id: "created_at", label: "Created At", sortable: true, filterable: true },
  { id: "updated_at", label: "Updated At", sortable: true, filterable: true },
]

export default function StudentTable() {
  const {
    students,
    selectedStudents,
    paginatorInfo,
    queryParams,
    createStudent,
    updateStudent,
    deleteStudent,
    setQueryParams,
    toggleStudentSelect,
  } = useStudentManagement()

  // State for filter popover
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [currentFilterColumn, setCurrentFilterColumn] = useState<string | null>(null)
  const [filterValue, setFilterValue] = useState<string>("")

  // State for tracking edited cells
  const [editingCell, setEditingCell] = useState<{ studentId: string; field: string } | null>(null)
  const [editValue, setEditValue] = useState<string>("")

  // Handle filter icon click
  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>, columnId: string) => {
    setFilterAnchorEl(event.currentTarget)
    setCurrentFilterColumn(columnId)
    setFilterValue("")
  }

  // Handle filter close
  const handleFilterClose = () => {
    setFilterAnchorEl(null)
    setCurrentFilterColumn(null)
  }

  // Apply filter
  const applyFilter = () => {
    if (currentFilterColumn && filterValue) {
      // In a real implementation, you would update the queryParams with the filter
      // This is a simplified example
      handleFilterClose()
    }
  }

  // Handle sort
  const handleSort = (columnId: string) => {
    const currentOrderBy = queryParams.orderBy || []
    const columnIndex = currentOrderBy.findIndex((order) => order.column === columnId.toUpperCase())

    let newOrderBy = [...currentOrderBy]

    if (columnIndex === -1) {
      // Add new sort
      newOrderBy.push({ column: columnId.toUpperCase(), order: "ASC" })
    } else if (currentOrderBy[columnIndex].order === "ASC") {
      // Change to DESC
      newOrderBy[columnIndex] = { ...newOrderBy[columnIndex], order: "DESC" }
    } else {
      // Remove sort
      newOrderBy = newOrderBy.filter((_, index) => index !== columnIndex)
    }

    setQueryParams({ orderBy: newOrderBy })
  }

  // Get current sort direction for a column
  const getSortDirection = (columnId: string): "asc" | "desc" | null => {
    const currentOrderBy = queryParams.orderBy || []
    const column = currentOrderBy.find((order) => order.column === columnId.toUpperCase())

    if (!column) return null
    return column.order.toLowerCase() as "asc" | "desc"
  }

  // Check if a column has an active filter
  const hasActiveFilter = (columnId: string): boolean => {
    // In a real implementation, you would check if there's an active filter for this column
    // This is a placeholder
    return false
  }

  // Handle cell edit start
  const handleCellEditStart = (studentId: string, field: string, value: string) => {
    setEditingCell({ studentId, field })
    setEditValue(value || "")
  }

  // Handle cell edit change
  const handleCellEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value)
  }

  // Handle cell edit save
  const handleCellEditSave = async () => {
    if (!editingCell) return

    const { studentId, field } = editingCell

    // Create update input
    const updateInput = {
      id: studentId,
      [field]: editValue,
    }

    // Update student
    await updateStudent({ input: updateInput })

    // Reset editing state
    setEditingCell(null)
  }

  // Handle delete student
  const handleDeleteStudent = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      await deleteStudent(id)
    }
  }

  // Handle select all
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      // Select all students
      students.forEach((student) => {
        if (!selectedStudents.includes(student.id)) {
          toggleStudentSelect(student.id)
        }
      })
    } else {
      // Deselect all students
      students.forEach((student) => {
        if (selectedStudents.includes(student.id)) {
          toggleStudentSelect(student.id)
        }
      })
    }
  }

  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setQueryParams({ page })
  }

  // Format cell value for display
  const formatCellValue = (value: any, columnId: string): string => {
    if (value === null || value === undefined) return ""

    if (columnId === "date_of_birth" && value) {
      return format(new Date(value), "yyyy-MM-dd")
    }

    if (columnId === "created_at" || columnId === "updated_at") {
      return format(new Date(value), "yyyy-MM-dd HH:mm")
    }

    return String(value)
  }

  return (
    <Paper sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ flexGrow: 1, overflow: "auto" }}>
        <Table stickyHeader aria-label="student management table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedStudents.length > 0 && selectedStudents.length < students.length}
                  checked={students.length > 0 && selectedStudents.length === students.length}
                  onChange={handleSelectAll}
                />
              </TableCell>

              {columns.map((column) => (
                <TableCell key={column.id}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                      {column.label}
                    </Typography>

                    {column.sortable && (
                      <IconButton size="small" onClick={() => handleSort(column.id)} sx={{ ml: 0.5 }}>
                        {getSortDirection(column.id) === "asc" && <ArrowUpwardIcon fontSize="small" color="primary" />}
                        {getSortDirection(column.id) === "desc" && (
                          <ArrowDownwardIcon fontSize="small" color="primary" />
                        )}
                        {getSortDirection(column.id) === null && <ArrowUpwardIcon fontSize="small" color="disabled" />}
                      </IconButton>
                    )}

                    {column.filterable && (
                      <IconButton
                        size="small"
                        onClick={(e) => handleFilterClick(e, column.id)}
                        sx={{ ml: 0.5 }}
                        color={hasActiveFilter(column.id) ? "primary" : "default"}
                      >
                        <FilterListIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              ))}

              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => toggleStudentSelect(student.id)}
                  />
                </TableCell>

                {columns.map((column) => (
                  <TableCell key={`${student.id}-${column.id}`}>
                    {editingCell?.studentId === student.id && editingCell?.field === column.id ? (
                      <TextField
                        variant="standard"
                        value={editValue}
                        onChange={handleCellEditChange}
                        onBlur={handleCellEditSave}
                        autoFocus
                        fullWidth
                      />
                    ) : (
                      <Box
                        onClick={() =>
                          handleCellEditStart(student.id, column.id, formatCellValue(student[column.id], column.id))
                        }
                        sx={{
                          cursor: "text",
                          p: 1,
                          minHeight: "2rem",
                          "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                        }}
                      >
                        {formatCellValue(student[column.id], column.id)}
                      </Box>
                    )}
                  </TableCell>
                ))}

                <TableCell>
                  <IconButton color="error" onClick={() => handleDeleteStudent(student.id)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Footer */}
      {paginatorInfo && (
        <Box sx={{ p: 2, borderTop: "1px solid rgba(224, 224, 224, 1)" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2">
              Showing {paginatorInfo.firstItem || 0} to {paginatorInfo.lastItem || 0} of {paginatorInfo.total} entries
            </Typography>

            <Pagination
              count={paginatorInfo.lastPage}
              page={paginatorInfo.currentPage}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Stack>
        </Box>
      )}

      {/* Filter Popover */}
      <Popover
        open={Boolean(filterAnchorEl)}
        anchorEl={filterAnchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box sx={{ p: 2, width: 250 }}>
          <Typography variant="subtitle2" gutterBottom>
            Filter by {currentFilterColumn}
          </Typography>

          <TextField
            label="Filter value"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            variant="outlined"
            size="small"
            fullWidth
            sx={{ mb: 2 }}
          />

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <IconButton size="small" onClick={handleFilterClose}>
              <ClearIcon />
            </IconButton>

            <IconButton size="small" color="primary" onClick={applyFilter}>
              <FilterListIcon />
            </IconButton>
          </Stack>
        </Box>
      </Popover>
    </Paper>
  )
}
