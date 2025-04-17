"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  variant?: "default" | "small" | "large"
  animated?: boolean
  className?: string
  src?: string | null
}

export function Logo({ variant = "default", animated = true, className = "", src = null }: LogoProps) {
  const sizes = {
    small: { container: "h-8", logo: { width: 24, height: 24 }, text: "text-lg" },
    default: { container: "h-10", logo: { width: 32, height: 32 }, text: "text-xl" },
    large: { container: "h-16", logo: { width: 48, height: 48 }, text: "text-3xl" },
  }

  const currentSize = sizes[variant]

  // Use the provided src or default to the logo.png
  const logoSrc = src || "/logo.png"

  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      {animated ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <Image
            src={logoSrc || "/placeholder.svg"}
            alt="TradeCraft AI Logo"
            width={currentSize.logo.width * 2}
            height={currentSize.logo.height * 2}
            className="object-contain"
          />
          <motion.div
            className="absolute inset-0 bg-[#00FFFF]/20 blur-md rounded-full"
            animate={{
              opacity: [0.5, 0.8, 0.5],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        </motion.div>
      ) : (
        <Image
          src={logoSrc || "/placeholder.svg"}
          alt="TradeCraft AI Logo"
          width={currentSize.logo.width * 2}
          height={currentSize.logo.height * 2}
          className="object-contain"
        />
      )}
    </Link>
  )
}
