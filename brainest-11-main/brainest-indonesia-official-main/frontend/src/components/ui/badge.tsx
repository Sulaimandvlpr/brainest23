import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-cyan bg-blue-gradient text-white px-3 py-1 text-xs font-semibold shadow-3d transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-offset-2 hover:shadow-3d-hover hover:-translate-y-0.5",
  {
    variants: {
      variant: {
        default:
          "border-cyan bg-blue-gradient text-white",
        secondary:
          "border-blue-3d bg-blue-3d-light text-white",
        destructive:
          "border-red bg-red-500 text-white",
        outline: "border-cyan bg-transparent text-cyan",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
