"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  variant?: "default" | "small" | "large"
  animated?: boolean
  className?: string
}

export function Logo({ variant = "default", animated = true, className = "" }: LogoProps) {
  const sizes = {
    small: { container: "h-8", logo: 24, text: "text-lg" },
    default: { container: "h-10", logo: 32, text: "text-xl" },
    large: { container: "h-16", logo: 48, text: "text-3xl" },
  }

  const currentSize = sizes[variant]

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
            src="/logo-icon.png"
            alt="TradeCraft AI Logo"
            width={currentSize.logo}
            height={currentSize.logo}
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
          src="/logo-icon.png"
          alt="TradeCraft AI Logo"
          width={currentSize.logo}
          height={currentSize.logo}
          className="object-contain"
        />
      )}

      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`font-bold ${currentSize.text} tracking-wider`}
      >
        <span className="text-foreground">Trade</span>
        <span className="text-[#5EEAD4]">Craft</span>
        <span className="text-foreground ml-1">AI</span>
      </motion.div>
    </Link>
  )
}
