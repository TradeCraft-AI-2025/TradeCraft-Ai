"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  isLoading?: boolean
  fullScreen?: boolean
  text?: string
  className?: string
  size?: "sm" | "md" | "lg"
  delay?: number // Delay in ms before showing the spinner
}

export function LoadingSpinner({
  isLoading = true,
  fullScreen = false,
  text = "Loading...",
  className,
  size = "md",
  delay = 300,
}: LoadingSpinnerProps) {
  const [showSpinner, setShowSpinner] = useState(delay === 0)

  useEffect(() => {
    if (!isLoading) {
      setShowSpinner(false)
      return
    }

    const timer = setTimeout(() => {
      setShowSpinner(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [isLoading, delay])

  if (!isLoading || !showSpinner) return null

  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  return (
    <AnimatePresence>
      {isLoading && showSpinner && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "flex flex-col items-center justify-center z-50 bg-background/80 backdrop-blur-sm",
            fullScreen ? "fixed inset-0" : "absolute inset-0 rounded-lg border border-border/50",
            className,
          )}
        >
          <div className="flex flex-col items-center gap-3 p-4 rounded-lg">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Loader2 className={cn("text-[#5EEAD4]", sizeClasses[size])} />
            </motion.div>
            {text && <p className="text-sm font-medium text-muted-foreground animate-pulse">{text}</p>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
