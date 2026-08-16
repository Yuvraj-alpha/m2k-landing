import type { SiteConfig } from "@/types/site";

/**
 * Company facts. Sourced from the legacy static site and the M2K catalogue.
 *
 * Anything here that is a *claim* (years of experience, certifications) should
 * be confirmed with M2K before launch — see PLAN.md "Open Items".
 */
export const siteConfig = {
  name: "M2K Packpro Industries",
  shortName: "M2K Packpro",
  tagline: "Experts in Special Film Manufacturing",
  description:
    "M2K Packpro Industries manufactures machine grade, manual grade, silage and coloured stretch films from 100% virgin LLDPE at our Ludhiana, Punjab facility. Backed by 30 years of experience in plastic packaging.",

  // TODO: update once the production domain is live.
  url: "https://m2kpackpro.in",

  // The legacy site says "backed by experienced leaders in plastic packaging
  // for the past 30 years". That is the leadership's experience — it does NOT
  // establish when M2K Packpro itself was founded, so no "Since <year>" claim
  // appears anywhere on this site.
  // TODO: ask M2K for the actual incorporation year; if they have one, an
  // "Established <year>" line is stronger trust signal than "30 years".
  experienceYears: 30,

  address: {
    street: "Daba Road, Industrial Area",
    locality: "Ludhiana",
    region: "Punjab",
    postalCode: "141014",
    country: "India",
    countryCode: "IN",
  },

  phones: ["+919878730079"],
  email: "admin@m2kpackpro.in",
  whatsapp: "919878730079",

  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "Quality", href: "/quality" },
    { label: "Contact", href: "/contact" },
  ],

  certifications: [
    "MSME Registered",
    "Ministry of MSME, Govt. of India",
    "Make In India",
  ],
} as const satisfies SiteConfig;
