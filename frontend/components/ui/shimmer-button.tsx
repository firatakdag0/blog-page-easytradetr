import React from "react"
import { cn } from "@/lib/utils"

export interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  shimmerDuration?: string
  background?: string
  className?: string
  children?: React.ReactNode
}

const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "#ffffff",
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "100px",
      background = "rgba(16, 185, 129, 1)",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        style={
          {
            "--shimmer-color": shimmerColor,
            "--shimmer-size": shimmerSize,
            "--shimmer-duration": shimmerDuration,
            "--border-radius": borderRadius,
            "--background": background,
          } as React.CSSProperties
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/10 px-6 py-3 text-white [background:var(--background)] [border-radius:var(--border-radius)]",
          "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-[1px]",
          className,
        )}
        ref={ref}
        {...props}
      >
        {/* spark container */}
        <div className="-z-30 blur-[2px]">
          <div className="absolute inset-0 overflow-visible [mask-image:linear-gradient(white,transparent)]">
            <div className="absolute h-[200%] w-[200%] rotate-[-10deg] animate-spin-around [background:conic-gradient(from_0deg,transparent_0_340deg,var(--shimmer-color)_360deg)] [translate:-50%_-15%]" />
          </div>
        </div>

        {/* backdrop */}
        <div className="absolute -z-20 [background:var(--background)] [border-radius:var(--border-radius)] [inset:var(--shimmer-size)]" />

        {/* content */}
        <div className="z-10">{children}</div>

        {/* Highlight */}
        <div className="absolute -z-10 rounded-full bg-white/30 [filter:blur(12px)] [inset:var(--shimmer-size)] group-hover:[inset:calc(var(--shimmer-size)*0.6)]" />
      </button>
    )
  },
)

ShimmerButton.displayName = "ShimmerButton"

export { ShimmerButton }
