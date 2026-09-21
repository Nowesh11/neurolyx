"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Staggered scroll reveal. Children declare their place in the sequence with
 * `animationNum`, which becomes a CSS transition delay, and they all watch the
 * one container passed as `timelineRef`.
 *
 * This component was referenced by the pricing section but never supplied with
 * it, so it is written here to that call signature.
 *
 * Why CSS transitions rather than framer-motion variants, which is how the
 * original was built:
 *
 * 1. Hydration. A motion element with `initial="hidden"` is server-rendered
 *    carrying `style="opacity:0"`. Any client-side branch that renders
 *    something different — reading `prefers-reduced-motion`, for instance —
 *    mismatches, and React does not patch up mismatched attributes. The
 *    server's `opacity: 0` then sticks and the section is invisible forever.
 *    Here the markup is identical on both sides: `revealed` starts `false`
 *    everywhere and only flips after mount.
 *
 * 2. Reduced motion. `motion-reduce:transition-none` skips the animation while
 *    still applying the final state, so the content is simply *there*. With
 *    variants this is easy to get wrong, because a `transition` declared
 *    inside a variant silently overrides the one passed as a prop.
 *
 * 3. Robustness. A class swap needs one React render. A variant animation
 *    needs a live `requestAnimationFrame` loop, which a backgrounded tab
 *    freezes — leaving content stranded at `opacity: 0`.
 *
 * This mirrors `use-reveal-once.ts`, which guards the same failure mode for
 * the other sections; the difference is that this one shares a single trigger
 * across many children so their stagger stays in step.
 */
function useTimelineReveal(
  timelineRef: React.RefObject<HTMLElement | null>,
  once: boolean
) {
  const [revealed, setRevealed] = React.useState(false)

  React.useEffect(() => {
    const el = timelineRef.current
    if (!el) {
      // No container to watch — show rather than hide the content.
      const t = window.setTimeout(() => setRevealed(true), 0)
      return () => window.clearTimeout(t)
    }
    if (revealed && once) return

    const checkInView = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 0
      if (rect.top < vh * 0.9 && rect.bottom > 0) setRevealed(true)
      else if (!once) setRevealed(false)
    }

    let io: IntersectionObserver | undefined
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) setRevealed(true)
          else if (!once) setRevealed(false)
        },
        { threshold: 0.05 }
      )
      io.observe(el)
    }

    // Deferred rather than inline: setting state synchronously in an effect
    // body triggers a cascading render.
    const timer = window.setTimeout(checkInView, 0)
    // Last-resort net — observer callbacks ride the rendering lifecycle and a
    // hidden tab never delivers them.
    const fallback = window.setTimeout(() => setRevealed(true), 1500)
    window.addEventListener("scroll", checkInView, { passive: true })
    window.addEventListener("resize", checkInView, { passive: true })

    return () => {
      io?.disconnect()
      window.clearTimeout(timer)
      window.clearTimeout(fallback)
      window.removeEventListener("scroll", checkInView)
      window.removeEventListener("resize", checkInView)
    }
  }, [timelineRef, once, revealed])

  return revealed
}

type TimelineContentProps<T extends React.ElementType> = {
  as?: T
  children?: React.ReactNode
  /** Position in the stagger — 0 reveals first. */
  animationNum: number
  timelineRef: React.RefObject<HTMLElement | null>
  className?: string
  once?: boolean
  /** Milliseconds between each step of the stagger. */
  step?: number
} & Omit<
  React.ComponentPropsWithoutRef<T>,
  "as" | "children" | "className" | "ref"
>

export function TimelineContent<T extends React.ElementType = "div">({
  as,
  children,
  animationNum,
  timelineRef,
  className,
  once = true,
  step = 110,
  ...rest
}: TimelineContentProps<T>) {
  const revealed = useTimelineReveal(timelineRef, once)

  type LooseProps = Record<string, unknown> & { children?: React.ReactNode }
  const Tag = (as ?? "div") as unknown as React.ComponentType<LooseProps>

  return (
    <Tag
      className={cn(
        "transition-[opacity,transform,filter] duration-500 ease-out motion-reduce:transition-none",
        revealed
          ? "translate-y-0 opacity-100 blur-none"
          : "-translate-y-5 opacity-0 blur-[10px]",
        className
      )}
      style={{ transitionDelay: revealed ? `${animationNum * step}ms` : "0ms" }}
      {...(rest as LooseProps)}
    >
      {children}
    </Tag>
  )
}

export default TimelineContent
