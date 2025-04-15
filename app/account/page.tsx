"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { CalendarClock, CreditCard, LogOut, Shield } from "lucide-react"

export default function AccountPage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  const handleLogout = async () => {
    try {
      await logout()
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading || !isAuthenticated) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center">
          <div className="relative w-12 h-12 mb-4">
            <div className="absolute inset-0 border-4 border-t-[#5EEAD4] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-3 border-4 border-t-transparent border-r-[#5EEAD4] border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
          </div>
          <p className="text-[#5EEAD4]">Loading account information...</p>
        </div>
      </div>
    )
  }

  const getSubscriptionBadge = () => {
    switch (user?.subscriptionStatus) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active Subscription</Badge>
      case "lifetime":
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Lifetime Access</Badge>
      case "canceled":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Canceled</Badge>
      case "expired":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Expired</Badge>
      default:
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">No Subscription</Badge>
    }
  }

  return (
    <div className="container py-8">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold tracking-tight mb-6"
      >
        Account Settings
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="md:col-span-2"
        >
          <Card className="bg-background/60 backdrop-blur border-muted">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Manage your account details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Name</h3>
                  <p className="text-lg">{user?.name || "Not provided"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
                  <p className="text-lg">{user?.email}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Member Since</h3>
                <p className="text-lg">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-background/60 backdrop-blur border-muted">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Subscription</CardTitle>
                {getSubscriptionBadge()}
              </div>
              <CardDescription>Manage your TradeCraft AI Pro subscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user?.subscriptionStatus === "active" || user?.subscriptionStatus === "lifetime" ? (
                <>
                  <div className="flex items-center space-x-2 text-green-400">
                    <Shield className="h-5 w-5" />
                    <span className="font-medium">Pro Features Enabled</span>
                  </div>

                  {user.subscriptionStatus === "active" && user.subscriptionExpires && (
                    <div className="flex items-center space-x-2">
                      <CalendarClock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Renews on {new Date(user.subscriptionExpires).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {user.subscriptionStatus === "lifetime" && (
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-purple-400" />
                      <span className="text-sm text-purple-400">Lifetime access</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-4">Upgrade to TradeCraft AI Pro to access premium features</p>
                  <Button onClick={() => router.push("/pro")} className="bg-[#FACC15] hover:bg-[#FACC15]/90 text-black">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Upgrade to Pro
                  </Button>
                </div>
              )}
            </CardContent>
            {(user?.subscriptionStatus === "active" || user?.subscriptionStatus === "lifetime") && (
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open("https://billing.stripe.com/p/login/test_28o5nA9Oj8Oi9yw144", "_blank")}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Manage Billing
                </Button>
              </CardFooter>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
