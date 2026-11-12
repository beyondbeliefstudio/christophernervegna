// Drives the floating progress nav and the "Back to" links in the contact band.
// Every target is a section id on the homepage carrying data-progress-nav-anchor.
export interface NavItem {
  title: string;
  href: string;
  /** The section's speech-bubble question, shown under the link in the mobile menu. */
  ask?: string;
}

export const navData: NavItem[] = [
  { title: "Work", href: "/#work", ask: "Can I see some?" },
  { title: "Story", href: "/#about", ask: "How’d you get here?" },
  { title: "Build", href: "/#build", ask: "Do you actually write the code?" },
  { title: "AI", href: "/#ai", ask: "Do you use AI?" },
  { title: "Off the clock", href: "/#offclock", ask: "And when you’re not working?" },
];

export const contactHref = "/#reach";

export const legalNav: NavItem[] = [
  { title: "Privacy Policy", href: "/privacy-policy/" },
  { title: "Terms & Conditions", href: "/terms-and-conditions/" },
  { title: "Accessibility", href: "/accessibility/" },
];
