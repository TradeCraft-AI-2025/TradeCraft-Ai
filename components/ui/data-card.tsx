import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Props for the DataCard component
 * @typedef DataCardProps
 */
export interface DataCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Title of the card */
  title?: React.ReactNode
  /** Description text below the title */
  description?: React.ReactNode
  /** Main content of the card */
  children: React.ReactNode
  /** Optional footer content */
  footer?: React.ReactNode
  /** Whether the card is in a loading state */
  isLoading?: boolean
  /** Custom class name for the card */
  className?: string
  /** Whether to use a gradient border */
  gradient?: boolean
  /** Whether this is a featured/highlighted card */
  featured?: boolean
}

/**
 * DataCard component for displaying information in a consistent card format
 *
 * @example
 * ```tsx
 * <DataCard
 *   title="Portfolio Value"
 *   description="Current value of your investments"
 *   footer={<Button>View Details</Button>}
 * >
 *   <p className="text-3xl font-bold">$10,245.65</p>
 * </DataCard>
 * ```
 */
export const DataCard = React.forwardRef<HTMLDivElement, DataCardProps>(
  (
    {
      title,
      description,
      children,
      footer,
      isLoading = false,
      className,
      gradient = false,
      featured = false,
      ...props
    },
    ref,
  ) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "h-full",
          gradient && "border-0 p-[1px] bg-gradient-to-r from-[#5EEAD4]/50 to-[#FACC15]/50",
          featured && "border-[#5EEAD4]",
          className,
        )}
        {...props}
      >
        <div className={cn("h-full rounded-[inherit]", gradient && "bg-card")}>
          {title && (
            <CardHeader className="pb-2">
              {isLoading ? (
                <>
                  <Skeleton className="h-6 w-32 mb-1" />
                  {description && <Skeleton className="h-4 w-48" />}
                </>
              ) : (
                <>
                  <CardTitle>{title}</CardTitle>
                  {description && <CardDescription>{description}</CardDescription>}
                </>
              )}
            </CardHeader>
          )}
          <CardContent className={cn(!title && "pt-6")}>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-3/4" />
              </div>
            ) : (
              children
            )}
          </CardContent>
          {footer && <CardFooter>{isLoading ? <Skeleton className="h-10 w-full" /> : footer}</CardFooter>}
        </div>
      </Card>
    )
  },
)

DataCard.displayName = "DataCard"
