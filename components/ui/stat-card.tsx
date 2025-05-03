import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUp, ArrowDown } from "lucide-react"

/**
 * Props for the StatCard component
 * @typedef StatCardProps
 */
export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Title of the stat */
  title: string
  /** Value to display */
  value: React.ReactNode
  /** Change value (number or string) */
  change?: number | string
  /** Icon to display */
  icon?: React.ReactNode
  /** Whether the stat is in a loading state */
  isLoading?: boolean
  /** Custom class name */
  className?: string
  /** Whether to use a compact layout */
  compact?: boolean
}

/**
 * StatCard component for displaying key metrics with optional change indicators
 *
 * @example
 * ```tsx
 * <StatCard
 *   title="Total Revenue"
 *   value="$12,345"
 *   change={5.2}
 *   icon={<DollarSign />}
 * />
 * ```
 */
export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ title, value, change, icon, isLoading = false, className, compact = false, ...props }, ref) => {
    // Determine if change is positive, negative, or neutral
    const changeValue = typeof change === "number" ? change : Number.parseFloat((change as string) || "0")
    const isPositive = changeValue > 0
    const isNegative = changeValue < 0
    const changeColor = isPositive ? "text-green-500" : isNegative ? "text-red-500" : "text-gray-500"

    return (
      <Card ref={ref} className={cn("overflow-hidden", className)} {...props}>
        <CardContent className={cn("flex items-center", compact ? "p-4" : "p-6")}>
          {icon && (
            <div className={cn("flex-shrink-0 rounded-full p-2 mr-4", "bg-[#5EEAD4]/10 text-[#5EEAD4]")}>{icon}</div>
          )}

          <div className="flex-grow">
            <p className={cn("text-sm font-medium text-muted-foreground", compact && "text-xs")}>
              {isLoading ? <Skeleton className="h-4 w-24" /> : title}
            </p>

            <div className={cn("font-bold", compact ? "text-xl mt-1" : "text-2xl mt-2")}>
              {isLoading ? <Skeleton className="h-8 w-32" /> : value}
            </div>

            {change !== undefined && !isLoading && (
              <div className={cn("flex items-center mt-1", changeColor, compact ? "text-xs" : "text-sm")}>
                {isPositive ? (
                  <ArrowUp className="h-3 w-3 mr-1" />
                ) : isNegative ? (
                  <ArrowDown className="h-3 w-3 mr-1" />
                ) : null}
                <span>
                  {isPositive ? "+" : ""}
                  {typeof change === "number" ? change.toFixed(2) : change}%
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  },
)

StatCard.displayName = "StatCard"
