"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { SiteHeader } from "@/components/site-header"
import { StatusStrip } from "@/components/status-strip"
import { CustomTradingView } from "@/components/custom-trading-view"
import { PortfolioSummary } from "@/components/portfolio-summary"
import { ChevronDown, LineChart, Newspaper, BarChart2, Sparkles, ListFilter } from "lucide-react"
import { SimpleHelpModal } from "@/components/simple-help-modal"
import { ProGuard } from "@/components/pro-guard"
import { ProSidebar } from "@/components/pro-sidebar"
import { NewsCard } from "@/components/news-card"
import { useMediaQuery } from "@/hooks/use-media-query"
import { LiveWatchlist } from "@/components/live-watchlist"

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const [ticker, setTicker] = useState("AAPL")
  const [newTicker, setNewTicker] = useState("")
  const isDesktop = useMediaQuery("(min-width: 1024px)")

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

  const handleAddTicker = () => {
    if (newTicker.trim()) {
      setTicker(newTicker.trim().toUpperCase())
      setNewTicker("")
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <StatusStrip />
      <SiteHeader />
      <main className="container mx-auto flex-1 p-4 md:p-8 pt-6 pb-20 md:pb-8">
        {/* Page title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Market Dashboard</h2>
        </div>

        {/* Main content - Adjusted layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Chart + Add ticker form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chart Section */}
            <details className="dashboard-section group" open={isDesktop}>
              <summary className="dashboard-summary">
                <span className="flex items-center">
                  <LineChart className="h-5 w-5 text-cyan-500 mr-2" />
                  Market Chart
                  <ChevronDown className="h-4 w-4 ml-2 summary-icon" />
                </span>
              </summary>
              <div className="pt-4">
                {/* Main chart */}
                <div className="h-[500px]">
                  <CustomTradingView symbol={ticker} height={500} showToolbar={true} showVolume={true} />
                </div>
              </div>
            </details>

            {/* News Section */}
            <details className="dashboard-section group" open={isDesktop}>
              <summary className="dashboard-summary">
                <span className="flex items-center">
                  <Newspaper className="h-5 w-5 text-cyan-500 mr-2" />
                  Market News
                  <ChevronDown className="h-4 w-4 ml-2 summary-icon" />
                </span>
              </summary>
              <div className="pt-4">
                <NewsCard />
              </div>
            </details>
          </div>

          {/* Right column: Portfolio + Watchlist + Pro Sidebar */}
          <div className="space-y-6">
            {/* Portfolio Section */}
            <details className="dashboard-section group" open={isDesktop}>
              <summary className="dashboard-summary">
                <span className="flex items-center">
                  <BarChart2 className="h-5 w-5 text-cyan-500 mr-2" />
                  Portfolio
                  <ChevronDown className="h-4 w-4 ml-2 summary-icon" />
                </span>
              </summary>
              <div className="pt-4">
                <PortfolioSummary />
              </div>
            </details>

            {/* Watchlist Section */}
            <details className="dashboard-section group" open={isDesktop}>
              <summary className="dashboard-summary">
                <span className="flex items-center">
                  <ListFilter className="h-5 w-5 text-cyan-500 mr-2" />
                  Watchlist
                  <ChevronDown className="h-4 w-4 ml-2 summary-icon" />
                </span>
              </summary>
              <div className="pt-4">
                <LiveWatchlist
                  initialSymbols={["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA"]}
                  onSelectSymbol={(symbol) => setTicker(symbol)}
                  selectedSymbol={ticker}
                />
              </div>
            </details>

            {/* Pro Features Section */}
            <details className="dashboard-section group" open={isDesktop}>
              <summary className="dashboard-summary">
                <span className="flex items-center">
                  <Sparkles className="h-5 w-5 text-cyan-500 mr-2" />
                  Pro Features
                  <ChevronDown className="h-4 w-4 ml-2 summary-icon" />
                </span>
              </summary>
              <div className="pt-4">
                <ProGuard invert>
                  <ProSidebar />
                </ProGuard>
              </div>
            </details>
          </div>
        </div>
      </main>

      {/* Simple help modal */}
      <SimpleHelpModal />
    </div>
  )
}
