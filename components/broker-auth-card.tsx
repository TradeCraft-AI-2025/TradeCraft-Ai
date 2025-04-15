"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Loader2, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { mockAuthWithBroker } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"

interface BrokerAuthCardProps {
  provider: "robinhood" | "webull"
  title: string
  description: string
  icon: string
}

export function BrokerAuthCard({ provider, title, description, icon }: BrokerAuthCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleConnect = async () => {
    setIsLoading(true)

    try {
      // Mock OAuth flow
      await mockAuthWithBroker(provider)

      toast({
        title: "Account connected successfully!",
        description: `Your ${title} account has been connected.`,
        variant: "default",
      })

      // Redirect to portfolio page
      router.push("/portfolio")
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "There was an error connecting your account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-background p-2 w-12 h-12 flex items-center justify-center">
            <Image src={icon || "/placeholder.svg"} alt={title} width={40} height={40} className="rounded-md" />
          </div>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>Connect your account</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
            <span>View your portfolio holdings</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
            <span>Track performance and P/L</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
            <span>Read-only access (no trading)</span>
          </li>
        </ul>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="outline" disabled={isLoading}>
          Learn more
        </Button>
        <Button onClick={handleConnect} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="mr-2 h-4 w-4" />
              Connect
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
