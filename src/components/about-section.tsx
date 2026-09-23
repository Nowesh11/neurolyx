"use client"

import Image from "next/image"
import { ArrowRight } from "lucide-react"

import {
  Accent,
  Reveal,
  SectionLabel,
  SectionTitle,
} from "@/components/ui/section-heading"

/**
 * About NLX.
 *
 * Copy note: NLX is a new studio, so nothing here claims a track record it
 * does not have — no client counts, no years in business, no logos. The angle
 * is what an independent studio can genuinely offer over an agency: you talk
 * to the person writing the code, scope and price are fixed up front, and you
 * own everything at the end.
 */
const steps = [
  {
    title: "We start with the bottleneck, not the tech",
    text: "A short call to find the job that quietly eats the most hours — the enquiries answered twice, the quotes retyped, the follow-ups nobody gets to. If automation is the wrong answer, we will say so rather than sell you a build.",
  },
  {
    title: "You get a fixed scope and a fixed price",
    text: "Before anything is built you see exactly what is included, what it costs and when it lands. No open-ended hourly billing, and no invoice that arrives larger than the estimate.",
  },
  {
    title: "You see it working while it is being built",
    text: "Something you can click on early and often, so the direction is corrected in days rather than discovered at handover. Feedback goes straight to the person writing the code.",
  },
  {
    title: "It is yours to keep",
    text: "Source code, accounts and documentation are handed over in your name, on your infrastructure. Stay on for support if it helps — nothing is held hostage to keep you subscribed.",
  },
]

const principles = [
  "Independent studio",
  "Fixed scope, fixed price",
  "You own the code",
]

export function AboutSection() {
  return (
    <div className="relative overflow-clip border-y border-border bg-surface/30">
      {/* Warm pool of light behind the image column. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 size-[42rem] rounded-full bg-brand-primary/[0.07] blur-[140px]"
      />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-16 px-6 py-24 md:py-32 lg:grid-cols-12 lg:gap-12">
        {/* Left — sticky editorial column */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <SectionLabel index="02">About NLX</SectionLabel>
              <SectionTitle className="mt-6">
                You talk to the person who <Accent>actually builds it.</Accent>
              </SectionTitle>
              <p className="mt-6 max-w-md text-base leading-relaxed text-text-secondary">
                NLX is an independent AI automation and software studio. No
                account managers, no hand-offs, no ticket queue — just the
                chatbots, automations and custom software that off-the-shelf
                products never quite fit.
              </p>
            </Reveal>

            <Reveal delay={120} className="mt-10">
              <figure className="gold-ring relative aspect-[5/4] overflow-hidden rounded-3xl">
                <Image
                  src="/img/about-studio.jpg"
                  alt="A dark wooden desk lit by a single brass lamp"
                  fill
                  sizes="(min-width: 1024px) 38vw, 100vw"
                  className="object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent"
                />
                <figcaption className="absolute inset-x-0 bottom-0 flex flex-wrap gap-2 p-5">
                  {principles.map((p) => (
                    <span
                      key={p}
                      className="rounded-full border border-white/10 bg-background/60 px-3 py-1.5 text-xs text-foreground backdrop-blur-md"
                    >
                      {p}
                    </span>
                  ))}
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>

        {/* Right — the process */}
        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal>
            <p className="max-w-lg font-serif text-3xl leading-[1.15] text-foreground italic sm:text-4xl">
              &ldquo;Four steps, the same every time — so you always know what
              happens next.&rdquo;
            </p>
          </Reveal>

          <ol className="relative mt-14">
            {/* The thread running through the steps. */}
            <span
              aria-hidden
              className="absolute top-2 bottom-2 left-[1.1rem] w-px bg-gradient-to-b from-brand-primary/70 via-border-strong to-transparent"
            />
            {steps.map((step, i) => (
              <Reveal
                as="li"
                key={step.title}
                delay={i * 90}
                className="relative pb-12 pl-16 last:pb-0"
              >
                <span className="absolute top-0 left-0 grid size-9 place-content-center rounded-full border border-brand-primary/40 bg-background font-mono text-xs text-brand-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="pt-1 text-xl font-medium tracking-[-0.02em] text-foreground sm:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-text-secondary sm:text-base">
                  {step.text}
                </p>
              </Reveal>
            ))}
          </ol>

          <Reveal className="mt-14 flex flex-wrap gap-3 pl-16">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
            >
              Start a conversation
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#services"
              className="inline-flex items-center rounded-full border border-border-strong px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-brand-primary/60 focus-visible:ring-2 focus-visible:ring-brand-primary/60 focus-visible:outline-none"
            >
              See what we build
            </a>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
