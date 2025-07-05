"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useTheme } from "next-themes"

interface AnimatedLogoProps {
  size?: number
  className?: string
}

export function AnimatedLogo({ size = 32, className = "" }: AnimatedLogoProps) {
  const { theme } = useTheme()

  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, rotate: -180 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{
        duration: 0.8,
        type: "spring",
        stiffness: 100,
        opacity: { duration: 0.3 },
      }}
    >
      <motion.div
        animate={{
          boxShadow: ["0 0 0 0 rgba(0, 255, 64, 0)", "0 0 0 10px rgba(0, 255, 64, 0.1)", "0 0 0 0 rgba(0, 255, 64, 0)"],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        }}
        className="rounded-full"
      >
        <Image
          src="/logo.png"
          alt="Easytrade Logo"
          width={size}
          height={size}
          className={`rounded-full ${theme === "dark" ? "brightness-110 contrast-110" : ""}`}
          priority
        />
      </motion.div>
    </motion.div>
  )
}
