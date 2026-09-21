"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Reveals a section once, the first time it scrolls into view.
 *
 * Sections below the fold need this: a plain mount animation would have
 * finished long before anyone scrolled down to it.
 *
 * IntersectionObserver is the primary trigger, but observer callbacks are
 * delivered as part of the rendering lifecycle — a backgrounded tab (or a
 * browser without the API) can mean they never arrive, which would strand the
 * content at `opacity: 0` permanently. The scroll/resize check is the safety
 * net that guarantees the section always reveals.
 */
export function useRevealOnce<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || revealed) return

    const checkInView = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 0
      if (rect.top < vh * 0.85 && rect.bottom > 0) setRevealed(true)
    }

    let io: IntersectionObserver | undefined
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) setRevealed(true)
        },
        { threshold }
      )
      io.observe(el)
    }

    // Deferred rather than called inline: setting state synchronously in an
    // effect body triggers a cascading render.
    const timer = setTimeout(checkInView, 0)
    window.addEventListener("scroll", checkInView, { passive: true })
    window.addEventListener("resize", checkInView, { passive: true })

    return () => {
      io?.disconnect()
      clearTimeout(timer)
      window.removeEventListener("scroll", checkInView)
      window.removeEventListener("resize", checkInView)
    }
  }, [revealed, threshold])

  return { ref, revealed }
}
