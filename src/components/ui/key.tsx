import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// A calculator key with an optional 2nd-function legend printed above it.
// Leave room above for the legend (~0.9rem) wherever these are laid out.
function Key({
  legend,
  legendTone = "yellow",
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button> & {
  legend?: string
  legendTone?: "yellow" | "teal"
}) {
  return (
    <Button className={cn("uppercase", className)} {...props}>
      {legend && (
        <span className={cn("key-legend", legendTone === "teal" && "key-legend-alt")}>{legend}</span>
      )}
      {children}
    </Button>
  )
}

export { Key }
