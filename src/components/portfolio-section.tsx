"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import {
  CircularGallery,
  type GalleryItem,
} from "@/components/ui/circular-gallery"

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  REPLACE THIS ARRAY WITH REAL WORK.
 *
 *  These are illustrative concepts, not delivered client projects, so the
 *  copy says so on the page and every `href` points at the contact form
 *  rather than a fake case study. Presenting invented builds as a track
 *  record would mislead the people deciding whether to hire you.
 *
 *  Swapping in the real thing is just this array: set `href` to the live
 *  site or case study (external URLs open in a new tab automatically), drop
 *  the screenshot in `public/work/`, and delete the `tag: "Concept"` line
 *  plus the disclaimer under the heading below.
 * ─────────────────────────────────────────────────────────────────────────
 */
const projects: GalleryItem[] = [
  {
    title: "Clinic booking assistant",
    description:
      "A WhatsApp assistant that answers enquiries, checks the calendar and books the slot — without the front desk touching it.",
    href: "#contact",
    tag: "Concept",
    image: {
      url: "/work/clinic-booking.png",
      alt: "Abstract glowing calendar and message flow",
    },
  },
  {
    title: "Retail order assistant",
    description:
      "Customers ask for stock, sizing and delivery times in chat and get answers pulled straight from the live catalogue.",
    href: "#contact",
    tag: "Concept",
    image: {
      url: "/work/retail-assistant.png",
      alt: "Abstract retail product grid lit in blue",
    },
  },
  {
    title: "Field service dispatch",
    description:
      "Jobs land, get assigned to the nearest technician and close out with photos and a signature from the phone.",
    href: "#contact",
    tag: "Concept",
    image: {
      url: "/work/field-service.png",
      alt: "Abstract map and routing lines",
    },
  },
  {
    title: "Operations control tower",
    description:
      "One screen pulling from every system the business runs, so the day starts with current numbers instead of a spreadsheet.",
    href: "#contact",
    tag: "Concept",
    image: {
      url: "/work/control-tower.png",
      alt: "Abstract layered control panels",
    },
  },
  {
    title: "Live operations dashboard",
    description:
      "Revenue, jobs and response times updating as they happen, with alerts when something drifts out of range.",
    href: "#contact",
    tag: "Concept",
    image: {
      url: "/work/ops-dashboard.jpg",
      alt: "Glowing charts on a dark glass panel",
    },
  },
  {
    title: "Invoice & document flow",
    description:
      "Quotes, invoices and follow-ups generated, sent and chased automatically, wired into the accounting tools already in use.",
    href: "#contact",
    tag: "Concept",
    image: {
      url: "/work/invoice-automation.jpg",
      alt: "Translucent documents flowing along a lit arc",
    },
  },
]

export function PortfolioSection() {
  // The gallery turns as this tall element scrolls past; the viewport inside
  // it sticks. Keeping the track here rather than inside the gallery lets the
  // gallery stay a plain, reusable component.
  const trackRef = React.useRef<HTMLDivElement>(null)

  return (
    <div ref={trackRef} className="relative w-full bg-background h-[280vh]">
      <div className="sticky top-0 flex h-dvh w-full flex-col items-center justify-center overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 50%, rgba(59,130,246,0.12) 0%, rgba(8,10,15,0) 70%)",
          }}
        />

        <div className="absolute inset-x-0 top-20 z-20 px-6 text-center sm:top-24">
          <Badge
            variant="outline"
            className="mb-4 border-brand-primary/30 bg-brand-primary/10 text-brand-primary"
          >
            Selected work
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
            What this looks like{" "}
            <span className="bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] bg-clip-text text-transparent">
              in practice
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-text-secondary">
            Concept pieces showing the kind of thing we build — real case
            studies go up here as projects ship. Scroll to turn the carousel.
          </p>
        </div>

        {/* Nudged down so the ring clears the heading block above it — the
            cards are centred in the viewport, which otherwise puts the front
            card's top edge right under the sub-heading. */}
        <div className="absolute inset-0 z-10 translate-y-16 sm:translate-y-20">
          <CircularGallery items={projects} trackRef={trackRef} turns={1} />
        </div>
      </div>
    </div>
  )
}
