"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

/**
 * Props for the ActionButton component
 * @typedef ActionButtonProps
 */
export interface ActionButtonProps extends ButtonProps {
  /** Whether the button is in a loading state */
  isLoading?: boolean
  /** Text to display when the button is loading */
  loadingText?: string
  /** Icon to display before the button text */
  icon?: React.ReactNode
  /** Variant of the button */
  variant?: "default" | "primary" | "secondary" | "outline" | "ghost" | "link" | "destructive" | "success"
}

/**
 * ActionButton component for consistent action buttons with loading states
 *
 * @example
 * ```tsx
 * <ActionButton
 *   variant="primary"
 *   icon={<Save />}
 *   isLoading={isSaving}
 *   loadingText="Saving..."
 *   onClick={handleSave}
 * >
 *   Save Changes
 * </ActionButton>
 * ```
 */
export const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ className, children, isLoading = false, loadingText, icon, variant = "default", ...props }, ref) => {
    // Map our custom variants to the base Button variants and classes
    const variantMap: Record<string, { variant: ButtonProps["variant"]; className: string }> = {
      default: { variant: "default", className: "" },
      primary: { variant: "default", className: "bg-[#5EEAD4] hover:bg-[#5EEAD4]/90 text-black" },
      secondary: { variant: "default", className: "bg-[#FACC15] hover:bg-[#FACC15]/90 text-black" },
      outline: { variant: "outline", className: "" },
      ghost: { variant: "ghost", className: "" },
      link: { variant: "link", className: "" },
      destructive: { variant: "destructive", className: "" },
      success: { variant: "default", className: "bg-green-600 hover:bg-green-700 text-white" },
    }

    const { variant: buttonVariant, className: variantClassName } = variantMap[variant] || variantMap.default

    return (
      <Button
        ref={ref}
        variant={buttonVariant}
        className={cn(variantClassName, className)}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingText || children}
          </>
        ) : (
          <>
            {icon && <span className="mr-2">{icon}</span>}
            {children}
          </>
        )}
      </Button>
    )
  },
)

ActionButton.displayName = "ActionButton"
