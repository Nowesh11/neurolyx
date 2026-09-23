"use client"

import { ArrowRight, Check } from "lucide-react"

import {
  Accent,
  Reveal,
  SectionLabel,
  SectionTitle,
} from "@/components/ui/section-heading"
import { cn } from "@/lib/utils"

type Plan = {
  name: string
  description: string
  /** Bottom of the range. */
  priceFrom: number
  /** Top of the range. Leave undefined for an open-ended "and up" tier. */
  priceTo?: number
  priceNote: string
  buttonText: string
  href: string
  popular?: boolean
  /** First entry is the heading for the list beneath it. */
  includes: string[]
}

/**
 * NLX pricing.
 *
 * Ranges, not fixed figures: the bottom of each band is a realistic small
 * build and the top is where that kind of work starts turning into the next
 * tier up. Nothing here claims a track record — it is just what the work
 * costs. Amounts are MYR.
 */
const plans: Plan[] = [
  {
    name: "Launch",
    description:
      "Landing pages, small business sites and simple desktop tools — online quickly, without the agency overhead.",
    priceFrom: 1000,
    priceTo: 5000,
    priceNote: "Depends on page count, content and integrations.",
    buttonText: "Start a project",
    href: "#contact",
    includes: [
      "What you get",
      "Landing page or small website",
      "Simple desktop app (Windows / macOS)",
      "Mobile first, with on-page SEO",
      "Domain, hosting and contact form set up",
      "Two rounds of revisions",
      "30 days of support after launch",
    ],
  },
  {
    name: "Automate",
    description:
      "WhatsApp and AI chatbots, plus the workflow automation that removes the repetitive work between your tools.",
    priceFrom: 1000,
    priceTo: 10000,
    priceNote: "Depends on how many flows and systems are involved.",
    buttonText: "Start a project",
    href: "#contact",
    popular: true,
    includes: [
      "Everything in Launch, plus",
      "WhatsApp or website chatbot",
      "Trained on your own docs and pricing",
      "Wired into the tools you already use",
      "Lead capture, booking and calendar sync",
      "Hand-off to a human with full context",
      "90 days of tuning on real messages",
    ],
  },
  {
    name: "Custom build",
    description:
      "Full applications shaped around how you actually operate — web, mobile or desktop, with the backend behind them.",
    priceFrom: 10000,
    priceNote: "Scoped and quoted exactly after a discovery session.",
    buttonText: "Book a consult",
    href: "#contact",
    includes: [
      "Everything in Automate, plus",
      "Web, mobile or desktop application",
      "Dashboards and live reporting",
      "Integrations and data migration",
      "Discovery session and written spec",
      "Staged delivery you review as it is built",
      "Source code handed over in your name",
    ],
  },
]

/** "10000" -> "10k" — the ranges read faster in thousands. */
function k(value: number) {
  return value >= 1000 ? `${value / 1000}k` : String(value)
}

function PlanCard({ plan, index }: { plan: Plan; index: number }) {
  const [heading, ...items] = plan.includes
  const featured = Boolean(plan.popular)

  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-3xl p-7 sm:p-8",
        featured
          ? "gold-ring bg-gradient-to-b from-brand-light to-surface shadow-[0_30px_80px_-30px_rgba(226,183,116,0.35)]"
          : "border border-border bg-surface/60"
      )}
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] text-text-muted">
          {String(index + 1).padStart(2, "0")}
        </p>
        {featured && (
          <span className="rounded-full bg-brand-primary px-3 py-1 text-[11px] font-semibold tracking-wide text-primary-foreground">
            Most chosen
          </span>
        )}
      </div>

      <h3 className="mt-6 font-serif text-4xl text-foreground italic">
        {plan.name}
      </h3>
      <p className="mt-3 min-h-[4.5rem] text-sm leading-relaxed text-text-secondary">
        {plan.description}
      </p>

      <div className="mt-8 border-t border-border pt-7">
        <p className="text-xs tracking-[0.18em] text-text-muted uppercase">
          {plan.priceTo ? "Typical range" : "Starting from"}
        </p>
        <p className="mt-2 flex items-baseline gap-2 text-foreground">
          <span className="text-sm font-medium text-text-secondary">RM</span>
          <span className="text-5xl font-medium tracking-[-0.04em]">
            {k(plan.priceFrom)}
          </span>
          <span className="text-3xl font-light tracking-[-0.04em] text-text-muted">
            {plan.priceTo ? `– ${k(plan.priceTo)}` : "+"}
          </span>
        </p>
        <p className="mt-2 text-xs text-text-muted">{plan.priceNote}</p>
      </div>

      <a
        href={plan.href}
        className={cn(
          "group mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
          featured
            ? "bg-brand-primary text-primary-foreground hover:bg-brand-hover"
            : "border border-border-strong text-foreground hover:border-brand-primary/60 hover:text-brand-primary"
        )}
      >
        {plan.buttonText}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </a>

      <div className="mt-8">
        <p className="text-xs font-medium tracking-[0.18em] text-text-muted uppercase">
          {heading}
        </p>
        <ul className="mt-4 flex flex-col gap-3">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 text-sm text-foreground/90"
            >
              <span
                className={cn(
                  "mt-0.5 grid size-4 shrink-0 place-content-center rounded-full",
                  featured
                    ? "bg-brand-primary text-primary-foreground"
                    : "bg-surface-muted text-brand-primary"
                )}
              >
                <Check className="size-2.5" strokeWidth={3} />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

export function PricingPlans() {
  return (
    <div className="relative mx-auto w-full max-w-7xl px-6 py-24 md:py-32">
      <Reveal className="mx-auto max-w-3xl text-center">
        <SectionLabel index="05" className="justify-center">
          Pricing
        </SectionLabel>
        <SectionTitle className="mt-6">
          Fixed quotes, agreed <Accent>before we start.</Accent>
        </SectionTitle>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-text-secondary">
          These are the ranges most projects land in. Your exact number is
          fixed in writing after a short call, and it does not move unless you
          change the scope.
        </p>
      </Reveal>

      <div className="mt-16 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">
        {plans.map((plan, i) => (
          <Reveal
            key={plan.name}
            delay={i * 100}
            className={cn(plan.popular && "lg:-my-4")}
          >
            <PlanCard plan={plan} index={i} />
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-14 text-center text-sm text-text-secondary">
        Not sure which one you need? Most people are not.{" "}
        <a
          href="#contact"
          className="font-medium text-brand-primary underline decoration-brand-primary/40 underline-offset-4 transition-colors hover:decoration-brand-primary"
        >
          Describe the problem
        </a>{" "}
        and we&apos;ll tell you honestly what it takes — including if the
        answer is that you don&apos;t need us.
      </Reveal>
    </div>
  )
}
