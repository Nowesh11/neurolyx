"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { useRevealOnce } from "@/hooks/use-reveal-once"

/**
 * The one editorial accent: a word or two in the serif italic, in gold.
 * Used inside headlines only — never for whole sentences.
 */
export function Accent({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "font-serif font-normal tracking-[-0.01em] text-brand-primary italic",
        className
      )}
    >
      {children}
    </span>
  )
}

/**
 * Index + label line that opens every section: `01 ── What we do`.
 * The running number gives the long page a sense of chapters.
 */
export function SectionLabel({
  index,
  children,
  className,
}: {
  index: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 text-[11px] font-medium tracking-[0.22em] text-text-muted uppercase",
        className
      )}
    >
      <span className="font-mono tracking-normal text-brand-primary">
        {index}
      </span>
      <span aria-hidden className="h-px w-10 bg-border-strong" />
      {children}
    </p>
  )
}

export function SectionTitle({
  children,
  className,
  as: Tag = "h2",
}: {
  children: React.ReactNode
  className?: string
  as?: "h2" | "h3"
}) {
  return (
    <Tag
      className={cn(
        "text-[clamp(2.25rem,5vw,4.25rem)] leading-[1.02] font-medium tracking-[-0.035em] text-balance text-foreground",
        className
      )}
    >
      {children}
    </Tag>
  )
}

/**
 * Fades its children up the first time they scroll into view. Wraps
 * `useRevealOnce`, which has a scroll fallback so content can never be
 * stranded invisible if IntersectionObserver never fires.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: "div" | "li" | "article"
}) {
  const { ref, revealed } = useRevealOnce<HTMLElement>(0.15)
  return (
    <Tag
      // The hook is typed to HTMLElement; every allowed tag is one.
      ref={ref as React.RefObject<never>}
      style={{ transitionDelay: revealed ? `${delay}ms` : "0ms" }}
      className={cn(
        "transition-[opacity,translate,filter] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        revealed
          ? "translate-y-0 opacity-100 blur-0"
          : "translate-y-8 opacity-0 blur-[6px] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:blur-0",
        className
      )}
    >
      {children}
    </Tag>
  )
}
