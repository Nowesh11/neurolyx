"use client"

import * as React from "react"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"

export interface GalleryItem {
  title: string
  description: string
  /** Where the card goes when clicked. External URLs open in a new tab. */
  href: string
  /** Small label above the title, e.g. the kind of work. */
  tag?: string
  image: {
    url: string
    alt: string
    /** CSS object-position, e.g. "50% 30%". */
    position?: string
  }
}

export interface CircularGalleryProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  items: GalleryItem[]
  /**
   * The tall element whose scroll-through drives the rotation — normally the
   * container holding the sticky viewport. Without it the gallery just drifts.
   */
  trackRef?: React.RefObject<HTMLElement | null>
  /** Degrees per second of idle drift. */
  autoRotateSpeed?: number
  /** Full turns across the whole scroll track. */
  turns?: number
}

const isExternal = (href: string) => /^https?:\/\//i.test(href)

/**
 * A ring of cards in 3D, rotated by scroll and drifting when idle.
 *
 * Substantially reworked from the stock component. Each change fixes
 * something that would bite on this page:
 *
 * 1. **No React state in the animation loop.** The original called
 *    `setRotation` inside `requestAnimationFrame`, re-rendering the whole
 *    gallery 60 times a second, forever. On a page that already runs a WebGL
 *    hero that is ruinous. Rotation lives in a ref and the loop writes
 *    transforms straight to the DOM, so React renders once.
 * 2. **Rotation is scoped to this section.** The original derived progress
 *    from `window.scrollY / document.scrollHeight`, so dropping it into a
 *    page made the ring answer to the entire document's scroll. It now
 *    measures `trackRef`, so it only turns while its own section is passing.
 * 3. **The loop stops when off-screen** (IntersectionObserver) and when the
 *    tab is hidden, rather than running for the life of the page.
 * 4. **Reduced motion** disables the idle drift; scroll still turns the ring.
 * 5. **Cards are links**, and the drift pauses on hover or keyboard focus —
 *    otherwise the click target is a moving object.
 * 6. **Back-facing cards are inert** (`pointer-events: none`), so a click
 *    never lands on a card facing away from the viewer.
 * 7. `next/image` instead of `<img>`: `@next/next/no-img-element` is on via
 *    `core-web-vitals`, and these are large photos.
 * 8. The local `cn` copy is dropped for the project's own.
 * 9. Card size and radius are responsive — the original's fixed 300px card at
 *    a 600px radius put most of the ring off a phone screen.
 */
export const CircularGallery = React.forwardRef<
  HTMLDivElement,
  CircularGalleryProps
>(function CircularGallery(
  { items, trackRef, autoRotateSpeed = 4, turns = 1, className, ...props },
  forwardedRef
) {
  const stageRef = React.useRef<HTMLDivElement>(null)
  const hostRef = React.useRef<HTMLDivElement>(null)
  const cardRefs = React.useRef<(HTMLAnchorElement | null)[]>([])
  const pausedRef = React.useRef(false)

  React.useImperativeHandle(forwardedRef, () => hostRef.current as HTMLDivElement)

  const count = items.length

  React.useEffect(() => {
    const host = hostRef.current
    const stage = stageRef.current
    if (!host || !stage || count === 0) return

    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let raf = 0
    let drift = 0
    let last = performance.now()
    let visible = true

    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (entries) => {
              visible = entries.some((e) => e.isIntersecting)
            },
            { rootMargin: "100px" }
          )
        : undefined
    io?.observe(host)

    const anglePerItem = 360 / count

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)

      const dt = Math.min((now - last) / 1000, 0.1)
      last = now

      // Nothing to paint while the section is off-screen or the tab is hidden.
      if (!visible || document.hidden) return

      if (!reduceMotion && !pausedRef.current) {
        drift += autoRotateSpeed * dt
      }

      let scrollRotation = 0
      const track = trackRef?.current
      if (track) {
        const rect = track.getBoundingClientRect()
        const range = rect.height - window.innerHeight
        const progress = range > 0 ? Math.min(Math.max(-rect.top / range, 0), 1) : 0
        scrollRotation = progress * 360 * turns
      }

      const rotation = scrollRotation + drift
      stage.style.transform = `rotateY(${rotation}deg)`

      // Radius follows the host width so the ring stays on screen.
      const radius = Math.max(200, Math.min(host.clientWidth * 0.42, 540))

      for (let i = 0; i < cardRefs.current.length; i++) {
        const card = cardRefs.current[i]
        if (!card) continue

        const itemAngle = i * anglePerItem
        card.style.transform = `rotateY(${itemAngle}deg) translateZ(${radius}px)`

        // 0 when the card faces the viewer, 180 when it faces away.
        const relative = (((itemAngle + rotation) % 360) + 360) % 360
        const facing = relative > 180 ? 360 - relative : relative

        card.style.opacity = String(Math.max(0.15, 1 - facing / 150))
        // Anything past side-on is unclickable, so a click cannot land on a
        // card the viewer cannot actually see.
        card.style.pointerEvents = facing > 75 ? "none" : "auto"
        card.setAttribute("aria-hidden", facing > 75 ? "true" : "false")
        card.tabIndex = facing > 75 ? -1 : 0
      }
    }

    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      io?.disconnect()
    }
  }, [count, autoRotateSpeed, turns, trackRef])

  return (
    <div
      ref={hostRef}
      role="region"
      aria-label="Selected work"
      className={cn(
        "relative flex h-full w-full items-center justify-center",
        className
      )}
      style={{ perspective: "2000px" }}
      onPointerEnter={() => (pausedRef.current = true)}
      onPointerLeave={() => (pausedRef.current = false)}
      onFocusCapture={() => (pausedRef.current = true)}
      onBlurCapture={() => (pausedRef.current = false)}
      {...props}
    >
      <div
        ref={stageRef}
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {items.map((item, i) => (
          <a
            key={`${item.title}-${i}`}
            ref={(el) => {
              cardRefs.current[i] = el
            }}
            href={item.href}
            target={isExternal(item.href) ? "_blank" : undefined}
            rel={isExternal(item.href) ? "noopener noreferrer" : undefined}
            className="group absolute top-1/2 left-1/2 -mt-40 -ml-30 block h-80 w-60 rounded-2xl outline-none sm:-mt-48 sm:-ml-36 sm:h-96 sm:w-72"
            style={{
              transformStyle: "preserve-3d",
              // Cards on the far side of the ring face away from the camera,
              // so without this you read their titles and descriptions
              // mirrored. Hiding the backface drops them out cleanly instead.
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl transition-colors group-hover:border-brand-primary/60 group-focus-visible:border-brand-primary">
              <Image
                src={item.image.url}
                alt={item.image.alt}
                fill
                sizes="(min-width: 640px) 288px, 240px"
                className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                style={{ objectPosition: item.image.position ?? "center" }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-[#05070B]/55 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                {item.tag && (
                  <span className="mb-2 inline-block rounded-full border border-brand-primary/40 bg-brand-primary/15 px-2.5 py-0.5 text-[0.65rem] font-semibold tracking-wider text-[#93B4FB] uppercase">
                    {item.tag}
                  </span>
                )}
                <h3 className="flex items-center gap-1.5 text-lg leading-tight font-bold">
                  {item.title}
                  <ArrowUpRight className="size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/75">
                  {item.description}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
})
