import type { Student } from "@/graphql/generated/types"

export type Column = {
  id: keyof Student
  label: string
  sortable: boolean
  filterable: boolean
}
