import Link from "next/link"
import Image from "next/image"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-8 md:py-12">
      <div className="container px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <Image src="/logo-neon.png" alt="TradeCraft" width={40} height={40} className="mr-2" />
              <span className="font-bold text-lg">TradeCraft</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Portfolio intelligence for self-directed investors. Understand what you own.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-[#5EEAD4]">Home</Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-muted-foreground hover:text-[#5EEAD4]">Portfolio</Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-[#5EEAD4]">Overview</Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-[#5EEAD4]">Pricing</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border/40 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TradeCraft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
