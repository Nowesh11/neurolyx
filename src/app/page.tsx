import { AboutSection } from "@/components/about-section"
import { ContactSection } from "@/components/contact-section"
import { HeroSection } from "@/components/hero-section"
import { PortfolioSection } from "@/components/portfolio-section"
import { PricingPlans } from "@/components/pricing-plans"
import { ServicesSection } from "@/components/services-section"
import { TechStackSection } from "@/components/tech-stack-section"

export default function Page() {
  return (
    <>
      <div id="home">
        <HeroSection />
      </div>

      <section id="services">
        <ServicesSection />
      </section>

      <section id="about">
        <AboutSection />
      </section>

      <section id="portfolio">
        <PortfolioSection />
      </section>

      <section id="stack">
        <TechStackSection />
      </section>

      <section id="pricing">
        <PricingPlans />
      </section>

      <section id="contact">
        <ContactSection />
      </section>
    </>
  )
}
