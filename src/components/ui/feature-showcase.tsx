"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useRevealOnce } from "@/hooks/use-reveal-once"

export type TabMedia = {
  /** unique value for Tabs */
  value: string
  /** button label */
  label: string
  /** image url */
  src: string
  alt?: string
}

export type ShowcaseStep = {
  id: string
  title: string
  text: string
}

export type ShowcaseCta = {
  label: string
  href: string
}

export type FeatureShowcaseProps = {
  eyebrow?: string
  title: React.ReactNode
  description?: string
  /** small chips under the description */
  stats?: string[]
  /** accordion steps on the left */
  steps?: ShowcaseStep[]
  /** right-side tabs (image per tab) */
  tabs: TabMedia[]
  /** which tab is active initially */
  defaultTab?: string
  /** tallest the media panel is allowed to get, in px */
  panelMaxHeight?: number
  primaryCta?: ShowcaseCta
  secondaryCta?: ShowcaseCta
  className?: string
}

/**
 * Two-column feature/about block: copy, stat chips and a step accordion on the
 * left, a tabbed media panel on the right.
 *
 * Adapted from the stock shadcn/Radix version:
 *
 * - Primitives come from `@base-ui/react` via this project's own `tabs.tsx` /
 *   `accordion.tsx`, because the shadcn style here is `base-nova`. Adding the
 *   Radix packages would ship a second primitive library alongside Base UI.
 * - `next/image` instead of `<img>`: `@next/next/no-img-element` is on via
 *   `core-web-vitals`, and it gets us AVIF/WebP plus correctly sized sources,
 *   which matters because these are large decorative renders.
 * - Base UI's `Button` composes through `render` rather than `asChild`, and
 *   needs `nativeButton={false}` when the rendered element is an anchor.
 * - The original hard-coded `height: 720px` on the panel, which overflows small
 *   screens. It is a `clamp()` ceiling here instead.
 * - Base UI's accordion takes an array for `defaultValue` and is already
 *   single-open and collapsible, matching the original's
 *   `type="single" collapsible`.
 */
export function FeatureShowcase({
  eyebrow = "Discover",
  title,
  description,
  stats = [],
  steps = [],
  tabs,
  defaultTab,
  panelMaxHeight = 720,
  primaryCta,
  secondaryCta,
  className,
}: FeatureShowcaseProps) {
  const initialTab = defaultTab ?? tabs[0]?.value ?? "tab-0"

  // The media panel is driven by our own state rather than by Base UI's
  // `hidden` bookkeeping. Base UI keeps an exiting panel mounted and visible
  // until its transition finishes, and a transition that never runs — a
  // backgrounded tab freezes them — would leave two of these absolutely
  // stacked images on top of each other. Comparing against `activeTab` cannot
  // get into that state, and it keeps exactly one image request in flight.
  const [activeTab, setActiveTab] = React.useState(initialTab)

  const { ref, revealed } = useRevealOnce<HTMLDivElement>()

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden bg-background text-foreground",
        className
      )}
    >
      {/* Soft blue wash so this section reads as the same surface as the hero
          and the services carousel rather than a plain box between them. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 60% at 15% 0%, rgba(59,130,246,0.10) 0%, rgba(8,10,15,0) 60%), radial-gradient(70% 50% at 95% 100%, rgba(8,145,178,0.08) 0%, rgba(8,10,15,0) 65%)",
        }}
      />

      <div
        ref={ref}
        className={cn(
          "relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-20 transition-all duration-700 ease-out md:grid-cols-12 md:py-28 lg:gap-14",
          "motion-reduce:transition-none",
          revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        )}
      >
        {/* Left column */}
        <div className="md:col-span-6">
          <Badge
            variant="outline"
            className="mb-6 border-brand-primary/30 bg-brand-primary/10 text-brand-primary"
          >
            {eyebrow}
          </Badge>

          <h2 className="text-balance text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl">
            {title}
          </h2>

          {description ? (
            <p className="mt-6 max-w-xl text-base leading-relaxed text-text-secondary">
              {description}
            </p>
          ) : null}

          {stats.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {stats.map((stat) => (
                <Badge
                  key={stat}
                  variant="secondary"
                  className="border-border bg-surface-muted px-3 py-1 text-text-secondary"
                >
                  {stat}
                </Badge>
              ))}
            </div>
          )}

          {steps.length > 0 && (
            <div className="mt-10 max-w-xl">
              {/* Base UI accordions are single-open and collapsible by
                  default (`multiple` defaults to false), so this needs no
                  controlling state — just an array holding the first step. */}
              <Accordion
                defaultValue={steps[0] ? [steps[0].id] : []}
                className="border-t border-border"
              >
                {steps.map((step, i) => (
                  <AccordionItem key={step.id} value={step.id}>
                    <AccordionTrigger className="text-base">
                      <span className="flex items-baseline gap-3">
                        <span className="font-mono text-xs text-brand-primary tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {step.title}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pr-8 pl-9 text-text-secondary">
                      {step.text}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

          {(primaryCta || secondaryCta) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {primaryCta && (
                <Button
                  size="lg"
                  nativeButton={false}
                  className="h-11 rounded-full px-6"
                  render={<Link href={primaryCta.href} />}
                >
                  {primaryCta.label}
                </Button>
              )}
              {secondaryCta && (
                <Button
                  size="lg"
                  variant="outline"
                  nativeButton={false}
                  className="h-11 rounded-full px-6"
                  render={<Link href={secondaryCta.href} />}
                >
                  {secondaryCta.label}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Right column — tabbed media panel */}
        <div className="md:col-span-6">
          <Card
            className="relative gap-0 overflow-hidden rounded-2xl border-border bg-card/40 p-0 py-0 shadow-sm"
            style={{
              height: `clamp(380px, 65vh, ${panelMaxHeight}px)`,
            }}
          >
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as string)}
              className="relative h-full w-full"
            >
              <div className="relative h-full w-full">
                {tabs.map((tab) => (
                  <TabsContent
                    key={tab.value}
                    value={tab.value}
                    className={cn(
                      "absolute inset-0 m-0 h-full w-full [[hidden]]:hidden",
                      tab.value !== activeTab && "hidden"
                    )}
                  >
                    {tab.value === activeTab ? (
                      <Image
                        src={tab.src}
                        alt={tab.alt ?? tab.label}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                      />
                    ) : null}
                  </TabsContent>
                ))}
              </div>

              {/* Scrim behind the pill so the controls stay legible over any
                  image, and the panel edge blends into the section. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#080A0F] via-[#080A0F]/60 to-transparent"
              />

              <div className="absolute inset-x-0 bottom-4 z-10 flex w-full justify-center px-4">
                <TabsList className="flex max-w-full gap-1 overflow-x-auto rounded-xl border border-border bg-background/70 p-1 backdrop-blur-md">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="rounded-lg px-4 py-2 data-active:bg-foreground data-active:text-background"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </Tabs>
          </Card>
        </div>
      </div>
    </section>
  )
}
