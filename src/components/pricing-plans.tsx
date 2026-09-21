"use client"

import {
  BarChart3,
  Boxes,
  Database,
  Globe,
  MessageCircle,
  MonitorSmartphone,
  Search,
  Workflow,
} from "lucide-react"

import {
  PricingSection,
  type PricingPlan,
} from "@/components/ui/pricing-section"

/**
 * NLX pricing.
 *
 * Ranges, not fixed figures: the bottom of each band is a realistic small
 * build and the top is where that kind of work starts turning into the next
 * tier up. Nothing here claims a track record — it is just what the work
 * costs.
 */
const plans: PricingPlan[] = [
  {
    name: "Launch",
    description:
      "Landing pages, small business sites and simple desktop tools — online quickly, without the agency overhead.",
    priceFrom: 1000,
    priceTo: 5000,
    priceNote: "Depends on page count, content and integrations.",
    buttonText: "Start a project",
    href: "#contact",
    features: [
      { text: "Landing page or small website", icon: <Globe size={18} /> },
      {
        text: "Simple desktop app (Windows / macOS)",
        icon: <MonitorSmartphone size={18} />,
      },
      { text: "Mobile first, with on-page SEO", icon: <Search size={18} /> },
    ],
    includes: [
      "Included:",
      "Domain and hosting set up for you",
      "Contact form straight to your inbox",
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
    features: [
      {
        text: "WhatsApp or website chatbot",
        icon: <MessageCircle size={18} />,
      },
      {
        text: "Trained on your own docs and pricing",
        icon: <Database size={18} />,
      },
      {
        text: "Wired into the tools you already use",
        icon: <Workflow size={18} />,
      },
    ],
    includes: [
      "Everything in Launch, plus:",
      "Lead capture and qualification",
      "Booking and calendar integration",
      "Handover to a human with full context",
      "90 days of tuning as real messages come in",
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
    features: [
      { text: "Web, mobile or desktop application", icon: <Boxes size={18} /> },
      { text: "Dashboards and live reporting", icon: <BarChart3 size={18} /> },
      { text: "Integrations and data migration", icon: <Database size={18} /> },
    ],
    includes: [
      "Everything in Automate, plus:",
      "Discovery session and written spec",
      "Staged delivery you review as it is built",
      "Source code handed over in your name",
      "Optional care plan once you are live",
    ],
  },
]

export function PricingPlans() {
  return (
    <PricingSection
      eyebrow="Pricing"
      title={
        <>
          Fixed quotes, agreed{" "}
          <span className="bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] bg-clip-text text-transparent">
            before we start
          </span>
        </>
      }
      subtitle="These are the ranges most projects land in. Your exact number is fixed in writing after a short call, and it does not move unless you change the scope."
      plans={plans}
      footnote={
        <>
          Not sure which one you need? Most people are not.{" "}
          <a
            href="#contact"
            className="font-medium text-brand-primary underline-offset-4 hover:underline"
          >
            Describe the problem
          </a>{" "}
          and we&apos;ll tell you honestly what it takes — including if the
          answer is that you don&apos;t need us.
        </>
      }
    />
  )
}
