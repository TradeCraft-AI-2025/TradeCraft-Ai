"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Check, CreditCard, Loader2, Lock, Shield, ArrowLeft, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { PremiumBackground } from "@/components/premium-background"

export default function CheckoutPage() {
  const [selectedPlan, setSelectedPlan] = useState<"subscription" | "lifetime">("subscription")
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { toast } = useToast()

  // Get plan from URL if provided
  useEffect(() => {
    const planFromUrl = searchParams.get("plan")
    if (planFromUrl === "lifetime" || planFromUrl === "subscription") {
      setSelectedPlan(planFromUrl)
    }
  }, [searchParams])

  // Pre-fill email if user is logged in or from URL
  useEffect(() => {
    const emailFromUrl = searchParams.get("email")
    if (emailFromUrl) {
      setEmail(emailFromUrl)
    } else if (user?.email) {
      setEmail(user.email)
    }
  }, [searchParams, user])

  const handleCheckout = async (selectedPlan: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planType: selectedPlan,
          email: user?.email || "",
          baseUrl: window.location.origin,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create checkout session")
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Error",
        description: "Failed to initiate checkout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const planDetails = {
    subscription: {
      name: "Monthly Subscription",
      price: "$9.99",
      period: "/month",
      description: "Cancel anytime",
    },
    lifetime: {
      name: "Lifetime Access",
      price: "$29.99",
      period: "",
      description: "One-time payment",
      badge: "Best Value",
    },
  }

  return (
    <>
      <PremiumBackground />
      <div className="container max-w-4xl mx-auto py-12 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center mb-8"
        >
          <Button variant="ghost" onClick={() => router.back()} className="absolute left-4 top-4 md:left-0 md:top-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <Badge className="mb-4 bg-[#5EEAD4]/20 text-[#5EEAD4] hover:bg-[#5EEAD4]/30">
            <Shield className="mr-1 h-3 w-3" /> Pro Features
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Upgrade to TradeCraft AI Pro</h1>
          <p className="text-muted-foreground max-w-[700px]">
            Get unlimited access to advanced trading tools and AI-powered insights
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Plan Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-2"
          >
            <Card className="bg-black/40 border-[#5EEAD4]/30">
              <CardHeader>
                <CardTitle className="text-xl text-white">Choose Your Plan</CardTitle>
                <CardDescription>Select the plan that works best for you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup
                  value={selectedPlan}
                  onValueChange={(value) => setSelectedPlan(value as "subscription" | "lifetime")}
                  className="grid grid-cols-1 gap-4"
                >
                  <div
                    className={`flex items-center justify-between space-x-2 rounded-lg border p-4 ${
                      selectedPlan === "subscription" ? "border-[#5EEAD4]" : "border-white/10"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="subscription" id="subscription" className="border-[#5EEAD4]" />
                      <Label htmlFor="subscription" className="font-medium text-white">
                        Monthly Subscription
                      </Label>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">
                        $9.99<span className="text-sm font-normal text-muted-foreground">/month</span>
                      </p>
                      <p className="text-xs text-muted-foreground">Cancel anytime</p>
                    </div>
                  </div>

                  <div
                    className={`relative flex items-center justify-between space-x-2 rounded-lg border p-4 ${
                      selectedPlan === "lifetime" ? "border-[#5EEAD4]" : "border-white/10"
                    }`}
                  >
                    <Badge className="absolute -top-2 right-4 bg-[#FACC15] text-black">Best Value</Badge>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="lifetime" id="lifetime" className="border-[#5EEAD4]" />
                      <Label htmlFor="lifetime" className="font-medium text-white">
                        Lifetime Access
                      </Label>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">$29.99</p>
                      <p className="text-xs text-muted-foreground">One-time payment</p>
                    </div>
                  </div>
                </RadioGroup>

                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background/80 border-soft/20 text-white"
                    disabled={!!user?.email}
                  />
                  <p className="text-xs text-muted-foreground">
                    We'll send your receipt and subscription details to this email
                  </p>
                </div>

                <div className="px-3 py-2 bg-[#5EEAD4]/10 rounded-md border border-[#5EEAD4]/20 text-xs text-slate-300">
                  <p className="font-semibold text-[#5EEAD4] mb-1">Test Mode</p>
                  <p>
                    Use test card number:{" "}
                    <span className="font-mono bg-black/30 px-1 py-0.5 rounded">4242 4242 4242 4242</span>
                  </p>
                  <p>Any future expiration date, any CVC, and any postal code.</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleCheckout(selectedPlan)}
                  disabled={isLoading || !email}
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
                      Proceed to Payment
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Plan Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-black/40 border-[#5EEAD4]/30">
              <CardHeader>
                <CardTitle className="text-xl text-white">Pro Features</CardTitle>
                <CardDescription>Everything included in your subscription</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-[#5EEAD4] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Personalized AI trading assistant that adapts to your portfolio</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-[#5EEAD4] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Advanced backtesting with unlimited historical data</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-[#5EEAD4] mr-2 mt-0.5 flex-shrink-0" />
                    <span>AI-powered strategy optimization and recommendations</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-[#5EEAD4] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Portfolio-specific insights and risk analysis</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-[#5EEAD4] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Priority customer support</span>
                  </li>
                </ul>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center">
                    <Lock className="h-4 w-4 text-[#5EEAD4] mr-2" />
                    <span className="text-sm">Secure payment via Stripe</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Your payment information is processed securely. We never store your card details.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => router.push("/pro")}>
                  Learn More About Pro
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  )
}
