import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full min-w-0 rounded-lg border border-border bg-surface-muted/60 px-3 py-2 text-sm text-foreground shadow-sm transition-colors outline-none",
        "placeholder:text-text-muted",
        "file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
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

export { Input }
