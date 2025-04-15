"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Download, RefreshCw } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PortfolioTable } from "@/components/portfolio-table"
import { PortfolioSummary } from "@/components/portfolio-summary"
import { fetchPortfolioData } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import type { PortfolioHolding } from "@/lib/types"
import { isAuthenticated } from "@/lib/auth"

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioHolding[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [connectedBroker, setConnectedBroker] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await isAuthenticated()
      if (!auth.authenticated) {
        router.push("/")
        return
      }

      setConnectedBroker(auth.broker)
      loadPortfolioData()
    }

    checkAuth()
  }, [router])

  const loadPortfolioData = async () => {
    setIsLoading(true)
    try {
      const data = await fetchPortfolioData()
      setPortfolio(data)
    } catch (error) {
      toast({
        title: "Error loading portfolio",
        description: "There was an error loading your portfolio data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    loadPortfolioData()
    toast({
      title: "Portfolio refreshed",
      description: "Your portfolio data has been updated.",
    })
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Your Portfolio</h1>
          </div>
          <p className="text-muted-foreground">
            {connectedBroker ? `Connected to ${connectedBroker}` : "View and analyze your investments"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="h-9" onClick={handleRefresh}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <PortfolioSummary portfolio={portfolio} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
          <CardDescription>Your current portfolio holdings and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <PortfolioTable portfolio={portfolio} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  )
}
