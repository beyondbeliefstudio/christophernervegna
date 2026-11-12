// Homepage content that renders as repeated blocks. Single paragraphs and
// headlines stay in their section components; anything that maps to a list
// lives here.

// Three in one (ThreeInOne.astro). `icon` is an SVG in src/icons/.
export const trioData = [
  {
    title: "I design it",
    icon: "art-design",
    text: "I trained as a graphic designer, so the look comes first: type, color, photography, and a layout shaped around what the business needs a visitor to do. Every site should look like it could only belong to that one client.",
  },
  {
    title: "I build it",
    icon: "art-build",
    text: "Then I build it myself, usually straight from idea to code, so nothing gets lost in a handoff. That can be on Webflow, WordPress or whatever platform your team already uses. Given the choice, I&rsquo;ll write it by hand in HTML, CSS and JavaScript.",
  },
  {
    title: "I explain it",
    icon: "art-explain",
    text: "And I&rsquo;m the one on the call. I scope what an owner really needs, walk them through how the thing works, and turn a developer&rsquo;s &ldquo;it depends&rdquo; into a decision a person can make.",
  },
];

// Story timeline (About.astro): one entry per role. `current: true` draws the
// red timeline segment. `points` are the responsibilities, kept short and direct.
export const chaptersData = [
  {
    when: "Jul 2019 to Dec 2020",
    role: "Graphic Designer",
    org: "Internet Creations",
    points: [
      "Designed and built Salesforce Community Cloud pages for an enterprise SaaS marketing team",
      "Built Marketo landing pages and email templates for campaigns",
      "Made launch, event and social assets, plus short videos",
    ],
    current: false,
  },
  {
    when: "Aug 2020 to now",
    role: "Owner and developer",
    org: "Beyond Belief Web Design",
    link: "https://beyondbeliefwebdesign.com",
    points: [
      "Find and pitch local businesses, usually with a homepage concept already built",
      "Hand-code every site in Astro, deployed with Git and Netlify",
      "Handle local SEO, Google Business Profile, analytics and Search Console",
      "Walk owners through DNS, hosting and email, and stay on for updates",
    ],
    current: true,
  },
  {
    when: "Dec 2020 to now",
    role: "Senior Web Designer",
    org: "BentoBox (acquired by Clover)",
    points: [
      "Design and build custom sites for restaurants and hospitality groups, dozens in flight at once",
      "Lead design calls directly with owners and marketing teams",
      "Set the front-end standards and custom CSS and JavaScript the design team builds with",
      "Own the VIP and at-risk accounts, and get on the call when a client is ready to walk",
      "Mentor a team of designers, run design reviews, and wrote the team&rsquo;s training docs",
    ],
    current: true,
  },
];

// Build (Build.astro): the tool chips.
export const toolsData = [
  "Astro",
  "HTML",
  "CSS",
  "JavaScript",
  "Git",
  "Netlify",
  "Supabase",
  "Webflow",
  "WordPress",
  "Squarespace",
  "Wix",
  "BentoBox",
  "Figma",
  "Adobe CC",
  "GA4",
  "Tag Manager",
  "Search Console",
  "Lighthouse",
];

// AI (AI.astro): the three tools.
export const aiProjectsData = [
  {
    name: "The Cookbook",
    tag: "For the BentoBox design team",
    what: "A recipe library for code, so the snippets and components we kept rewriting live in one searchable place.",
    stack: "Astro, Supabase, CodeMirror",
    shot: "The Cookbook: a searchable grid of code snippets with tag filters",
    img: "cookbook",
    tone: "ink",
  },
  {
    name: "CartIQ",
    tag: "Working prototype",
    what: "Our grocery bill kept surprising us, so I built a receipt scanner. Snap a photo and Claude reads every line item into a budget tracker.",
    stack: "React, Supabase, Anthropic API",
    shot: "CartIQ dashboard: monthly grocery spend against budget, by category",
    img: "cartiq",
    tone: "red",
  },
  {
    name: "HomePlate",
    tag: "Working prototype",
    what: "A weekly meal planner for our family: a pool of meals we like, a plan for the week, and a tap to stretch one dinner across two nights.",
    stack: "Built with Claude Code",
    shot: "HomePlate dashboard: most cooked meals, top proteins and recommendations",
    img: "homeplate",
    tone: "crema",
  },
];

// Working with me (WorkingWithMe.astro): the three short notes.
export const notesData = [
  {
    title: "On client calls",
    text: "I scope what a client needs before anyone opens a design file. When an account is frustrated, I&rsquo;m usually the one who picks up the phone.",
  },
  {
    title: "Inside the team",
    text: "Training designers, writing the docs, and reviewing work with specific notes on how to make it better.",
  },
  {
    title: "At my own studio",
    text: "The whole cycle, from the first cold message to the pitch to teaching an owner to update their own site.",
  },
];

// Story (About.astro): "A perfect day", the strip under the chapters.
export const perfectDayData = [
  {
    time: "7:00 am",
    title: "Check on everything",
    text: "A lap around every site I look after: analytics, uptime, forms, and anything that needs a fix before the owner notices.",
  },
  {
    time: "9:00 am",
    title: "Discovery call",
    text: "I listen to how the business actually runs and find where the website is letting them down, then turn it into a plan to bring in more business.",
  },
  {
    time: "10:30 am",
    title: "Design and build",
    text: "Heads down. I nail the copy with AI&rsquo;s help, rough out how the site flows, then build it straight in code with their brand guide. No brand guide? I&rsquo;ll make one.",
  },
  {
    time: "4:30 pm",
    title: "Launch walkthrough",
    text: "A site that&rsquo;s ready goes live. I show the owner what changed, why it works, and how to keep it up to date.",
  },
];
