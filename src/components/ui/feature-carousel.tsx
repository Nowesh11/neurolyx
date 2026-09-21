"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRevealOnce } from "@/hooks/use-reveal-once"

// --- TYPES ---
export interface CarouselItem {
  src: string
  alt: string
  title: string
  description: string
}

// `HTMLAttributes` declares `title?: string` (the tooltip attribute), which
// collides with a rich ReactNode heading — so that one key is omitted.
interface FeatureCarouselProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  eyebrow?: string
  title: React.ReactNode
  subtitle: string
  items: CarouselItem[]
  /** Milliseconds between auto-advances. Pass 0 to disable autoplay. */
  autoplayMs?: number
}

const AUTOPLAY_MS = 5000
const SLIDE_EASE = "cubic-bezier(0.22, 1, 0.36, 1)"
const SLIDE_MS = 650

/**
 * 3D coverflow carousel used for the Services section.
 *
 * Design notes:
 * - The stage is layered rather than flat black: a wide electric-blue wash, a
 *   slowly breathing spotlight centred behind the active card and three
 *   drifting blooms (blue, cyan, and an off-centre highlight so it never reads
 *   as two symmetrical blobs). Top and bottom fades blend it into the
 *   neighbouring sections so the page reads as one surface, not a stack of boxes.
 * - Every slide carries its own title + description. The title sits on the card
 *   and the description is in a fixed-height block below, so switching slides
 *   never shifts the layout.
 * - Autoplay pauses on hover and on keyboard focus, and the active dot doubles
 *   as a progress bar so the cadence is visible rather than surprising.
 * - Hovering a side card lifts and un-blurs it and makes it clickable; hovering
 *   the centre card deepens its glow and slowly zooms the art.
 *
 * Differences from the stock component this came from: `next/image` instead of
 * `<img>` (`@next/next/no-img-element` is on via core-web-vitals), a blue/cyan
 * palette instead of purple, and `Omit<…, "title">` so a ReactNode heading does
 * not collide with the DOM `title` attribute.
 */
export function FeatureCarousel({
  eyebrow,
  title,
  subtitle,
  items,
  autoplayMs = AUTOPLAY_MS,
  className,
  ...props
}: FeatureCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [paused, setPaused] = React.useState(false)
  const [hovered, setHovered] = React.useState<number | null>(null)
  const { ref: revealRef, revealed } = useRevealOnce<HTMLDivElement>()

  const total = items.length

  const handleNext = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total)
  }, [total])

  const handlePrev = React.useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total)
  }, [total])

  // Autoplay only starts once the section is actually on screen, so the first
  // slide someone sees is the first slide, not whichever one it drifted to.
  React.useEffect(() => {
    if (paused || !revealed || autoplayMs <= 0 || total <= 1) return
    const timer = setInterval(handleNext, autoplayMs)
    return () => clearInterval(timer)
  }, [handleNext, paused, revealed, autoplayMs, total])

  const active = items[currentIndex]

  // `motion-reduce:transition-none` matters for more than taste here: without
  // it, a visitor who prefers reduced motion still waits on a 900ms animated
  // reveal, and anything that stops that animation from running leaves the
  // section stranded at `opacity: 0`. Skipping the transition applies the
  // final state immediately. The other sections already do this.
  const reveal = (delay: string) =>
    cn(
      "transition-all duration-[900ms] ease-out motion-reduce:transition-none",
      revealed
        ? "translate-y-0 opacity-100 blur-none"
        : "translate-y-6 opacity-0 blur-sm",
      delay
    )

  return (
    <div
      ref={revealRef}
      className={cn(
        "relative flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 py-16 text-foreground",
        className
      )}
      {...props}
    >
      {/* ---------- Layered stage ---------- */}
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        {/* Broad electric-blue wash so the section never reads as flat black */}
        <div className="absolute inset-0 bg-[radial-gradient(125%_85%_at_50%_45%,rgba(37,99,235,0.20),rgba(8,10,15,0)_68%)]" />

        {/* Spotlight behind the active card, breathing slowly */}
        <div className="animate-nlx-glow absolute top-1/2 left-1/2 h-[560px] w-[960px] rounded-full bg-[radial-gradient(ellipse,rgba(59,130,246,0.30),rgba(8,10,15,0)_66%)] blur-[70px]" />

        {/* Drifting corner accents */}
        <div className="animate-nlx-drift absolute top-[-12%] -left-[12%] h-[540px] w-[540px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(37,99,235,0.38),rgba(8,10,15,0))] blur-3xl" />
        <div className="animate-nlx-drift-alt absolute -right-[12%] bottom-[-14%] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(8,145,178,0.32),rgba(8,10,15,0))] blur-3xl" />

        {/* A third, off-centre bloom keeps the gradient from looking like two
            symmetrical blobs now that the grid texture is gone. */}
        <div className="absolute top-[18%] right-[22%] h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(96,165,250,0.20),rgba(8,10,15,0))] blur-3xl" />

        {/* Blend into the sections above and below */}
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#080A0F] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#080A0F] to-transparent" />
      </div>

      <div className="z-10 flex w-full flex-col items-center space-y-8 text-center md:space-y-10">
        {/* ---------- Header ---------- */}
        <div className="space-y-4">
          {eyebrow && (
            <p
              className={cn(
                "text-sm font-semibold tracking-widest text-brand-secondary uppercase",
                reveal("delay-0")
              )}
            >
              {eyebrow}
            </p>
          )}
          <h2
            className={cn(
              "max-w-4xl text-4xl font-bold tracking-tight text-text-primary sm:text-5xl",
              reveal("delay-100")
            )}
          >
            {title}
          </h2>
          <p
            className={cn(
              "mx-auto max-w-2xl text-text-secondary md:text-lg",
              reveal("delay-200")
            )}
          >
            {subtitle}
          </p>
        </div>

        {/* ---------- Showcase ---------- */}
        <div
          className={cn(
            "relative flex h-[320px] w-full items-center justify-center md:h-[400px]",
            reveal("delay-300")
          )}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          role="group"
          aria-roledescription="carousel"
          aria-label="NLX services"
        >
          {/* Halo tight behind the centre card */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.38),rgba(8,10,15,0)_70%)] blur-2xl"
          />

          <div className="relative flex h-full w-full items-center justify-center [perspective:1200px]">
            {items.map((item, index) => {
              const offset = index - currentIndex
              let pos = (offset + total) % total
              if (pos > Math.floor(total / 2)) pos = pos - total

              const isCenter = pos === 0
              const isAdjacent = Math.abs(pos) === 1
              const hidden = Math.abs(pos) > 1
              const isHovered = hovered === index

              // Hover has to be folded into the computed style rather than done
              // with CSS `:hover`, because transform/opacity/filter are already
              // set inline here and a class could not win against them.
              const scale = isCenter
                ? isHovered
                  ? 1.04
                  : 1
                : isAdjacent
                  ? isHovered
                    ? 0.9
                    : 0.84
                  : 0.7
              const opacity = isCenter ? 1 : isAdjacent ? (isHovered ? 0.8 : 0.4) : 0
              const blurPx = isCenter ? 0 : isHovered ? 1 : 4

              return (
                <div
                  key={item.title}
                  className={cn(
                    "absolute flex h-[290px] w-[172px] items-center justify-center md:h-[380px] md:w-[224px]",
                    isAdjacent && "cursor-pointer"
                  )}
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered((h) => (h === index ? null : h))}
                  onClick={() => {
                    if (isAdjacent) setCurrentIndex(index)
                  }}
                  style={{
                    transform: `translateX(${pos * 62}%) scale(${scale}) rotateY(${pos * -14}deg)`,
                    zIndex: isCenter ? 10 : isAdjacent ? 5 : 1,
                    opacity,
                    filter: `blur(${blurPx}px)`,
                    visibility: hidden ? "hidden" : "visible",
                    transition: `transform ${SLIDE_MS}ms ${SLIDE_EASE}, opacity ${SLIDE_MS}ms ${SLIDE_EASE}, filter ${SLIDE_MS}ms ${SLIDE_EASE}`,
                  }}
                  aria-hidden={!isCenter}
                >
                  <div
                    className={cn(
                      "relative h-full w-full overflow-hidden rounded-3xl border transition-[border-color,box-shadow] duration-500",
                      isCenter && isHovered
                        ? "border-brand-primary/60 shadow-[0_30px_80px_rgba(0,0,0,0.65),0_0_70px_rgba(59,130,246,0.45)]"
                        : isCenter
                          ? "border-brand-primary/35 shadow-[0_24px_70px_rgba(0,0,0,0.6),0_0_46px_rgba(59,130,246,0.28)]"
                          : "border-white/10 shadow-[0_18px_50px_rgba(0,0,0,0.5)]"
                    )}
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 768px) 224px, 172px"
                      className={cn(
                        "object-cover transition-transform duration-700 ease-out",
                        isHovered ? "scale-110" : "scale-100"
                      )}
                    />
                    {/* Scrim so the title stays legible over any part of the art */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#080A0F] via-[#080A0F]/75 to-transparent p-4 pt-16">
                      <p className="text-left text-base font-semibold text-text-primary">
                        {item.title}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="icon"
            aria-label="Previous service"
            onClick={handlePrev}
            className="absolute top-1/2 left-2 z-20 size-10 -translate-y-1/2 rounded-full border-white/10 bg-surface/60 backdrop-blur-xl transition-colors hover:border-brand-primary/40 hover:bg-surface sm:left-8"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Next service"
            onClick={handleNext}
            className="absolute top-1/2 right-2 z-20 size-10 -translate-y-1/2 rounded-full border-white/10 bg-surface/60 backdrop-blur-xl transition-colors hover:border-brand-primary/40 hover:bg-surface sm:right-8"
          >
            <ChevronRight className="size-5" />
          </Button>
        </div>

        {/* ---------- Active slide copy + controls ---------- */}
        <div
          className={cn(
            "flex min-h-[100px] w-full max-w-xl flex-col items-center gap-4 px-2",
            reveal("delay-[400ms]")
          )}
        >
          <p
            key={active.title}
            aria-live="polite"
            className="animate-in fade-in slide-in-from-bottom-2 text-base leading-relaxed text-text-secondary duration-500 ease-out fill-mode-both"
          >
            {active.description}
          </p>

          <div className="flex items-center gap-2 pt-1">
            {items.map((item, index) => {
              const isActive = index === currentIndex
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Show ${item.title}`}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative h-1.5 overflow-hidden rounded-full outline-none transition-all duration-500 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isActive
                      ? "w-8 bg-brand-primary/25"
                      : "w-1.5 bg-border-strong hover:bg-text-secondary"
                  )}
                >
                  {/* The active dot doubles as an autoplay progress bar, so the
                      3s cadence is visible instead of arriving unannounced. */}
                  {isActive && autoplayMs > 0 && revealed && (
                    <span
                      key={currentIndex}
                      className="absolute inset-0 origin-left rounded-full bg-brand-primary"
                      style={{
                        animation: `nlx-progress ${autoplayMs}ms linear forwards`,
                        animationPlayState: paused ? "paused" : "running",
                      }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

FeatureCarousel.displayName = "FeatureCarousel"
