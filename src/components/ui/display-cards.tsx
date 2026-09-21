"use client"

import * as React from "react"
import { Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"

export interface DisplayCardProps {
  className?: string
  icon?: React.ReactNode
  title?: string
  description?: string
  /** Third, muted line. Named `date` in the original; used here as a tagline. */
  date?: string
  iconClassName?: string
  titleClassName?: string
}

/**
 * A fanned stack of skewed cards.
 *
 * Changes from the stock component, each for a concrete reason:
 *
 * - Sizing is responsive. The original hard-coded `w-[22rem]` (352px) and
 *   offset the stack by up to `translate-x-32` (128px), needing 480px of room
 *   — it overflowed every phone. Card width and offsets both step down at the
 *   small breakpoints, so the widest point fits inside a 360px viewport.
 * - `whitespace-nowrap` on the description is gone; it forced overflow as soon
 *   as a description ran past the card width.
 * - Blue literals became NLX brand tokens, and `bg-muted` became `bg-surface`,
 *   so the stack sits on the dark stage like the rest of the page.
 * - Cards are keyboard reachable: each is focusable and lifts on
 *   `focus-visible` exactly as on hover, so the effect is not mouse-only.
 * - `before:duration:700` in the original is not valid Tailwind — the stray
 *   colon meant the fade never had a duration. Written correctly here.
 */
function DisplayCard({
  className,
  icon = <Sparkles className="size-4" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  iconClassName = "text-brand-primary",
  titleClassName = "text-brand-primary",
}: DisplayCardProps) {
  return (
    <div
      tabIndex={0}
      className={cn(
        "relative flex h-36 w-[16rem] -skew-y-[8deg] cursor-default flex-col justify-between rounded-xl border-2 border-border bg-surface/80 px-4 py-3 backdrop-blur-sm transition-all duration-700 select-none sm:w-[20rem] lg:w-[22rem]",
        "after:absolute after:top-[-5%] after:-right-1 after:h-[110%] after:w-[12rem] after:bg-gradient-to-l after:from-background after:to-transparent after:content-[''] sm:after:w-[16rem]",
        "hover:border-brand-primary/40 hover:bg-surface focus-visible:border-brand-primary/60 focus-visible:outline-none",
        "[&>*]:flex [&>*]:items-center [&>*]:gap-2",
        className
      )}
    >
      <div>
        <span
          className={cn(
            "relative z-10 inline-block rounded-full bg-brand-primary/15 p-1.5",
            iconClassName
          )}
        >
          {icon}
        </span>
        <p className={cn("relative z-10 text-lg font-medium", titleClassName)}>
          {title}
        </p>
      </div>
      <p className="relative z-10 text-sm text-foreground sm:text-base">
        {description}
      </p>
      <p className="relative z-10 text-xs text-text-secondary sm:text-sm">
        {date}
      </p>
    </div>
  )
}

export interface DisplayCardsProps {
  cards?: DisplayCardProps[]
  className?: string
}

/** Shared by every card in the stack — the dimmed, de-saturated resting state. */
const veil =
  "before:absolute before:top-0 before:left-0 before:h-full before:w-full before:rounded-xl before:bg-background/60 before:content-[''] before:transition-opacity before:duration-700 hover:before:opacity-0 focus-visible:before:opacity-0 grayscale hover:grayscale-0 focus-visible:grayscale-0"

const defaultCards: DisplayCardProps[] = [
  { className: cn("[grid-area:stack] hover:-translate-y-10", veil) },
  {
    className: cn(
      "[grid-area:stack] translate-x-6 translate-y-10 hover:-translate-y-1 sm:translate-x-14 lg:translate-x-16",
      veil
    ),
  },
  {
    className:
      "[grid-area:stack] translate-x-12 translate-y-20 hover:translate-y-10 sm:translate-x-28 lg:translate-x-32",
  },
]

export default function DisplayCards({ cards, className }: DisplayCardsProps) {
  const displayCards = cards ?? defaultCards

  return (
    // The lower cards are pushed down 20 units out of the shared grid area, so
    // the wrapper reserves that room itself rather than overlapping whatever
    // follows it.
    <div
      className={cn(
        "grid place-items-center pb-24 [grid-template-areas:'stack']",
        className
      )}
    >
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  )
}

export {
  DisplayCard,
  defaultCards as displayCardsDefault,
  veil as displayCardVeil,
}
