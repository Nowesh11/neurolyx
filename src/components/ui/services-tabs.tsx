"use client"

import * as React from "react"
import Image from "next/image"
import { ArrowUpRight, Plus } from "lucide-react"

import { cn } from "@/lib/utils"

export type ServiceItem = {
  id: string
  title: string
  tagline: string
  description: string
  deliverables: string[]
  image: { src: string; alt: string }
}

/**
 * Numbered, accordion-style service list with a sticky preview panel.
 *
 * Adapted from the 21st.dev "Studiova Interactive Services Tabs" component:
 * - Real <button>s with `aria-expanded` / `aria-controls`, instead of
 *   clickable <div>s that a keyboard could never reach.
 * - The preview is photography, not an icon mock-up. Every image is mounted
 *   at once and crossfaded with opacity, so switching tabs never waits on a
 *   network request or flashes empty.
 * - Colours come from the NLX tokens rather than hard-coded hex.
 * - On small screens the preview panel is dropped and each open row shows
 *   its own image inline, so nothing sits far away from the text it belongs to.
 */
export function ServicesTabs({ services }: { services: ServiceItem[] }) {
  const [activeId, setActiveId] = React.useState(services[0]?.id)
  const activeIndex = Math.max(
    0,
    services.findIndex((s) => s.id === activeId)
  )
  const active = services[activeIndex]
  const baseId = React.useId()

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
      {/* Left — the list */}
      <ol className="flex flex-col border-t border-border lg:col-span-7">
        {services.map((item, i) => {
          const isActive = item.id === activeId
          const panelId = `${baseId}-panel-${item.id}`
          return (
            <li key={item.id} className="border-b border-border">
              <h3>
                <button
                  type="button"
                  aria-expanded={isActive}
                  aria-controls={panelId}
                  onClick={() => setActiveId(item.id)}
                  className="group flex w-full items-center gap-5 py-6 text-left outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/60 sm:gap-8 sm:py-7"
                >
                  <span
                    className={cn(
                      "font-mono text-xs transition-colors",
                      isActive ? "text-brand-primary" : "text-text-muted"
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "flex-1 text-2xl font-medium tracking-[-0.03em] transition-colors duration-300 sm:text-4xl",
                      isActive
                        ? "text-foreground"
                        : "text-text-muted group-hover:text-text-secondary"
                    )}
                  >
                    {item.title}
                  </span>
                  <span
                    className={cn(
                      "grid size-9 shrink-0 place-content-center rounded-full border transition-all duration-500",
                      isActive
                        ? "rotate-45 border-brand-primary bg-brand-primary text-primary-foreground"
                        : "border-border-strong text-text-secondary group-hover:border-brand-primary/60 group-hover:text-brand-primary"
                    )}
                  >
                    <Plus className="size-4" />
                  </span>
                </button>
              </h3>

              <div
                id={panelId}
                role="region"
                aria-label={item.title}
                hidden={!isActive}
                className="animate-in fade-in slide-in-from-top-1 duration-500 ease-out"
              >
                <div className="pb-8 sm:pl-[3.25rem]">
                  <p className="font-serif text-xl text-brand-primary italic sm:text-2xl">
                    {item.tagline}
                  </p>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-secondary sm:text-base">
                    {item.description}
                  </p>
                  <ul className="mt-6 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
                    {item.deliverables.map((d) => (
                      <li
                        key={d}
                        className="flex items-center gap-2.5 text-sm text-foreground/90"
                      >
                        <span
                          aria-hidden
                          className="size-1.5 shrink-0 rounded-full bg-brand-primary"
                        />
                        {d}
                      </li>
                    ))}
                  </ul>

                  {/* Inline image on small screens only. */}
                  <div className="relative mt-7 aspect-[4/3] overflow-hidden rounded-2xl border border-border lg:hidden">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      sizes="(min-width: 640px) 80vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ol>

      {/* Right — sticky preview (desktop) */}
      <div className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-28">
          <div className="gold-ring relative aspect-[4/5] overflow-hidden rounded-3xl bg-surface">
            {services.map((item) => (
              <Image
                key={item.id}
                src={item.image.src}
                alt={item.id === activeId ? item.image.alt : ""}
                aria-hidden={item.id !== activeId}
                fill
                sizes="(min-width: 1024px) 40vw, 1px"
                className={cn(
                  "object-cover transition-[opacity,scale] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                  item.id === activeId
                    ? "scale-100 opacity-100"
                    : "scale-105 opacity-0"
                )}
              />
            ))}

            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"
            />

            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6">
              <span className="rounded-full border border-white/10 bg-background/50 px-3 py-1 text-[11px] font-medium tracking-[0.18em] text-text-secondary uppercase backdrop-blur-md">
                Service
              </span>
              <span className="font-mono text-xs text-text-secondary">
                <span className="text-brand-primary">
                  {String(activeIndex + 1).padStart(2, "0")}
                </span>{" "}
                / {String(services.length).padStart(2, "0")}
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-7">
              <p
                key={active.id}
                className="animate-in fade-in slide-in-from-bottom-2 text-3xl font-medium tracking-[-0.03em] text-foreground duration-700"
              >
                {active.title}
              </p>
              <a
                href="#contact"
                className="group mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary outline-none focus-visible:underline"
              >
                Scope this with us
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
