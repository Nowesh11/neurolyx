"use client"

import * as React from "react"
import { CheckCheck } from "lucide-react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { TimelineContent } from "@/components/ui/timeline-animation"
import { cn } from "@/lib/utils"

export type PricingFeature = {
  text: string
  icon: React.ReactNode
}

export type PricingPlan = {
  name: string
  description: string
  /** Bottom of the range. */
  priceFrom: number
  /** Top of the range. Leave undefined for an open-ended "and up" tier. */
  priceTo?: number
  /** Short line under the price, e.g. what moves it within the range. */
  priceNote?: string
  buttonText: string
  href: string
  popular?: boolean
  features: PricingFeature[]
  /** First entry is the heading for the list beneath it. */
  includes: string[]
}

export type PricingSectionProps = {
  eyebrow?: string
  title: React.ReactNode
  subtitle?: string
  plans: PricingPlan[]
  /** Copy under the grid — good place for the "prices are a starting point" note. */
  footnote?: React.ReactNode
  currency?: string
  locale?: string
  className?: string
}

/**
 * Pricing grid.
 *
 * Adapted from the stock component:
 *
 * - Retheme from light to the NLX dark stage. The original was hard-coded to
 *   `bg-neutral-100` / white cards / `text-gray-900`, and its background wash
 *   used `mix-blend-mode: multiply`, which only darkens — on a near-black
 *   stage it renders nothing at all. It is a plain radial gradient here,
 *   matching the about and contact sections.
 * - `TimelineContent` was imported by the original but never supplied with it,
 *   so it is written in `timeline-animation.tsx`.
 * - Content is passed in rather than baked in, matching `feature-showcase.tsx`.
 * - Prices are **ranges**, so the monthly/yearly switch and its `NumberFlow`
 *   counters are gone. A freelance quote is "somewhere between these two
 *   numbers, depending on scope" — there is no second billing period for a
 *   toggle to flip to, and an animated counter has nothing to animate when the
 *   figure never changes. Formatting goes through `Intl` instead.
 */
function formatPrice(value: number, locale: string, currency: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatAmount(value: number, locale: string) {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(
    value
  )
}

export function PricingSection({
  eyebrow = "Pricing",
  title,
  subtitle,
  plans,
  footnote,
  currency = "MYR",
  locale = "en-MY",
  className,
}: PricingSectionProps) {
  const pricingRef = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={pricingRef}
      className={cn(
        "relative mx-auto w-full overflow-hidden bg-background px-6 py-20 md:py-28",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 45% at 50% 0%, rgba(37,108,232,0.18) 0%, rgba(8,10,15,0) 70%)",
        }}
      />

      <div className="relative mx-auto mb-4 max-w-3xl text-center">
        <TimelineContent
          as="p"
          animationNum={0}
          timelineRef={pricingRef}
          className="mb-4 text-sm font-semibold tracking-widest text-brand-secondary uppercase"
        >
          {eyebrow}
        </TimelineContent>

        <TimelineContent
          as="h2"
          animationNum={1}
          timelineRef={pricingRef}
          className="mb-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl"
        >
          {title}
        </TimelineContent>

        {subtitle && (
          <TimelineContent
            as="p"
            animationNum={2}
            timelineRef={pricingRef}
            className="mx-auto max-w-2xl text-sm text-text-secondary sm:text-base"
          >
            {subtitle}
          </TimelineContent>
        )}
      </div>

      <div className="relative mx-auto grid max-w-7xl items-start gap-5 py-10 md:grid-cols-3">
        {plans.map((plan, index) => (
          <TimelineContent
            key={plan.name}
            as="div"
            animationNum={3 + index}
            timelineRef={pricingRef}
            className="h-full"
          >
            <Card
              className={cn(
                "relative h-full gap-0 border-border bg-surface/60 py-0 backdrop-blur-sm transition-colors",
                plan.popular &&
                  "border-brand-primary/50 bg-brand-primary/[0.07] shadow-[0_0_0_1px_var(--brand-primary),0_18px_50px_-20px_rgba(59,130,246,0.55)]"
              )}
            >
              <CardHeader className="p-6 text-left">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="mb-2 text-2xl font-semibold">{plan.name}</h3>
                  {plan.popular && (
                    <span className="rounded-full bg-brand-primary px-3 py-1 text-xs font-semibold text-[#0B0F17]">
                      Most popular
                    </span>
                  )}
                </div>

                <p className="mb-5 min-h-[3.25rem] text-sm leading-relaxed text-text-secondary">
                  {plan.description}
                </p>

                <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
                  <span className="text-2xl font-semibold text-foreground sm:text-3xl">
                    {formatPrice(plan.priceFrom, locale, currency)}
                  </span>
                  {plan.priceTo ? (
                    <>
                      <span className="text-xl text-text-muted">–</span>
                      <span className="text-2xl font-semibold text-foreground sm:text-3xl">
                        {formatAmount(plan.priceTo, locale)}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-semibold text-foreground sm:text-3xl">
                      +
                    </span>
                  )}
                </div>
                {plan.priceNote && (
                  <p className="mt-1.5 text-xs text-text-muted">
                    {plan.priceNote}
                  </p>
                )}
              </CardHeader>

              <CardContent className="px-6 pt-0 pb-6">
                <a
                  href={plan.href}
                  className={cn(
                    "mb-6 flex w-full items-center justify-center rounded-xl px-4 py-3.5 text-base font-semibold transition-all focus-visible:ring-3 focus-visible:ring-brand-primary/40 focus-visible:outline-none",
                    plan.popular
                      ? "border border-[#60A5FA] bg-gradient-to-t from-[#2563EB] to-[#60A5FA] text-white shadow-[0_8px_26px_-6px_rgba(59,130,246,0.65)] hover:brightness-110"
                      : "border border-border-strong bg-surface-muted text-foreground hover:border-brand-primary/50 hover:bg-surface-muted/70"
                  )}
                >
                  {plan.buttonText}
                </a>

                <ul className="space-y-3 py-1">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-center gap-3">
                      <span className="grid shrink-0 place-content-center text-brand-primary">
                        {feature.icon}
                      </span>
                      <span className="text-sm text-text-secondary">
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 space-y-3 border-t border-border pt-5">
                  <h4 className="mb-3 text-sm font-semibold text-foreground">
                    {plan.includes[0]}
                  </h4>
                  <ul className="space-y-2.5">
                    {plan.includes.slice(1).map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-0.5 grid size-5 shrink-0 place-content-center rounded-full border border-brand-primary/40 bg-brand-primary/10">
                          <CheckCheck className="size-3 text-brand-primary" />
                        </span>
                        <span className="text-sm text-text-secondary">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TimelineContent>
        ))}
      </div>

      {footnote && (
        <div className="relative mx-auto max-w-3xl text-center text-sm text-text-secondary">
          {footnote}
        </div>
      )}
    </div>
  )
}

export default PricingSection
