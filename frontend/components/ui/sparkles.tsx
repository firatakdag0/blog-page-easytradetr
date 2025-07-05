"use client"

import { useId } from "react"
import { cn } from "@/lib/utils"

interface SparklesProps {
  id?: string
  className?: string
  background?: string
  minSize?: number
  maxSize?: number
  particleDensity?: number
  particleColor?: string
  particleSpeed?: number
}

export const SparklesCore = (props: SparklesProps) => {
  const {
    id,
    className,
    background = "transparent",
    minSize = 0.4,
    maxSize = 1,
    particleDensity = 1200,
    particleColor = "#FFF",
    particleSpeed = 1,
  } = props
  const generateId = useId()
  return (
    <div className={cn("opacity-0", className)}>
      <div
        style={{
          background,
        }}
        className="absolute inset-0"
      >
        <svg className="h-full w-full" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={id || generateId} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="1" height="1" fill={particleColor} fillOpacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${id || generateId})`} />
        </svg>
      </div>
    </div>
  )
}

export const Sparkles = ({ className, ...props }: SparklesProps) => {
  return (
    <SparklesCore
      background="transparent"
      minSize={0.4}
      maxSize={1}
      particleDensity={1200}
      className={cn("w-full h-full", className)}
      particleColor="#FFFFFF"
      {...props}
    />
  )
}
