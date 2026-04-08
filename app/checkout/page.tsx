"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, CreditCard, Loader2, Lock, Shield, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { createBrowserSupabaseClient } from "@/lib/supabase-browser"

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const supabase = createBrowserSupabaseClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/auth")
        return
      }
      setEmail(data.user.email ?? "")
    })
  }, [router])

  const handleCheckout = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to create checkout session")
      }

      const { url } = await response.json()
      window.location.href = url
    } catch {
      toast({
        title: "Error",
        description: "Failed to initiate checkout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <Button variant="ghost" onClick={() => router.back()} className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="flex flex-col items-center text-center mb-8">
        <Badge className="mb-4 bg-[#5EEAD4]/20 text-[#5EEAD4]">
          <Shield className="mr-1 h-3 w-3" /> Pro
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Upgrade to Pro</h1>
        <p className="text-muted-foreground max-w-md">
          Unlimited portfolio insights, deeper analysis, and priority access to new features.
        </p>
      </div>

      <Card className="bg-black/40 border-[#5EEAD4]/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-white">Pro Plan</CardTitle>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">
                $9.99<span className="text-sm font-normal text-muted-foreground">/month</span>
              </p>
              <p className="text-xs text-muted-foreground">Cancel anytime</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start">
              <Check className="h-5 w-5 text-[#5EEAD4] mr-2 mt-0.5 shrink-0" />
              <span>Unlimited portfolio insights and daily briefs</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-[#5EEAD4] mr-2 mt-0.5 shrink-0" />
              <span>Detailed concentration and sector analysis</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-[#5EEAD4] mr-2 mt-0.5 shrink-0" />
              <span>Position-level risk explanations</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-[#5EEAD4] mr-2 mt-0.5 shrink-0" />
              <span>Priority access to new features</span>
            </li>
          </ul>

          {email && (
            <p className="text-sm text-muted-foreground mb-4">
              Purchasing as <span className="text-white">{email}</span>
            </p>
          )}

          <div className="flex items-center text-xs text-muted-foreground">
            <Lock className="h-3 w-3 mr-1" />
            Secure payment via Stripe
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full bg-[#FACC15] hover:bg-[#FACC15]/90 text-black"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Subscribe — $9.99/month
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
