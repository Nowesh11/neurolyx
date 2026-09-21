"use client";

import dynamic from "next/dynamic";

// Single source of truth for the number, shared with the contact section.
// This used to be a bare "https://wa.me/" with no number, so the hero's main
// CTA opened WhatsApp's homepage instead of a chat.
import { CONTACT_WHATSAPP_URL } from "@/lib/contact-schema";

/**
 * Three.js needs the browser's `window`/`canvas`, so the hero is loaded
 * client-side only. `ssr: false` is not allowed in a Server Component
 * (node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md), which is why
 * this wrapper is a Client Component rather than doing the import in page.tsx.
 */
const RobotHero = dynamic(() => import("@/components/ui/robot-hero"), {
  ssr: false,
  // Plain color placeholder at the hero's exact height, in the dark stage
  // colour so there is no white flash before the scene mounts.
  loading: () => <div className="h-dvh min-h-[600px] bg-[#080A0F]" />,
});

export function HeroSection() {
  return (
    <RobotHero
      onCtaClick={() =>
        window.open(CONTACT_WHATSAPP_URL, "_blank", "noopener,noreferrer")
      }
      onSecondaryCtaClick={() =>
        document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })
      }
    />
  );
}
