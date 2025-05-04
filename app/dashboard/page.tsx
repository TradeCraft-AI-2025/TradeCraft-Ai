"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { SiteHeader } from "@/components/site-header"
import { StatusStrip } from "@/components/status-strip"
import { LiveWatchlist } from "@/components/live-watchlist"
import { CustomTradingView } from "@/components/custom-trading-view"
import { PortfolioSummary } from "@/components/portfolio-summary"
import { RecentTransactions } from "@/components/recent-transactions"
import { MarketNews } from "@/components/market-news"
import { Button } from "@/components/ui/button"
import { Download, LineChart, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SimpleHelpModal } from "@/components/simple-help-modal"
import { ProGuard } from "@/components/pro-guard"

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  // Check for success parameter on component mount
  useEffect(() => {
    const success = searchParams.get("success")

    if (success === "true") {
      // Show success toast
      toast({
        title: "🎉 Subscription activated!",
        description: "Thank you for subscribing to TradeCraft AI Pro.",
        variant: "default",
        duration: 5000,
      })

      // Set subscribed flag in localStorage
      try {
        localStorage.setItem("subscribed", "true")
      } catch (error) {
        console.error("Error setting localStorage:", error)
      }

      // Remove the query parameter
      router.replace("/dashboard")
    }
  }, [searchParams, router, toast])

  return (
    <div className="flex min-h-screen flex-col">
      <StatusStrip />
      <SiteHeader />
      <main className="container mx-auto flex-1 space-y-4 p-4 md:p-8 pt-6">
        {/* Chart controls with export button (Pro feature) */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold tracking-tight">Market Overview</h2>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Ticker
            </Button>
            <ProGuard>
              <Button size="sm" variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Data
              </Button>
            </ProGuard>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main chart area - spans 2 columns on medium+ screens */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            {/* Primary chart */}
            <div className="h-[500px] w-full">
              <CustomTradingView symbol="AAPL" height={500} showToolbar={true} showVolume={true} />
            </div>

            {/* Pro Feature: Backtester */}
            <ProGuard>
              <Card className="border border-[#5EEAD4]/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-[#5EEAD4]" />
                    Strategy Backtester
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[200px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    Backtest your strategies against historical market data
                  </div>
                </CardContent>
              </Card>
            </ProGuard>

            {/* Market news and recent transactions in a 2-column layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MarketNews symbol="AAPL" isLoading={false} />
              <RecentTransactions />
            </div>
          </div>

          {/* Right sidebar - spans 1 column */}
          <div className="col-span-1 space-y-6">
            {/* Portfolio summary */}
            <PortfolioSummary />

            {/* Live watchlist */}
            <LiveWatchlist initialSymbols={["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA"]} />

            {/* Upgrade to Pro button - only show if not Pro */}
            <div className="mt-4">
              <ProGuard invert>
                <Button
                  className="w-full bg-gradient-to-r from-[#5EEAD4] to-[#FACC15] text-black font-medium"
                  size="lg"
                  onClick={() => router.push("/pricing")}
                >
                  Upgrade to Pro
                </Button>
              </ProGuard>
            </div>
          </div>
        </div>
      </main>

      {/* Simple help modal instead of complex tour */}
      <SimpleHelpModal />
    </div>
  )
}
