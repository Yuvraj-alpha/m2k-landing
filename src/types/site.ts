export interface NavItem {
  label: string;
  href: string;
}

export interface SiteAddress {
  street: string;
  locality: string;
  region: string;
  postalCode: string;
  country: string;
  countryCode: string;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  url: string;
  founded: number;
  address: SiteAddress;
  /** E.164 format — required for tel: links and LocalBusiness JSON-LD. */
  phones: readonly string[];
  email: string;
  /** Digits only, no `+` — WhatsApp deep links reject the plus sign. */
  whatsapp: string;
  nav: readonly NavItem[];
  certifications: readonly string[];
}
