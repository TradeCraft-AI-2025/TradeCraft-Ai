"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import {
  CalendarClock,
  CreditCard,
  LogOut,
  Shield,
  Settings,
  User,
  Wallet,
  Bell,
  Lock,
  BarChart,
  Clock,
  ChevronRight,
  Edit,
  Save,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { BrokerConnectionCard } from "@/components/broker-connection-card"
import { TradingPreferencesForm } from "@/components/trading-preferences-form"

export default function AccountPage() {
  const { user, isLoading, isAuthenticated, logout, updateUserProfile } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    title: "",
    experience: "",
    bio: "",
    tradingStyle: "",
    riskTolerance: "",
  })
  const [connectedBrokers, setConnectedBrokers] = useState<string[]>([])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }

    // Load user profile data
    if (user) {
      setProfileData({
        name: user.name || "",
        title: user.title || "Trader",
        experience: user.experience || "Intermediate",
        bio: user.bio || "",
        tradingStyle: user.tradingStyle || "Swing",
        riskTolerance: user.riskTolerance || "Medium",
      })

      // Load connected brokers from localStorage for demo
      const savedBrokers = localStorage.getItem("connected-brokers")
      if (savedBrokers) {
        setConnectedBrokers(JSON.parse(savedBrokers))
      }
    }
  }, [isLoading, isAuthenticated, router, user])

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

  const handleSaveProfile = async () => {
    try {
      // In a real app, this would call an API to update the user profile
      // For now, we'll just simulate success
      await updateUserProfile(profileData)
      setIsEditing(false)
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleBrokerConnection = (broker: string, isConnected: boolean) => {
    let updatedBrokers = [...connectedBrokers]

    if (isConnected && !updatedBrokers.includes(broker)) {
      updatedBrokers.push(broker)
    } else if (!isConnected) {
      updatedBrokers = updatedBrokers.filter((b) => b !== broker)
    }

    setConnectedBrokers(updatedBrokers)
    localStorage.setItem("connected-brokers", JSON.stringify(updatedBrokers))

    toast({
      title: isConnected ? `Connected to ${broker}` : `Disconnected from ${broker}`,
      description: isConnected
        ? `Your ${broker} account has been successfully connected.`
        : `Your ${broker} account has been disconnected.`,
    })
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

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between mb-6"
      >
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <Button variant="outline" onClick={handleLogout} className="mt-4 md:mt-0">
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </motion.div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-background/60 backdrop-blur">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-[#5EEAD4]/20 data-[state=active]:text-[#5EEAD4]"
          >
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="brokerages"
            className="data-[state=active]:bg-[#5EEAD4]/20 data-[state=active]:text-[#5EEAD4]"
          >
            <Wallet className="h-4 w-4 mr-2" />
            Brokerage Accounts
          </TabsTrigger>
          <TabsTrigger
            value="subscription"
            className="data-[state=active]:bg-[#5EEAD4]/20 data-[state=active]:text-[#5EEAD4]"
          >
            <Shield className="h-4 w-4 mr-2" />
            Subscription
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="data-[state=active]:bg-[#5EEAD4]/20 data-[state=active]:text-[#5EEAD4]"
          >
            <Settings className="h-4 w-4 mr-2" />
            Preferences
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:col-span-2"
            >
              <Card className="bg-background/60 backdrop-blur border-muted">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Trader Profile</CardTitle>
                    <CardDescription>Your professional trading profile information</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
                  >
                    {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        disabled={!isEditing}
                        className="bg-background/80"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Professional Title</Label>
                      <Input
                        id="title"
                        value={profileData.title}
                        onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                        disabled={!isEditing}
                        className="bg-background/80"
                        placeholder="e.g. Day Trader, Portfolio Manager"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <textarea
                      id="bio"
                      rows={4}
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      disabled={!isEditing}
                      className="w-full rounded-md border border-input bg-background/80 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Share your trading background, expertise, and approach..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="experience">Trading Experience</Label>
                      <Select
                        value={profileData.experience}
                        onValueChange={(value) => setProfileData({ ...profileData, experience: value })}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="bg-background/80">
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner (0-2 years)</SelectItem>
                          <SelectItem value="Intermediate">Intermediate (2-5 years)</SelectItem>
                          <SelectItem value="Advanced">Advanced (5-10 years)</SelectItem>
                          <SelectItem value="Expert">Expert (10+ years)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tradingStyle">Primary Trading Style</Label>
                      <Select
                        value={profileData.tradingStyle}
                        onValueChange={(value) => setProfileData({ ...profileData, tradingStyle: value })}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="bg-background/80">
                          <SelectValue placeholder="Select trading style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Day">Day Trading</SelectItem>
                          <SelectItem value="Swing">Swing Trading</SelectItem>
                          <SelectItem value="Position">Position Trading</SelectItem>
                          <SelectItem value="Scalping">Scalping</SelectItem>
                          <SelectItem value="Algorithmic">Algorithmic Trading</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                    <Select
                      value={profileData.riskTolerance}
                      onValueChange={(value) => setProfileData({ ...profileData, riskTolerance: value })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="bg-background/80">
                        <SelectValue placeholder="Select risk tolerance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Conservative">Conservative</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Aggressive">Aggressive</SelectItem>
                        <SelectItem value="Very Aggressive">Very Aggressive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-border/40 pt-6">
                  <div className="text-sm text-muted-foreground">
                    <Clock className="inline-block h-4 w-4 mr-1" />
                    Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                  </div>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveProfile} className="bg-[#5EEAD4] hover:bg-[#5EEAD4]/80 text-black">
                        Save Changes
                      </Button>
                    </div>
                  )}
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
                  <CardTitle>Account Summary</CardTitle>
                  <CardDescription>Your account details and status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div className="font-medium">{user?.email}</div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Subscription Status</div>
                    <div className="flex items-center space-x-2">
                      {getSubscriptionBadge()}
                      {(user?.subscriptionStatus === "active" || user?.subscriptionStatus === "lifetime") && (
                        <Shield className="h-4 w-4 text-[#5EEAD4]" />
                      )}
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Connected Brokerages</div>
                    <div className="font-medium">
                      {connectedBrokers.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {connectedBrokers.map((broker) => (
                            <Badge key={broker} className="bg-green-500/20 text-green-400 border-green-500/30">
                              {broker}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">No brokerages connected</span>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border/40 pt-6">
                  <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard")}>
                    <BarChart className="mr-2 h-4 w-4" />
                    Go to Dashboard
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* Brokerage Accounts Tab */}
        <TabsContent value="brokerages">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BrokerConnectionCard
                broker="Robinhood"
                description="Connect your Robinhood account to view and analyze your portfolio"
                icon="/robinhood-logo.png"
                isConnected={connectedBrokers.includes("Robinhood")}
                onConnectionChange={(isConnected) => handleBrokerConnection("Robinhood", isConnected)}
              />

              <BrokerConnectionCard
                broker="Webull"
                description="Connect your Webull account to view and analyze your portfolio"
                icon="/webull-logo.png"
                isConnected={connectedBrokers.includes("Webull")}
                onConnectionChange={(isConnected) => handleBrokerConnection("Webull", isConnected)}
              />
            </div>

            <Card className="bg-background/60 backdrop-blur border-muted mt-6">
              <CardHeader>
                <CardTitle>Connected Data</CardTitle>
                <CardDescription>Manage what data is synced from your brokerage accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Portfolio Holdings</div>
                      <div className="text-sm text-muted-foreground">Sync your current portfolio holdings</div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Transaction History</div>
                      <div className="text-sm text-muted-foreground">Import your past trades and transactions</div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Watchlists</div>
                      <div className="text-sm text-muted-foreground">Sync your watchlists from brokerages</div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Performance Metrics</div>
                      <div className="text-sm text-muted-foreground">Import your trading performance data</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border/40 pt-6">
                <div className="text-sm text-muted-foreground">
                  <Lock className="inline-block h-4 w-4 mr-1" />
                  Your data is securely encrypted and never shared with third parties
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="bg-background/60 backdrop-blur border-muted">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Subscription Details</CardTitle>
                  {getSubscriptionBadge()}
                </div>
                <CardDescription>Manage your TradeCraft AI Pro subscription</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {user?.subscriptionStatus === "active" || user?.subscriptionStatus === "lifetime" ? (
                  <>
                    <div className="bg-[#5EEAD4]/5 border border-[#5EEAD4]/20 rounded-lg p-4">
                      <h3 className="font-medium text-[#5EEAD4] mb-2 flex items-center">
                        <Shield className="h-5 w-5 mr-2" />
                        Pro Features Enabled
                      </h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <ChevronRight className="h-4 w-4 text-[#5EEAD4] mr-2" />
                          Advanced backtesting with unlimited historical data
                        </li>
                        <li className="flex items-center">
                          <ChevronRight className="h-4 w-4 text-[#5EEAD4] mr-2" />
                          AI-powered strategy optimization
                        </li>
                        <li className="flex items-center">
                          <ChevronRight className="h-4 w-4 text-[#5EEAD4] mr-2" />
                          Portfolio-specific insights and recommendations
                        </li>
                        <li className="flex items-center">
                          <ChevronRight className="h-4 w-4 text-[#5EEAD4] mr-2" />
                          Priority customer support
                        </li>
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Plan Type</div>
                        <div className="font-medium">
                          {user.subscriptionStatus === "lifetime" ? "Lifetime Access" : "Monthly Subscription"}
                        </div>
                      </div>

                      {user.subscriptionStatus === "active" && user.subscriptionExpires && (
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Next Billing Date</div>
                          <div className="font-medium flex items-center">
                            <CalendarClock className="h-4 w-4 mr-2 text-[#5EEAD4]" />
                            {new Date(user.subscriptionExpires).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Payment Method</div>
                      <div className="font-medium flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        •••• •••• •••• 4242
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                    <h3 className="text-lg font-medium mb-2">Upgrade to TradeCraft AI Pro</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Get unlimited access to all our professional trading tools and features, including your own
                      personalized Finance AI that adapts to your portfolio.
                    </p>
                    <Button
                      onClick={() => router.push("/pro")}
                      className="bg-[#FACC15] hover:bg-[#FACC15]/90 text-black"
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Upgrade to Pro
                    </Button>
                  </div>
                )}
              </CardContent>
              {(user?.subscriptionStatus === "active" || user?.subscriptionStatus === "lifetime") && (
                <CardFooter className="border-t border-border/40 pt-6 flex justify-between">
                  <Button variant="outline" className="text-red-400 hover:text-red-500 hover:bg-red-500/10">
                    Cancel Subscription
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open("https://billing.stripe.com/p/login/test_28o5nA9Oj8Oi9yw144", "_blank")}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Manage Billing
                  </Button>
                </CardFooter>
              )}
            </Card>
          </motion.div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-background/60 backdrop-blur border-muted">
                <CardHeader>
                  <CardTitle>Trading Preferences</CardTitle>
                  <CardDescription>Customize your trading experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <TradingPreferencesForm />
                </CardContent>
              </Card>

              <Card className="bg-background/60 backdrop-blur border-muted">
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Manage your notification preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Price Alerts</div>
                      <div className="text-sm text-muted-foreground">Receive alerts when prices hit your targets</div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Trading Signals</div>
                      <div className="text-sm text-muted-foreground">
                        Get notified about potential trading opportunities
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Market News</div>
                      <div className="text-sm text-muted-foreground">Receive important market news and updates</div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Portfolio Updates</div>
                      <div className="text-sm text-muted-foreground">Daily summary of your portfolio performance</div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="mt-6 space-y-2">
                    <Label htmlFor="notification-method">Notification Method</Label>
                    <Select defaultValue="both">
                      <SelectTrigger className="bg-background/80">
                        <SelectValue placeholder="Select notification method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email Only</SelectItem>
                        <SelectItem value="push">Push Notifications Only</SelectItem>
                        <SelectItem value="both">Both Email and Push</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border/40 pt-6">
                  <Button className="w-full bg-[#5EEAD4] hover:bg-[#5EEAD4]/80 text-black">
                    <Bell className="mr-2 h-4 w-4" />
                    Save Notification Preferences
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <Card className="bg-background/60 backdrop-blur border-muted mt-6">
              <CardHeader>
                <CardTitle>Display Settings</CardTitle>
                <CardDescription>Customize your dashboard appearance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="chart-type">Default Chart Type</Label>
                    <Select defaultValue="candlestick">
                      <SelectTrigger className="bg-background/80">
                        <SelectValue placeholder="Select chart type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="candlestick">Candlestick</SelectItem>
                        <SelectItem value="line">Line Chart</SelectItem>
                        <SelectItem value="bar">Bar Chart</SelectItem>
                        <SelectItem value="heikin-ashi">Heikin-Ashi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time-frame">Default Time Frame</Label>
                    <Select defaultValue="1D">
                      <SelectTrigger className="bg-background/80">
                        <SelectValue placeholder="Select time frame" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1m">1 Minute</SelectItem>
                        <SelectItem value="5m">5 Minutes</SelectItem>
                        <SelectItem value="15m">15 Minutes</SelectItem>
                        <SelectItem value="1H">1 Hour</SelectItem>
                        <SelectItem value="1D">1 Day</SelectItem>
                        <SelectItem value="1W">1 Week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Dark Mode</div>
                    <div className="text-sm text-muted-foreground">Use dark theme for all screens</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Compact View</div>
                    <div className="text-sm text-muted-foreground">Show more data in less space</div>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Show Advanced Indicators</div>
                    <div className="text-sm text-muted-foreground">
                      Display technical indicators on charts by default
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
              <CardFooter className="border-t border-border/40 pt-6">
                <Button className="w-full bg-[#5EEAD4] hover:bg-[#5EEAD4]/80 text-black">
                  <Save className="mr-2 h-4 w-4" />
                  Save Display Settings
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
