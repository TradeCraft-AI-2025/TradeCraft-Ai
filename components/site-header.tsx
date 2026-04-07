"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart2, ChevronDown, ChevronRight, Menu, LogOut, LayoutDashboard, Zap } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { usePro } from "@/lib/pro-context"
import { createBrowserSupabaseClient } from "@/lib/supabase-browser"
import Image from "next/image"
import type { User } from "@supabase/supabase-js"

export function SiteHeader() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const { isPro } = usePro()

  useEffect(() => {
    const supabase = createBrowserSupabaseClient()

    supabase.auth.getUser().then(({ data }) => setUser(data.user))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [scrolled])

  const handleLogout = async () => {
    const supabase = createBrowserSupabaseClient()
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  const routes = [
    { href: "/", label: "Home" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/dashboard", label: "Overview" },
    { href: "/pricing", label: "Pricing" },
  ]

  const displayName = user?.email ?? "User"
  const initial = user?.email?.charAt(0)?.toUpperCase() ?? "U"

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          : "bg-background",
      )}
    >
      <div className="container flex h-16 items-center px-4 sm:px-6">
        <div className="mr-4 hidden md:flex">
          <Image src="/logo-neon.png" alt="TradeCraft" width={48} height={48} className="mr-2" />
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
            <div className="flex items-center justify-between md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2" aria-label="Menu">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="pr-0">
                  <Image src="/logo-neon.png" alt="TradeCraft" width={48} height={48} className="mr-2" />
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
                  <div className="mt-6 flex items-center">
                    <ThemeToggle />
                    <span className="ml-2 text-sm font-medium">Theme</span>
                  </div>
                </SheetContent>
              </Sheet>

              <Image src="/logo-neon.png" alt="TradeCraft" width={48} height={48} className="mr-2" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-slate-700 text-cyan-500">{initial}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline-block text-sm truncate max-w-[150px]">{displayName}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 border-border">
                  <DropdownMenuLabel className="text-xs text-muted-foreground truncate">{user?.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/portfolio">
                    <DropdownMenuItem className="cursor-pointer hover:bg-[#5EEAD4]/10">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Portfolio
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/dashboard">
                    <DropdownMenuItem className="cursor-pointer hover:bg-[#5EEAD4]/10">
                      <BarChart2 className="h-4 w-4 mr-2" />
                      Overview
                    </DropdownMenuItem>
                  </Link>
                  {!isPro && (
                    <Link href="/pricing">
                      <DropdownMenuItem className="cursor-pointer hover:bg-[#5EEAD4]/10">
                        <Zap className="h-4 w-4 mr-2" />
                        Upgrade to Pro
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-red-500/10 focus:bg-red-500/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button size="sm" className="bg-[#FACC15] hover:bg-[#FACC15]/90 text-black">
                  Sign in
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
