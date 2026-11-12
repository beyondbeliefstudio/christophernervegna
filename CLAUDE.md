# CLAUDE.md: christophernervegna.com

Chris Nervegna's personal portfolio. Built on the same conventions as the Astro Starter (see `quantum-home-cares/CLAUDE.md`). Read this before touching any file.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [Astro](https://astro.build) | Framework (static output, file-based routing) |
| SASS/SCSS | Styling (`src/styles/global.scss` + scoped component styles) |
| GSAP (ScrollTrigger, Flip, InertiaPlugin) | All animation, in `src/js/app.js` |
| astro-icon | SVG icons and illustrations from `src/icons/` |
| @astrojs/mdx, @astrojs/sitemap | MDX support, auto sitemap |
| Prettier + prettier-plugin-astro | Formatting (`npm run format`) |
| Netlify | Hosting, forms, two functions (chat + poll), Blobs |
| Google Analytics + Ahrefs + Userback | Wired through `.env`, silent until keys are set |

---

## Folder Structure

```
src/
  assets/photos/   # Photos Astro optimizes (import + <Image>), e.g. chris-hero.jpg
  components/      # PascalCase .astro sections and primitives
  data/            # siteData.ts, navData.ts, homeData.ts, stickersData.ts, work.json, facts.json, polls.json
  icons/           # SVGs for astro-icon: UI icons, art-* illustrations, sticker-* stickers
  integrations/    # strip-html-comments.mjs
  js/app.js        # ALL client-side JS
  layouts/         # BaseHead, Layout, Nav, Footer
  pages/           # index, 404, privacy-policy, terms-and-conditions, accessibility, submit-contact
  styles/          # global.scss (one file, no partials)
  content.config.ts
public/
  favicon.svg, og-image.png (1200x630)
  fonts/           # Self-hosted Funnel Display, Funnel Sans, Geist Mono (latin, variable)
  images/work/     # Work screenshots (4:3), referenced from work.json
  resume/          # The two resume PDFs
netlify/functions/ # ask.mjs (chat), poll.mjs (poll tallies)
scripts/           # capture-work.mjs (npm run shots)
```

Path aliases (tsconfig): `@/*` → `src/*`, `@/ui/*` → `src/components/ui/*`. Always use them, never relative paths.

---

## Data Layer

- `siteData.ts` exports `baseData` (name, title, description, email, location, LinkedIn, studio, resume links, status line) and `mailtoHref`. Never hardcode contact details.
- `navData.ts` exports `navData` (the progress nav links, all `/#section`), `contactHref` and `legalNav`.
- `homeData.ts` holds every repeated homepage block: `trioData`, `chaptersData`, `toolsData`, `aiProjectsData`, `notesData`, `perfectDayData`. One-off headlines and paragraphs stay in their components.
- `stickersData.ts`: Off the clock stickers (position, rotation, modal copy, optional photo). Each `id` has an SVG at `src/icons/sticker-<id>.svg`. A sticker with `photo` (from `src/assets/crew/`) fills the popup header with it, and the sticker moves to the corner.
- `work.json` → the `work` content collection (`content.config.ts`). The order in the file is the order on the page. `where` must be `BentoBox` or `Beyond Belief` (a new value needs a schema change and a filter chip in `Work.astro`).
- `facts.json`: grounding for the chat function. `polls.json`: poll questions (the poll is built but not on the page).

---

## Layouts

- `BaseHead.astro`: the whole `<head>`. Takes `pageTitle`, `description`, `noindex`. Canonical, OG/Twitter, font preloads, Person schema, `app.js`, Analytics + Ahrefs. `PUBLIC_NOINDEX=true` noindexes a whole deploy.
- `Layout.astro`: BaseHead → skip link → `.page` (Nav, `<main id="main">`, Footer) → Chat → UserBack. `hideChat` hides the chat (legal and thank-you pages).
- `Nav.astro`: Osmo "One Page Progress Navigation" restyled as one dark floating bar (logo left, sliding links centered, red "Say hi" right). Reads `navData`.
- `Footer.astro`: one compact row under the contact band: section links from `navData` on the left, copyright (auto year) and `legalNav` on the right.

Every page passes a unique `pageTitle` (`Page | Chris Nervegna`) and `description` to `<Layout>`.

---

## Core Components

| Component | Purpose |
|---|---|
| `Heading.astro` | Every heading. `tag`, `size` (display · xxl · xl · l · m · s · xs), `fontFamily`, `weight`, `marginBottom`. No raw `<h1>`–`<h6>` in sections. |
| `Links.astro` | Every link-button. Variants: `primary` (Campari), `dark`, `light`, `outline-light`, `inline`. Wrap groups in `.btn-wrapper`. |
| `Buttons.astro` | `<button>` with the same variants. |
| `SecHead.astro` | The header every section opens with: speech bubble, `Heading`, optional one-line sub. Props: `red`, `dark`, `center`. |
| `Photo.astro` | Polaroid frame. Takes an imported image (optimized) or a URL; no `src` = labeled placeholder; caption optional. |
| `ScrollingText.astro` | The one marquee (slot content, CSS loop, JS clones items). Used by `OpenToWork.astro`. |
| `ContactForm.astro` | Netlify form with honeypot, posts to `/submit-contact/`. Lives in its own light section, `MessageForm.astro`, never inside the dark contact band. |
| `SimplePage.astro` | Shell for inner pages (bubble, title, lead, updated date, slot). |
| `Grain.astro` | Fixed film-grain overlay (Osmo "Film Grain Effect"), in Layout. Tile is `src/assets/noise.avif`; strength is `--grain-opacity` in global.scss (0 turns it off). |
| `Chat.astro` / `Poll.astro` | Markup + scoped styles only; behavior in `app.js`. |
| `Analytics`, `AhrefsAnalytics`, `UserBack` | Env-driven, skip in dev. |

Homepage order (`pages/index.astro`): Hero → OpenToWork → ThreeInOne → Work → About (Story) → Build → AI → WorkingWithMe → OffTheClock → MessageForm → Contact.

---

## CSS Architecture

One global file, `src/styles/global.scss`, imported once in `Layout.astro`: fonts, tokens, reset, base elements, `.btn` base, layout utilities, the shared brand primitives and forms. Everything else is a scoped `<style lang="scss">` in its component, written in BEM (`.block`, `&__element`, `&--modifier`). Use `:global()` only for markup that JS creates or for a child component's root class.

**Tokens (`:root`)**
- Brand: `--brand-primary` (Campari `#d9301f`), `--brand-primary-dark` (small red text), `--brand-secondary` (ink)
- Scales: `--light-000/050/100/200`, `--dark-900/800`
- Semantic: `--surface-primary` (white page), `--surface-secondary` (warm card), `--content-primary`, `--content-secondary`, `--content-on-primary`, `--border-color`
- Type: `--primary-family` (Funnel Display), `--secondary-family` (Funnel Sans), `--tertiary-family` (Geist Mono); `--_typography---font-size--display / h1–h6 / text-large / text-main / text-small`
- Spacing: `--_spacing---section-space--xl / large / main / small`, `--_spacing---space--1–8`
- Containers: `--site--width--sm/md/lg` (61rem / 105rem / 120rem); always `.container.container-md` for sections
- Radius: `--border-radius-small / medium / large (cards) / xl (bands) / round`
- `html { font-size: 16px }`. Lengths in rem; hairlines stay 1px.

**Shared primitives (global.scss):** `.card`, `.bubble` (`--red`), `.polaroid`, `.placeholder`, `.sticker-art`, `.logo-stop`, `.terms__content`, `.bg-dark` / `.bg-light` / `.bg-primary`, `.grid-auto-2/3`, `.content-md/lg/left`, form styles, `.hidden` (honeypot), `.sr-only`, `.skip-link`.

---

## Brand rules

- Light mode only. White ground, warm neutral cards, dark ink bands (Story, Contact, Footer), and Campari red used sparingly (buttons, the hero highlight, the hero photo panel, the Build red tile, the Working with me story, small accents).
- Every section starts with `SecHead`. The block under it changes section to section; never stack the same text-left/card-right split twice in a row (Osmo Supply is the reference for rhythm).
- Nothing tilts except photos, stickers, illustrations, the AI fan cards and the speech bubbles.
- Illustrations are sticker style: ink outline, flat fills, red accent, white die-cut edge (`.sticker-art`). Add new ones to `src/icons/art-*.svg`.
- Never a callout made of a colored vertical bar beside bold or pull-quote text. Never an eyebrow or pill above a headline. No numbered sections, "Fig. 01" captions, step blocks, generic icon-card rows or stat strips (the Three in one trio is the one exception, with custom illustrations).
- No em dashes anywhere, in copy or comments. Copy is first person, conversational, with contractions.

---

## Client-Side JavaScript (`src/js/app.js`)

Single entry point, loaded from `BaseHead.astro`. Every init function guards on its own markup:

`initProgressNav` · `initHeroDots` (Osmo Glowing Dots Grid, `opacity .3`) · `initScrollerAnimations` · `initListGridToggle` (Osmo List/Grid Flip) · `initWorkFilters` (Flip + height tween so the page doesn't jump) · `initStickers` (drag + modal; data-* on each sticker) · `initChat` (Netlify function + local fallback answers) · `initPoll`

All of it respects `prefers-reduced-motion`.

---

## Content workflows

- **New work example:** add an entry to `work.json` with `"image": ""`, then `npm run shots` (Playwright, 1440×1080). It saves `public/images/work/<id>.jpg` and fills in the path. `npm run shots -- --all` retakes everything. First run: `npx playwright install chromium`.
- **Real photos:** drop them in `src/assets/photos/`, import in the component and pass to `Photo`. Personal photos for the sticker popups live in `src/assets/crew/`.
- **AI tool screenshots:** `src/assets/ai/` (1440×900, 16:10), mapped in `AI.astro`.
- **Poll:** add `<Poll />` to a section to turn it back on.

---

## SEO

- `site` is set in `astro.config.mjs`; `trailingSlash: "always"`, so internal links end in `/`.
- Sitemap excludes `/submit-contact/` (it also carries `noindex`). Keep the two in step.
- `og-image.png` is 1200×630 in `public/`.

---

## Environment Variables

See `.env.example`. `PUBLIC_GA_MEASUREMENT_ID`, `PUBLIC_AHREFS_DATA_KEY`, `PUBLIC_USERBACK_TOKEN`, `PUBLIC_NOINDEX`. Netlify functions need `ANTHROPIC_API_KEY` (optional `ASK_MODEL`) set in the Netlify UI.

---

## Netlify

`netlify.toml`: `npm ci --include=optional && npm run build`, Node 22, functions in `netlify/functions`, security headers on `/*`, immutable caching on `/fonts/*` and `/_astro/*`. The contact form needs Form detection on in the Netlify UI. The poll function stores tallies in Netlify Blobs (store `poll`).

---

## Dev Commands

```bash
npm run dev      # dev server
npm run build    # production build → dist/
npm run preview  # preview dist/
npm run format   # Prettier
npm run shots    # screenshot work examples missing an image
```
