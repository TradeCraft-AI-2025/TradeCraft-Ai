"use client"

import * as React from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

/**
 * SearchInput component props
 * @interface SearchInputProps
 * @extends {React.InputHTMLAttributes<HTMLInputElement>}
 */
export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Whether the search is currently loading */
  isLoading?: boolean
  /** Callback when the search is submitted */
  onSearch?: (value: string) => void
  /** Callback when the search is cleared */
  onClear?: () => void
}

/**
 * SearchInput component for search functionality
 *
 * @example
 * ```tsx
 * <SearchInput
 *   placeholder="Search..."
 *   onSearch={(value) => console.log('Search:', value)}
 *   onClear={() => console.log('Search cleared')}
 * />
 * ```
 */
export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, isLoading, onSearch, onClear, ...props }, ref) => {
    const [value, setValue] = React.useState(props.defaultValue?.toString() || "")

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSearch?.(value)
    }

    const handleClear = () => {
      setValue("")
      onClear?.()
    }

    return (
      <form className={cn("relative", className)} onSubmit={handleSubmit}>
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <input
          ref={ref}
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={cn(
            "h-10 w-full rounded-md border border-input bg-background pl-8 pr-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          disabled={isLoading}
          {...props}
        />
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={handleClear}
            disabled={isLoading}
          >
            <X className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </form>
    )
  },
)
SearchInput.displayName = "SearchInput"
