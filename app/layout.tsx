import type React from "react"
import type { Metadata } from "next"
import { Montserrat, Playfair_Display } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth-context"
import { ProProvider } from "@/lib/pro-context"

// Primary font - Montserrat for modern, luxury feel
const fontSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

// Secondary font - Playfair Display for luxury accents
const fontSerif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
})

export const metadata: Metadata = {
  title: "TradeCraft AI | Your AI-Powered Trading Terminal",
  description: "Advanced trading platform with AI-powered insights and analysis",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable, fontSerif.variable)}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>
            <ProProvider>
              <div className="relative flex min-h-screen flex-col bg-black">
                <div className="h-8"></div> {/* Add space for the status strip */}
                <SiteHeader />
                <div className="relative flex-1 z-10">{children}</div>
                <SiteFooter />
                <Toaster />
              </div>
            </ProProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
