import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input w-full min-w-0 rounded-sm border bg-transparent px-3 py-1 transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
  {
    variants: {
      size: {
        default: "h-9 text-base",
        sm: "h-8 text-sm",
        lg: "h-11 text-base",
      },
      surface: {
        default: "",
        lcd: "h-8 rounded-none border-0 border-b-2 border-dashed border-lcd-ink/35 bg-transparent px-1 font-lcd text-base text-lcd-ink shadow-none selection:bg-lcd-ink selection:text-lcd-bg focus-visible:border-solid focus-visible:border-lcd-ink focus-visible:ring-0 aria-invalid:border-lcd-ink aria-invalid:ring-0",
      },
    },
    defaultVariants: {
      size: "default",
      surface: "default",
    },
  }
)

function Input({
  className,
  type,
  size,
  surface,
  ...props
}: Omit<React.ComponentProps<"input">, "size"> & VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ size, surface, className }))}
      {...props}
    />
  )
}

export { Input, inputVariants }
