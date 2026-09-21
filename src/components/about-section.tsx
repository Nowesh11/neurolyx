"use client"

import {
  FeatureShowcase,
  type ShowcaseStep,
  type TabMedia,
} from "@/components/ui/feature-showcase"

/**
 * About NLX.
 *
 * Copy note: NLX is a new studio, so nothing here claims a track record it
 * does not have — no client counts, no years in business, no logos. The angle
 * is what an independent studio can genuinely offer over an agency: you talk
 * to the person writing the code, scope and price are fixed up front, and you
 * own everything at the end.
 */
const tabs: TabMedia[] = [
  {
    value: "automation",
    label: "Automation",
    src: "/about/automation.jpg",
    alt: "Glowing pipelines and interlocking rings carrying data around a closed loop",
  },
  {
    value: "conversations",
    label: "Conversations",
    src: "/about/conversations.jpg",
    alt: "Stacked message bubbles lit from within, joined by a thread of light",
  },
  {
    value: "software",
    label: "Software",
    src: "/about/software.jpg",
    alt: "Translucent application panels floating in layered perspective",
  },
]

const steps: ShowcaseStep[] = [
  {
    id: "step-bottleneck",
    title: "We start with the bottleneck, not the tech",
    text: "A short call to find the job that quietly eats the most hours — the enquiries answered twice, the quotes retyped, the follow-ups nobody gets to. If automation is the wrong answer for it, we will say so rather than sell you a build.",
  },
  {
    id: "step-scope",
    title: "You get a fixed scope and a fixed price",
    text: "Before anything is built you see exactly what is included, what it costs and when it lands. No open-ended hourly billing, and no invoice that arrives larger than the estimate.",
  },
  {
    id: "step-build",
    title: "You see it working while it is being built",
    text: "You get something you can click on early and often, so the direction is corrected in days rather than discovered at handover. Feedback goes straight to the person writing the code.",
  },
  {
    id: "step-own",
    title: "It is yours to keep",
    text: "Source code, accounts and documentation are handed over in your name, on your infrastructure. Stay on for support if it helps, but nothing is held hostage to keep you subscribed.",
  },
]

export function AboutSection() {
  return (
    <FeatureShowcase
      eyebrow="About NLX"
      title={
        <>
          You talk to the person who{" "}
          <span className="bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] bg-clip-text text-transparent">
            actually builds it
          </span>
        </>
      }
      description="NLX is an independent AI automation and software studio. We build WhatsApp and AI chatbots, automate the repetitive work between your tools, and write the custom software — web, mobile or desktop — that off-the-shelf products never quite fit. No account managers, no hand-offs, no ticket queue."
      stats={[
        "Independent studio",
        "Fixed scope, fixed price",
        "You own the code",
      ]}
      steps={steps}
      tabs={tabs}
      defaultTab="automation"
      primaryCta={{ label: "Start a conversation", href: "#contact" }}
      secondaryCta={{ label: "See what we build", href: "#services" }}
    />
  )
}
