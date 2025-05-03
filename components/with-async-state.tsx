"use client"

import type React from "react"

import type { ReactNode } from "react"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ErrorBoundary } from "@/components/error-boundary"

interface WithAsyncStateProps {
  isLoading?: boolean
  error?: Error | null
  loadingText?: string
  children: ReactNode
  onRetry?: () => void
  fullScreenLoading?: boolean
}

export function WithAsyncState({
  isLoading = false,
  error = null,
  loadingText = "Loading...",
  children,
  onRetry,
  fullScreenLoading = false,
}: WithAsyncStateProps) {
  if (error) {
    throw error // This will be caught by the ErrorBoundary
  }

  return (
    <div className="relative">
      {isLoading && <LoadingSpinner isLoading={isLoading} text={loadingText} fullScreen={fullScreenLoading} />}
      {children}
    </div>
  )
}

export function withAsyncBoundary<P extends object>(Component: React.ComponentType<P>, onReset?: () => void) {
  return function WithAsyncBoundary(props: P) {
    return (
      <ErrorBoundary onReset={onReset}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}
