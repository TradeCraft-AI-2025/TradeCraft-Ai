"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight } from "lucide-react"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [paymentDetails, setPaymentDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPaymentDetails() {
      if (!sessionId) return

      try {
        const response = await fetch(`/api/verify-payment?session_id=${sessionId}`)
        if (response.ok) {
          const data = await response.json()
          setPaymentDetails(data)
        }
      } catch (error) {
        console.error("Error fetching payment details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPaymentDetails()
  }, [sessionId])

  return (
    <div className="container py-12 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-black/40 border-[#5EEAD4]/30">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#5EEAD4]/20"
            >
              <CheckCircle className="h-10 w-10 text-[#5EEAD4]" />
            </motion.div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
            <CardDescription>Thank you for upgrading to TradeCraft AI Pro</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-black/20 p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Your account has been upgraded to</p>
              <p className="text-xl font-bold text-[#5EEAD4]">TradeCraft AI Pro</p>
              <p className="text-sm text-muted-foreground mt-1">
                {paymentDetails?.planType === "subscription" ? "Monthly Subscription" : "Lifetime Access"}
              </p>
            </div>

            <div className="space-y-4">
              <Link href="/dashboard">
                <Button className="w-full bg-[#5EEAD4] hover:bg-[#5EEAD4]/80 text-black">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pro/backtest">
                <Button variant="outline" className="w-full border-[#5EEAD4]/30 hover:bg-[#5EEAD4]/10">
                  Try Backtesting Tool
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
