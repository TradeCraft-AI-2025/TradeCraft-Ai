"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Lock, Wallet, ExternalLink } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BrokerConnectionCardProps {
  broker: string
  description: string
  icon: string
  isConnected: boolean
  onConnectionChange: (isConnected: boolean) => void
}

export function BrokerConnectionCard({
  broker,
  description,
  icon,
  isConnected,
  onConnectionChange,
}: BrokerConnectionCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    code: "",
  })

  const handleConnect = async () => {
    setShowAuthDialog(true)
  }

  const handleDisconnect = async () => {
    setIsLoading(true)

    // Simulate API call to disconnect
    setTimeout(() => {
      onConnectionChange(false)
      setIsLoading(false)

      // Remove from localStorage
      localStorage.removeItem(`tradecraft-broker-${broker.toLowerCase()}`)
    }, 1500)
  }

  const handleSubmitCredentials = async () => {
    setIsLoading(true)
    setShowAuthDialog(false)

    // Simulate API call to connect
    setTimeout(() => {
      onConnectionChange(true)
      setIsLoading(false)

      // Save to localStorage
      localStorage.setItem(`tradecraft-broker-${broker.toLowerCase()}`, "connected")

      // Reset credentials
      setCredentials({
        username: "",
        password: "",
        code: "",
      })
    }, 2000)
  }

  return (
    <>
      <Card className="bg-background/60 backdrop-blur border-muted">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-md bg-background/80 flex items-center justify-center">
              {icon ? (
                <Image src={icon || "/placeholder.svg"} alt={broker} width={32} height={32} className="rounded-sm" />
              ) : (
                <Wallet className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <CardTitle>{broker}</CardTitle>
              <CardDescription>Brokerage Integration</CardDescription>
            </div>
          </div>
          {isConnected ? (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Connected</Badge>
          ) : (
            <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">Disconnected</Badge>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>

          {isConnected && (
            <div className="bg-background/40 rounded-md p-3 border border-border/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">Last Synced</div>
                <div className="text-xs">{new Date().toLocaleTimeString()}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">Account Type</div>
                <div className="text-xs">Margin</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">Holdings</div>
                <div className="text-xs">12 Assets</div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t border-border/40 pt-6">
          {isConnected ? (
            <div className="w-full flex flex-col space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open(`https://${broker.toLowerCase()}.com`, "_blank")}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open {broker}
              </Button>
              <Button
                variant="outline"
                className="w-full text-red-400 hover:text-red-500 hover:bg-red-500/10"
                onClick={handleDisconnect}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Disconnecting...
                  </>
                ) : (
                  <>Disconnect {broker}</>
                )}
              </Button>
            </div>
          ) : (
            <Button
              className="w-full bg-[#5EEAD4] hover:bg-[#5EEAD4]/80 text-black"
              onClick={handleConnect}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect {broker}
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="bg-background/95 backdrop-blur border-border">
          <DialogHeader>
            <DialogTitle>Connect to {broker}</DialogTitle>
            <DialogDescription>Enter your {broker} credentials to securely connect your account</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="col-span-3 bg-background/80"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="col-span-3 bg-background/80"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                2FA Code
              </Label>
              <Input
                id="code"
                value={credentials.code}
                onChange={(e) => setCredentials({ ...credentials, code: e.target.value })}
                className="col-span-3 bg-background/80"
                placeholder="Optional"
              />
            </div>
            <div className="col-span-4 flex items-center space-x-2 mt-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                Your credentials are securely encrypted and never stored on our servers
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAuthDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitCredentials}
              className="bg-[#5EEAD4] hover:bg-[#5EEAD4]/80 text-black"
              disabled={!credentials.username || !credentials.password}
            >
              Connect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
