import type React from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface DashboardCardProps {
  title?: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  isLoading?: boolean
  isPremium?: boolean
  className?: string
  headerClassName?: string
  contentClassName?: string
  footerClassName?: string
}

export function DashboardCard({
  title,
  description,
  icon,
  children,
  footer,
  isLoading = false,
  isPremium = false,
  className = "",
  headerClassName = "",
  contentClassName = "",
  footerClassName = "",
}: DashboardCardProps) {
  return (
    <Card
      className={cn(
        "border border-slate-800/60 bg-slate-900/50 backdrop-blur-sm shadow-md",
        isPremium && "border-gradient-to-r from-cyan-500/50 to-purple-500/50",
        className,
      )}
    >
      {(title || icon) && (
        <CardHeader className={cn("pb-2 flex flex-row items-center justify-between", headerClassName)}>
          <div className="flex items-center space-x-2">
            {icon && <div className="flex-shrink-0">{icon}</div>}
            {title && (
              <CardTitle
                className={cn("text-base font-medium", isPremium && "text-gradient-to-r from-cyan-400 to-purple-400")}
              >
                {isLoading ? <Skeleton className="h-6 w-32" /> : title}
              </CardTitle>
            )}
          </div>
          {description && <div className="text-sm text-slate-400">{description}</div>}
        </CardHeader>
      )}
      <CardContent className={cn("", contentClassName)}>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : (
          children
        )}
      </CardContent>
      {footer && <CardFooter className={cn("pt-0 border-t border-slate-800/60", footerClassName)}>{footer}</CardFooter>}
    </Card>
  )
}
