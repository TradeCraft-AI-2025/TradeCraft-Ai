"use client"

import { motion } from "framer-motion"
import { Logo } from "@/components/logo"

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black to-slate-900 flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Logo variant="large" />
        </motion.div>

        <motion.div
          className="mt-8 relative h-2 w-48 bg-slate-800 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#5EEAD4] to-[#00FFFF]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
          />
        </motion.div>

        <motion.div
          className="mt-4 text-[#5EEAD4] font-mono text-sm tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          INITIALIZING TRADECRAFT AI
        </motion.div>
      </div>
    </div>
  )
}
