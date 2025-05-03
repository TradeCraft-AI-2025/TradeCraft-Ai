"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full space-y-8 text-center">
            <div className="flex justify-center">
              <div className="bg-red-500/10 p-3 rounded-full">
                <AlertTriangle className="h-10 w-10 text-red-500" />
              </div>
            </div>
            <h1 className="text-3xl font-bold">Something went wrong</h1>
            <p className="text-muted-foreground">
              We apologize for the inconvenience. An unexpected error has occurred.
            </p>
            {error.message && (
              <div className="bg-muted/50 p-4 rounded text-sm font-mono overflow-auto max-h-[200px] text-left">
                {error.message}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button onClick={reset} variant="default">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try again
              </Button>
              <Link href="/">
                <Button variant="outline">
                  <Home className="mr-2 h-4 w-4" />
                  Return home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
