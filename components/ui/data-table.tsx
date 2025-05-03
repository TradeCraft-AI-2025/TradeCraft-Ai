import type * as React from "react"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Column definition for the DataTable
 * @typedef ColumnDef
 */
export interface ColumnDef<T> {
  /** Unique identifier for the column */
  id: string
  /** Header text for the column */
  header: React.ReactNode
  /** Function to get the cell value */
  cell: (item: T) => React.ReactNode
  /** Optional class name for the column */
  className?: string
}

/**
 * Props for the DataTable component
 * @typedef DataTableProps
 */
export interface DataTableProps<T> {
  /** Data to display in the table */
  data: T[]
  /** Column definitions */
  columns: ColumnDef<T>[]
  /** Whether the table is in a loading state */
  isLoading?: boolean
  /** Number of skeleton rows to show when loading */
  skeletonRows?: number
  /** Message to display when there is no data */
  emptyMessage?: React.ReactNode
  /** Optional class name for the table */
  className?: string
  /** Optional key extractor function */
  getRowKey?: (item: T) => string | number
}

/**
 * DataTable component for displaying tabular data
 *
 * @example
 * ```tsx
 * <DataTable
 *   data={users}
 *   columns={[
 *     { id: 'name', header: 'Name', cell: (user) => user.name },
 *     { id: 'email', header: 'Email', cell: (user) => user.email },
 *     { id: 'role', header: 'Role', cell: (user) => user.role }
 *   ]}
 *   isLoading={isLoading}
 *   emptyMessage="No users found"
 * />
 * ```
 */
export function DataTable<T>({
  data,
  columns,
  isLoading = false,
  skeletonRows = 5,
  emptyMessage = "No data available",
  className,
  getRowKey = (_, index) => index,
}: DataTableProps<T>) {
  return (
    <div className={cn("w-full overflow-auto", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.id} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            // Skeleton loading state
            Array.from({ length: skeletonRows }).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                {columns.map((column) => (
                  <TableCell key={`skeleton-${index}-${column.id}`} className={column.className}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            // Empty state
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            // Data rows
            data.map((item, index) => (
              <TableRow key={getRowKey(item, index)}>
                {columns.map((column) => (
                  <TableCell key={`${getRowKey(item, index)}-${column.id}`} className={column.className}>
                    {column.cell(item)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
