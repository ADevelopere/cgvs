"use client"

import { useCallback } from "react"
import { useAppTheme } from "@/hooks/useAppTheme"
import { useDemoTableContext } from "../DemoTableContext"

export function useRowStyle() {
  const theme = useAppTheme().theme
  const { useCustomRowStyle } = useDemoTableContext()

  // Custom row styling function based on status
  const getRowStyle = useCallback(
    (rowData: any, rowIndex: number) => {
      if (!useCustomRowStyle) return {}

      // Apply different background colors based on status
      switch (rowData.status) {
        case "Active":
          return { backgroundColor: theme.palette.success.light }
        case "Inactive":
          return { backgroundColor: theme.palette.warning.light }
        case "Pending":
          return { backgroundColor: theme.palette.info.light }
        case "Suspended":
          return { backgroundColor: theme.palette.error.light }
        default:
          return {}
      }
    },
    [useCustomRowStyle, theme],
  )

  return { getRowStyle }
}
