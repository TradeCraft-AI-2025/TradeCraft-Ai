"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, Menu, LogOut, User, LayoutDashboard, Shield, Zap } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { Logo } from "@/components/logo"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function SiteHeader() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, user, isPro } = useAuth()

  const routes = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/pro", label: "Pro Tools" },
  ]

  // Update the return statement to include authentication status
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Logo className="mr-6" />
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === route.href ? "text-foreground" : "text-foreground/60",
                )}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Mobile logo and menu */}
            <div className="flex items-center md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2" aria-label="Menu">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="pr-0">
                  <Logo className="mb-8" variant="default" />
                  <nav className="flex flex-col space-y-4">
                    {routes.map((route) => (
                      <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                          "flex items-center py-2 text-base font-medium transition-colors hover:text-foreground/80",
                          pathname === route.href ? "text-foreground" : "text-foreground/60",
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        {route.label}
                        {pathname === route.href && <ChevronRight className="ml-2 h-4 w-4" />}
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>

              <Logo variant="small" className="md:hidden" />
            </div>
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user?.name || "User"} />
                      <AvatarFallback className="bg-slate-700 text-cyan-500">
                        {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline-block">{user?.name || user?.email}</span>
                    {isPro && <Badge className="ml-1 bg-[#5EEAD4]/20 text-[#5EEAD4] hover:bg-[#5EEAD4]/30">Pro</Badge>}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-black/80 backdrop-blur-md border-white/10">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <Link href="/account">
                    <DropdownMenuItem className="cursor-pointer hover:bg-[#5EEAD4]/10">
                      <User className="h-4 w-4 mr-2" />
                      Account Settings
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/dashboard">
                    <DropdownMenuItem className="cursor-pointer hover:bg-[#5EEAD4]/10">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                  </Link>
                  {isPro ? (
                    <Link href="/pro">
                      <DropdownMenuItem className="cursor-pointer hover:bg-[#5EEAD4]/10">
                        <Shield className="h-4 w-4 mr-2" />
                        Pro Tools
                      </DropdownMenuItem>
                    </Link>
                  ) : (
                    <Link href="/pro">
                      <DropdownMenuItem className="cursor-pointer hover:bg-[#5EEAD4]/10">
                        <Zap className="h-4 w-4 mr-2" />
                        Upgrade to Pro
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-red-500/10 focus:bg-red-500/10"
                    onClick={async () => {
                      try {
                        await fetch("/api/auth/logout", { method: "POST" })
                        window.location.href = "/"
                      } catch (error) {
                        console.error("Logout error:", error)
                      }
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2 hidden md:flex border-[#5EEAD4]/30 hover:border-[#5EEAD4]/50 hover:bg-[#5EEAD4]/10"
                  >
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-[#FACC15] hover:bg-[#FACC15]/90 text-black">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
