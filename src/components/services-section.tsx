"use client"

import {
  FeatureCarousel,
  type CarouselItem,
} from "@/components/ui/feature-carousel"

const services: CarouselItem[] = [
  {
    src: "/services/whatsapp-chatbots.png",
    alt: "Layered chat bubbles connected by a glowing conversation thread",
    title: "WhatsApp Chatbots",
    description:
      "Answer every enquiry the moment it arrives. We build WhatsApp assistants that qualify leads, take bookings and hand off to your team with the full conversation already in context.",
  },
  {
    src: "/services/ai-agents.png",
    alt: "Glowing cluster of connected nodes forming a neural network",
    title: "AI Chatbots & Agents",
    description:
      "Assistants trained on your own documents, pricing and processes — so they answer from what your business actually knows, not from guesswork, and escalate when they are unsure.",
  },
  {
    src: "/services/automation.png",
    alt: "Interlocking rings and flowing pipelines forming a closed loop",
    title: "Workflow Automation",
    description:
      "The repetitive work between your tools, handled. Quotes, invoices, onboarding and follow-ups run themselves, wired straight into the systems your team already uses.",
  },
  {
    src: "/services/custom-software.png",
    alt: "Translucent application panels floating in layered depth",
    title: "Custom Software",
    description:
      "Internal tools and customer-facing apps built around how you actually operate, instead of bending your process to fit off-the-shelf software you are renting forever.",
  },
  {
    src: "/services/analytics.png",
    alt: "Rising luminous bars beside an ascending line graph",
    title: "Dashboards & Analytics",
    description:
      "One place to see what is working. Live dashboards pull from every system you run, so decisions come from current numbers rather than last month's spreadsheet.",
  },
]

export function ServicesSection() {
  return (
    <FeatureCarousel
      eyebrow="What we do"
      title={
        <>
          Built end to end,{" "}
          <span className="bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] bg-clip-text text-transparent">
            shipped fast
          </span>
        </>
      }
      subtitle="Five ways we take the slow, manual parts of your business and make them run on their own."
      items={services}
    />
  )
}
