// Single source of truth for who this site is about. Pull contact details from
// here; never hardcode them in a component.
export const baseData = {
  title: "Chris Nervegna | Web designer and developer",
  name: "Chris Nervegna",
  fullName: "Christopher Nervegna",
  description:
    "Chris Nervegna designs websites, builds them on any platform or by hand, and can explain them to anyone in the room. Ten years, well over a hundred sites, based in Monroe, NC.",
  jobTitle: "Senior Web Designer",
  email: "christophernervegna@gmail.com",
  location: {
    city: "Monroe",
    state: "NC",
    full: "Monroe, NC",
  },
  social: {
    linkedin: "https://www.linkedin.com/in/chris-nervegna",
  },
  studio: {
    name: "Beyond Belief Web Design",
    url: "https://beyondbeliefwebdesign.com",
  },
  resumes: {
    web: {
      label: "Resume: Web design and development",
      href: "/resume/christopher-nervegna-resume-web-design.pdf",
    },
    solutions: {
      label: "Resume: Solutions engineering",
      href: "/resume/christopher-nervegna-resume-solutions-engineering.pdf",
    },
  },
  status:
    "Open to full-time roles in web design and development, web team leadership, and solutions engineering.",
  workPrefs:
    "Remote first, open to hybrid with a reasonable commute, and happy to travel. I can start right away.",
};

export const mailtoHref = `mailto:${baseData.email}`;
