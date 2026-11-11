// Off the clock stickers. Each one is an SVG in src/icons/ named "sticker-<id>".
// x is % of the board width and y is px from the top of the board (desktop only;
// phones get a loose two-column scatter in app.js). The modal reads kicker, title,
// body and extra (an empty extra hides the grey note).
export interface Sticker {
  id: string;
  label: string;
  x: number;
  y: number;
  rot: number;
  kicker: string;
  title: string;
  body: string;
  extra: string;
}

export const stickersData: Sticker[] = [
  {
    id: "print",
    label: "Screen printing",
    x: 42,
    y: 24,
    rot: 5,
    kicker: "A fact about me",
    title: "Screen printing",
    body: "I screen printed on the side from 2016 until January 2026, and some of my best memories are from that shop. I closed it to focus on web work and spend more time with my kids.",
    extra: "Print taught me to care about the small stuff before anyone handed me a CSS file.",
  },
  {
    id: "golf",
    label: "Golf",
    x: 7,
    y: 40,
    rot: -8,
    kicker: "Golf",
    title: "Weekend rounds",
    body: "Golf is a family thing for us. My son is already out on the course with me.",
    extra: "Home course: Monroe Golf and Country Club. Last round: a 92, and I’ll take it.",
  },
  {
    id: "cocktail",
    label: "Cocktails",
    x: 24,
    y: 520,
    rot: 6,
    kicker: "The bar cart",
    title: "Something bitter",
    body: "Usually an Old Fashioned or a Negroni, depending on my mood. That Campari is a big part of why this site is red.",
    extra: "I built a little cocktail journal app so my wife and I can both rate what we mix.",
  },
  {
    id: "espresso",
    label: "Espresso",
    x: 84,
    y: 36,
    rot: 7,
    kicker: "Espresso",
    title: "Before email",
    body: "A cortado comes before email. Every time.",
    extra: "",
  },
  {
    id: "house",
    label: "The new house",
    x: 88,
    y: 290,
    rot: -6,
    kicker: "At home",
    title: "The new house",
    body: "We’re settling into a new place. Right now I’m turning the garage into a home office.",
    extra: "",
  },
  {
    id: "dad",
    label: "Dad of two",
    x: 64,
    y: 540,
    rot: -7,
    kicker: "Family",
    title: "Dad of two",
    body: "A four-year-old who’s already swinging a golf club, and a one-year-old daughter who has everyone wrapped around her finger.",
    extra: "",
  },
  {
    id: "grill",
    label: "Cooking on the grill",
    x: 84,
    y: 560,
    rot: 4,
    kicker: "In the kitchen",
    title: "The smoker",
    body: "When I’m not cooking up websites, it’s brisket or burnt ends on my Weber Smoky Mountain.",
    extra: "",
  },
  {
    id: "pin",
    label: "Monroe, North Carolina",
    x: 8,
    y: 300,
    rot: 3,
    kicker: "Home base",
    title: "Monroe, North Carolina",
    body: "Just outside Charlotte.",
    extra: "Before that, school and my first web jobs were in New Jersey.",
  },
];
