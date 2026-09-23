"use client"

import {
  Accent,
  Reveal,
  SectionLabel,
  SectionTitle,
} from "@/components/ui/section-heading"
import { ServicesTabs, type ServiceItem } from "@/components/ui/services-tabs"

const services: ServiceItem[] = [
  {
    id: "whatsapp",
    title: "WhatsApp Chatbots",
    tagline: "Every enquiry answered in seconds, day or night.",
    description:
      "We build WhatsApp assistants that qualify leads, take bookings and hand off to your team with the full conversation already in context.",
    deliverables: [
      "WhatsApp Cloud API set-up",
      "Lead qualification flows",
      "Bookings and reminders",
      "Human hand-off with context",
    ],
    image: {
      src: "/img/svc-whatsapp.jpg",
      alt: "Frosted glass chat bubbles linked by a thread of warm gold light",
    },
  },
  {
    id: "agents",
    title: "AI Chatbots & Agents",
    tagline: "Answers from what your business actually knows.",
    description:
      "Assistants trained on your own documents, pricing and processes — so they answer from fact, not guesswork, and escalate when they are unsure.",
    deliverables: [
      "Trained on your docs and pricing",
      "Website and in-app chat",
      "Escalates when unsure",
      "Conversation insights",
    ],
    image: {
      src: "/img/svc-agents.jpg",
      alt: "Polished gold spheres joined by fine lines into a network",
    },
  },
  {
    id: "automation",
    title: "Workflow Automation",
    tagline: "The busywork between your tools, handled.",
    description:
      "Quotes, invoices, onboarding and follow-ups run themselves, wired straight into the systems your team already uses.",
    deliverables: [
      "Quotes and invoices",
      "Onboarding sequences",
      "CRM and spreadsheet sync",
      "Follow-ups that send themselves",
    ],
    image: {
      src: "/img/svc-automation.jpg",
      alt: "Interlocking champagne-gold rings and ribbons forming a closed loop",
    },
  },
  {
    id: "software",
    title: "Custom Software",
    tagline: "Built around how you actually operate.",
    description:
      "Internal tools and customer-facing apps shaped to your process, instead of bending your process to fit software you rent forever.",
    deliverables: [
      "Web apps and portals",
      "iOS and Android apps",
      "Windows and macOS desktop",
      "Internal admin tools",
    ],
    image: {
      src: "/img/svc-software.jpg",
      alt: "Stacked translucent glass panels edged in gold light",
    },
  },
  {
    id: "analytics",
    title: "Dashboards & Analytics",
    tagline: "Decisions from today's numbers, not last month's.",
    description:
      "Live dashboards pull from every system you run, so one screen tells you what is working — and alerts you when something drifts.",
    deliverables: [
      "Live KPI dashboards",
      "Multi-system data pipelines",
      "Alerts when numbers drift",
      "Scheduled reports",
    ],
    image: {
      src: "/img/svc-analytics.jpg",
      alt: "Rising bars sculpted in brushed gold and frosted glass",
    },
  },
]

export function ServicesSection() {
  return (
    <div className="relative mx-auto w-full max-w-7xl px-6 py-24 md:py-32">
      <Reveal className="mb-14 grid grid-cols-1 gap-8 lg:mb-20 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <SectionLabel index="01">What we do</SectionLabel>
          <SectionTitle className="mt-6">
            Built end to end, <Accent>shipped fast.</Accent>
          </SectionTitle>
        </div>
        <p className="max-w-md text-base leading-relaxed text-text-secondary lg:col-span-5 lg:justify-self-end">
          Five ways we take the slow, manual parts of your business and make
          them run on their own. Pick one to see what&apos;s included.
        </p>
      </Reveal>

      <Reveal delay={120}>
        <ServicesTabs services={services} />
      </Reveal>
    </div>
  )
}
