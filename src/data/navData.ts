// Drives the floating progress nav and the "Back to" links in the contact band.
// Every target is a section id on the homepage carrying data-progress-nav-anchor.
export interface NavItem {
  title: string;
  href: string;
}

export const navData: NavItem[] = [
  { title: "Work", href: "/#work" },
  { title: "Story", href: "/#about" },
  { title: "Build", href: "/#build" },
  { title: "AI", href: "/#ai" },
  { title: "Off the clock", href: "/#offclock" },
];

export const contactHref = "/#reach";

export const legalNav: NavItem[] = [
  { title: "Privacy Policy", href: "/privacy-policy/" },
  { title: "Terms & Conditions", href: "/terms-and-conditions/" },
  { title: "Accessibility", href: "/accessibility/" },
];
