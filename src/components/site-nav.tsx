"use client"

import { Home, Layers, Briefcase, User, Code2, Tag, Mail } from "lucide-react"
import { FloatingNavbar, type NavItem } from "@/components/ui/floating-navbar"

/**
 * The nav items carry `icon` as a component reference, and lucide-react ships
 * without a "use client" directive — so the array cannot be built in the
 * (server) root layout and passed across the RSC boundary. Declaring it in this
 * client module keeps the layout a Server Component.
 */
const navItems: NavItem[] = [
  { name: "Home", url: "#home", icon: Home },
  { name: "Services", url: "#services", icon: Layers },
  { name: "About", url: "#about", icon: User },
  { name: "Work", url: "#portfolio", icon: Briefcase },
  { name: "Stack", url: "#stack", icon: Code2 },
  { name: "Pricing", url: "#pricing", icon: Tag },
  { name: "Contact", url: "#contact", icon: Mail },
]

export function SiteNav() {
  return <FloatingNavbar items={navItems} />
}
