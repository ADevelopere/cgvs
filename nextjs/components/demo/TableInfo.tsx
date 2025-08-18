import type React from "react"
import { Typography } from "@mui/material"
import { PaginationInfo } from "@/graphql/generated/types"

interface TableInfoProps {
  usePagination: boolean
  paginationInfo: PaginationInfo | null
  loadedRows: number
  filteredTotalRows: number
  totalRows: number
}

const TableInfo: React.FC<TableInfoProps> = ({
  usePagination,
  paginationInfo,
  loadedRows,
  filteredTotalRows,
  totalRows,
}) => {
  return (
    <header className="App-header">
      <Typography variant="h6" component="p">
        {usePagination ? (
          <>
            Page {paginationInfo?.currentPage} of {paginationInfo?.lastPage} ({paginationInfo?.firstItem}-
            {paginationInfo?.lastItem} of {filteredTotalRows} rows)
          </>
        ) : (
          <>
            Loaded {loadedRows} of {filteredTotalRows} rows
            {filteredTotalRows < totalRows && <span> (filtered from {totalRows} total records)</span>}
          </>
        )}
      </Typography>
    </header>
  )
}

export default TableInfo
