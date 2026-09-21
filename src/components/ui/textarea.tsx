import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full rounded-lg border border-border bg-surface-muted/60 px-3 py-2 text-sm text-foreground shadow-sm transition-colors outline-none",
        "placeholder:text-text-muted",
        "hover:border-border-strong",
        "focus-visible:border-brand-primary focus-visible:ring-3 focus-visible:ring-brand-primary/25",
        "disabled:pointer-events-none disabled:opacity-50",
        "aria-invalid:border-error aria-invalid:ring-3 aria-invalid:ring-error/20",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
