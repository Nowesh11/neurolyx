"use client"

import * as React from "react"
import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"

import { cn } from "@/lib/utils"

/**
 * Built on `@base-ui/react` to match the rest of this project's primitives.
 *
 * Base UI marks state with `data-checked` / `data-unchecked` (Radix uses
 * `data-state`). Passing `name` to the group makes it submit inside a plain
 * `<form>`, which is what the contact Server Action reads.
 */
function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive>) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid gap-2", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioPrimitive.Root>) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "flex size-4 shrink-0 items-center justify-center rounded-full border border-border-strong bg-surface-muted p-0 text-brand-primary shadow-sm transition-colors outline-none",
        "data-checked:border-brand-primary data-checked:bg-brand-primary data-checked:text-primary-foreground",
        "focus-visible:ring-3 focus-visible:ring-brand-primary/30",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator className="flex items-center justify-center data-unchecked:hidden before:size-1.5 before:rounded-full before:bg-current" />
    </RadioPrimitive.Root>
  )
}

/**
 * A full-width selectable card wrapping a radio. Used for the "what are you
 * looking for" choices, where the options deserve more room than a bare dot
 * and a word.
 */
function RadioGroupCard({
  value,
  label,
  hint,
  className,
}: {
  value: string
  label: string
  hint?: string
  className?: string
}) {
  return (
    <label
      className={cn(
        "group relative flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-surface-muted/40 p-3.5 transition-all",
        "hover:border-border-strong hover:bg-surface-muted/70",
        // `:has()` lets the whole card react to the radio inside it without
        // mirroring the checked state into React.
        "has-data-checked:border-brand-primary/60 has-data-checked:bg-brand-primary/10",
        "has-data-checked:shadow-[0_0_0_1px_var(--brand-primary)]",
        "has-focus-visible:ring-3 has-focus-visible:ring-brand-primary/30",
        className
      )}
    >
      <RadioGroupItem value={value} className="mt-0.5" />
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {hint ? (
          <span className="text-xs leading-snug text-text-secondary">
            {hint}
          </span>
        ) : null}
      </span>
    </label>
  )
}

export { RadioGroup, RadioGroupItem, RadioGroupCard }
