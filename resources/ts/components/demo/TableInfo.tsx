import type React from "react"
import { Typography } from "@mui/material"
import { PaginatorInfo } from "@/graphql/generated/types"

interface TableInfoProps {
  usePagination: boolean
  paginatorInfo: PaginatorInfo | null
  loadedRows: number
  filteredTotalRows: number
  totalRows: number
}

const TableInfo: React.FC<TableInfoProps> = ({
  usePagination,
  paginatorInfo,
  loadedRows,
  filteredTotalRows,
  totalRows,
}) => {
  return (
    <header className="App-header">
      <Typography variant="h6" component="p">
        {usePagination ? (
          <>
            Page {paginatorInfo?.currentPage} of {paginatorInfo?.lastPage} ({paginatorInfo?.firstItem}-
            {paginatorInfo?.lastItem} of {filteredTotalRows} rows)
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
