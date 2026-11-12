import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, Flip, InertiaPlugin, SplitText);

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ==========================================
// INITIALIZATION
// Every init function guards on its own markup, so pages without a feature
// (the legal pages, the thank-you page) just skip it.
// ==========================================
window.addEventListener("DOMContentLoaded", () => {
  initReveals();
  initProgressNav();
  initHeroDots();
  initScrollerAnimations();
  initListGridToggle();
  initWorkFilters();
  initStickers();
  initChat();
  initPoll();
});

// ==========================================
// REVEALS
// One system for every entrance on the site. Mark an element with
// data-reveal="<type>" and it animates in once, as it scrolls into view:
//   lines    headings rise line by line out of a mask (SplitText)
//   up       fades up a short distance
//   stagger  its children fade up one after another
//   pop      speech bubbles: a small springy scale-in
//   media    images: rise, settle from a slight scale
//   sticker  the sticker art spins and springs in
//   fade     opacity only
//   drop     the nav: slides down into place
// Inside [data-reveal-onload] (the hero) elements play on page load instead,
// timed by data-reveal-delay. Things that enter together are staggered, and
// data-reveal-start overrides the scroll point (default "top 88%").
// Every tween clears its transform at the end, so the CSS (tilts, hovers,
// breakpoints) takes back over. Reduced motion skips all of it.
// ==========================================
function initReveals() {
  const root = document.documentElement;
  const all = [...document.querySelectorAll("[data-reveal]")];
  if (!all.length || !root.classList.contains("is-reveal") || reduceMotion()) {
    root.classList.add("reveal-ready");
    return;
  }

  const ease = "expo.out";
  // Hide with inline styles, then hand off from the pre-paint CSS rule.
  gsap.set(all, { autoAlpha: 0 });
  root.classList.add("reveal-ready");

  const show = el => gsap.set(el, { autoAlpha: 1 });
  // CSS transitions on transform (button hovers, stickers, thumbnails) would make
  // an element trail the tween and then glide into place after it ends. Switch
  // them off while a reveal runs; clearProps hands them back at the end.
  const still = targets => gsap.set(targets, { transition: "none" });

  const types = {
    lines(el, delay) {
      const split = SplitText.create(el, { type: "lines", mask: "lines" });
      show(el);
      gsap.from(split.lines, {
        yPercent: 110,
        duration: 1.25,
        ease,
        stagger: 0.09,
        delay,
        onComplete: () => split.revert(),
      });
    },
    up(el, delay) {
      still(el);
      gsap.to(el, { autoAlpha: 1, duration: 1, ease: "power2.out", delay });
      gsap.from(el, { y: "+=36", duration: 1.2, ease, delay, clearProps: "transform,transition" });
    },
    stagger(el, delay) {
      const kids = [...el.children];
      show(el);
      still(kids);
      gsap.fromTo(
        kids,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 1, ease: "power2.out", stagger: 0.1, delay }
      );
      gsap.from(kids, {
        y: "+=48",
        duration: 1.3,
        ease,
        stagger: 0.1,
        delay,
        clearProps: "transform,transition",
      });
    },
    pop(el, delay) {
      still(el);
      gsap.to(el, { autoAlpha: 1, duration: 0.4, ease: "power1.out", delay });
      gsap.from(el, {
        scale: 0.6,
        y: "+=12",
        transformOrigin: "0% 100%",
        duration: 0.9,
        ease: "back.out(2.2)",
        delay,
        clearProps: "transform,transformOrigin,transition",
      });
    },
    media(el, delay) {
      still(el);
      gsap.to(el, { autoAlpha: 1, duration: 1.1, ease: "power2.out", delay });
      gsap.from(el, {
        y: "+=60",
        scale: 0.96,
        duration: 1.6,
        ease,
        delay,
        clearProps: "transform,transition",
      });
    },
    sticker(el, delay) {
      const art = el.querySelector("svg");
      show(el);
      if (!art) return;
      still(art);
      gsap.from(art, {
        autoAlpha: 0,
        scale: 0.3,
        rotation: gsap.utils.random(-35, 35),
        duration: 1,
        ease: "back.out(1.7)",
        delay,
        clearProps: "all",
      });
    },
    fade(el, delay) {
      gsap.to(el, { autoAlpha: 1, duration: 1.2, ease: "power2.out", delay });
    },
    drop(el, delay) {
      still(el);
      gsap.to(el, { autoAlpha: 1, duration: 0.8, ease: "power2.out", delay });
      gsap.from(el, { y: "-=24", duration: 1.2, ease, delay, clearProps: "transform,transition" });
    },
  };

  const play = (el, delay = 0) => (types[el.dataset.reveal] || types.up)(el, delay);
  const onload = el => el.closest("[data-reveal-onload]") || el.dataset.reveal === "drop";

  // Wait for the fonts so SplitText measures real line breaks.
  document.fonts.ready.then(() => {
    all.filter(onload).forEach(el => play(el, parseFloat(el.dataset.revealDelay) || 0));

    const scrolled = all.filter(el => !onload(el));
    ScrollTrigger.batch(
      scrolled.filter(el => !el.dataset.revealStart),
      {
        start: "top 88%",
        once: true,
        onEnter: batch => {
          // A fast jump (nav link, scrollbar drag) can enter a lot at once.
          // Anything already scrolled past just appears; what's on screen
          // plays, with the stagger capped so nothing waits long.
          let i = 0;
          batch.forEach(el => {
            if (el.getBoundingClientRect().bottom < 0) show(el);
            else play(el, Math.min(i++, 5) * 0.12);
          });
        },
      }
    );
    // The Work filters, the list/grid toggle and late images all change the
    // page height; re-measure the triggers whenever it does.
    let refreshTimer;
    let lastHeight = document.body.scrollHeight;
    new ResizeObserver(() => {
      if (Math.abs(document.body.scrollHeight - lastHeight) < 2) return;
      lastHeight = document.body.scrollHeight;
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
    }).observe(document.body);

    // A custom start (data-reveal-start), e.g. the footer, which sits too
    // close to the bottom of the page to ever reach 88%.
    scrolled
      .filter(el => el.dataset.revealStart)
      .forEach(el => {
        ScrollTrigger.create({
          trigger: el,
          start: el.dataset.revealStart,
          once: true,
          onEnter: () => play(el),
        });
      });
  });
}

// ==========================================
// PROGRESS NAV
// Osmo Supply "One Page Progress Navigation": the pill slides to whichever
// section carrying data-progress-nav-anchor is mid-screen.
// ==========================================
function initProgressNav() {
  const list = document.querySelector("[data-progress-nav-list]");
  const anchors = document.querySelectorAll("[data-progress-nav-anchor]");
  if (!list || !anchors.length) return;

  const nav = list.closest(".progress-nav");
  const indicator = list.querySelector(".progress-nav__indicator");
  let current = null;

  function moveIndicator(link) {
    const parent = list.getBoundingClientRect();
    const rect = link.getBoundingClientRect();
    const w = list.offsetWidth;
    const h = list.offsetHeight;
    // Park fully out of view on the hidden before/after targets.
    const nudge = link.classList.contains("is--before")
      ? -4
      : link.classList.contains("is--after")
        ? 4
        : 0;
    indicator.style.left = ((rect.left - parent.left + nudge) / w) * 100 + "%";
    indicator.style.top = ((rect.top - parent.top) / h) * 100 + "%";
    indicator.style.width = (link.offsetWidth / w) * 100 + "%";
    indicator.style.height = (link.offsetHeight / h) * 100 + "%";
  }

  function activate(id) {
    const link = list.querySelector(`[data-progress-nav-target="#${id}"]`);
    if (!link || link === current) return;
    current = link;
    list.querySelectorAll("[data-progress-nav-target]").forEach(el => {
      el.classList.toggle("is--active", el === link);
      if (el.tagName === "A") {
        if (el === link) el.setAttribute("aria-current", "location");
        else el.removeAttribute("aria-current");
      }
    });
    moveIndicator(link);
    // Over the contact band, ring the "Say hi" button as the current item.
    nav?.classList.toggle("is--on-red", id === "reach");
  }

  anchors.forEach(anchor => {
    ScrollTrigger.create({
      trigger: anchor,
      start: "0% 50%",
      end: "100% 50%",
      onEnter: () => activate(anchor.id),
      onEnterBack: () => activate(anchor.id),
    });
  });

  window.addEventListener("resize", () => current && moveIndicator(current));
}

// ==========================================
// HERO DOTS
// Osmo Supply "Glowing Interactive Dots Grid", restyled: neutral dots that glow
// Campari near the cursor; a fast move or a click nudges them with inertia.
// ==========================================
function initHeroDots() {
  const container = document.querySelector("[data-dots-container-init]");
  const hero = container?.closest(".hero");
  if (!container || !hero) return;

  const threshold = 180; // glow radius in px
  const speedThreshold = 100; // px/s before dots get pushed
  const shockRadius = 300;
  const shockPower = 4;
  const maxSpeed = 5000;
  const still = reduceMotion();

  let dots = [];
  let colors = { base: "#dcd6cd", active: "#d9301f" };

  function readColors() {
    const cs = getComputedStyle(container);
    colors = {
      base: cs.getPropertyValue("--dot-base").trim() || colors.base,
      active: cs.getPropertyValue("--dot-active").trim() || colors.active,
    };
  }

  function measure() {
    dots.forEach(d => {
      const r = d.el.getBoundingClientRect();
      d.x = r.left + window.scrollX + r.width / 2;
      d.y = r.top + window.scrollY + r.height / 2;
    });
  }

  function build() {
    readColors();
    container.innerHTML = "";
    const dotPx = parseFloat(getComputedStyle(container).fontSize);
    const gapPx = dotPx * 2.4;
    const cols = Math.floor((container.clientWidth + gapPx) / (dotPx + gapPx));
    const rows = Math.floor((container.clientHeight + gapPx) / (dotPx + gapPx));
    const frag = document.createDocumentFragment();
    dots = [];
    for (let i = 0; i < cols * rows; i++) {
      const el = document.createElement("div");
      el.className = "hero-dots__dot";
      el.style.backgroundColor = colors.base;
      frag.appendChild(el);
      dots.push({ el, x: 0, y: 0, lit: false, moving: false });
    }
    container.appendChild(frag);
    requestAnimationFrame(measure);
  }

  function push(d, x, y) {
    d.moving = true;
    gsap.to(d.el, {
      inertia: { x, y, resistance: 750 },
      onComplete() {
        gsap.to(d.el, { x: 0, y: 0, duration: 1.5, ease: "elastic.out(1,0.75)" });
        d.moving = false;
      },
    });
  }

  let lastTime = 0;
  let lastX = 0;
  let lastY = 0;
  let frame = 0;

  hero.addEventListener("pointermove", e => {
    if (e.pointerType === "touch") return;
    const now = performance.now();
    const dt = now - lastTime || 16;
    let vx = ((e.pageX - lastX) / dt) * 1000;
    let vy = ((e.pageY - lastY) / dt) * 1000;
    let speed = Math.hypot(vx, vy);
    if (speed > maxSpeed) {
      const k = maxSpeed / speed;
      vx *= k;
      vy *= k;
      speed = maxSpeed;
    }
    lastTime = now;
    lastX = e.pageX;
    lastY = e.pageY;

    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      for (const d of dots) {
        const dist = Math.hypot(d.x - e.pageX, d.y - e.pageY);
        const t = Math.max(0, 1 - dist / threshold);
        // Only touch dots that are lit or about to be, so thousands of dots stay cheap.
        if (t > 0 || d.lit) {
          d.el.style.backgroundColor = gsap.utils.interpolate(colors.base, colors.active, t);
          d.lit = t > 0;
        }
        if (!still && speed > speedThreshold && dist < threshold && !d.moving) {
          push(d, d.x - e.pageX + vx * 0.005, d.y - e.pageY + vy * 0.005);
        }
      }
    });
  });

  hero.addEventListener("pointerleave", () => {
    for (const d of dots) {
      if (d.lit) {
        d.el.style.backgroundColor = colors.base;
        d.lit = false;
      }
    }
  });

  hero.addEventListener("click", e => {
    if (still || e.target.closest("a, button")) return;
    for (const d of dots) {
      const dist = Math.hypot(d.x - e.pageX, d.y - e.pageY);
      if (dist < shockRadius && !d.moving) {
        const falloff = Math.max(0, 1 - dist / shockRadius);
        push(d, (d.x - e.pageX) * shockPower * falloff, (d.y - e.pageY) * shockPower * falloff);
      }
    }
  });

  let lastW = 0;
  new ResizeObserver(() => {
    if (Math.abs(container.clientWidth - lastW) > 2) {
      lastW = container.clientWidth;
      build();
    } else {
      measure();
    }
  }).observe(container);
  document.fonts?.ready.then(measure);
}

// ==========================================
// SCROLLING TEXT
// Clones each scroller's items so the CSS loop in ScrollingText.astro is seamless.
// ==========================================
function initScrollerAnimations() {
  document.querySelectorAll("[data-scroller]").forEach(scroller => {
    const inner = scroller.querySelector(".scrolling-text__inner");
    if (!inner || inner.dataset.cloned) return;
    inner.dataset.cloned = "true";
    Array.from(inner.children).forEach(item => {
      const copy = item.cloneNode(true);
      copy.setAttribute("aria-hidden", "true");
      inner.appendChild(copy);
    });
  });
}

// ==========================================
// WORK: LIST / GRID TOGGLE
// Osmo Supply "List/Grid Toggle (Flip)", restyled to the brand.
// ==========================================
function initListGridToggle() {
  const cornerRadius = el => parseFloat(getComputedStyle(el).borderTopLeftRadius);

  document.querySelectorAll("[data-list-grid-init]").forEach(root => {
    const toggles = root.querySelectorAll("[data-list-grid-toggle]");
    const shownIn = (el, view) => ["", view].includes(el.getAttribute("data-list-grid-fade") || "");
    let flip;

    function setView(view) {
      root.setAttribute("data-list-grid-view", view);
      toggles.forEach(toggle => {
        toggle.setAttribute(
          "aria-pressed",
          String(toggle.getAttribute("data-list-grid-toggle") === view)
        );
      });
    }

    const startView = root.getAttribute("data-list-grid-view") || "grid";
    setView(startView);
    gsap.set(
      [...root.querySelectorAll("[data-list-grid-fade]")].filter(el => !shownIn(el, startView)),
      { autoAlpha: 0 }
    );

    toggles.forEach(toggle => {
      toggle.addEventListener("click", () => {
        const view = toggle.getAttribute("data-list-grid-toggle") || "list";
        if (view === root.getAttribute("data-list-grid-view")) return;

        const fadeTargets = [...root.querySelectorAll("[data-list-grid-fade]")];
        const flipElements = [...root.querySelectorAll("[data-list-grid-flip]")];
        const fadeIn = fadeTargets.filter(el => shownIn(el, view));

        flip?.kill();
        gsap.killTweensOf(fadeTargets, "opacity,visibility");
        gsap.killTweensOf(flipElements);

        const opacities = fadeTargets.map(el => gsap.getProperty(el, "opacity"));
        const startRadii = flipElements.map(
          el => cornerRadius(el) * gsap.getProperty(el, "scaleX")
        );
        const state = Flip.getState([...flipElements, ...fadeTargets]);

        gsap.set(fadeTargets, { autoAlpha: i => opacities[i] });
        gsap.set(flipElements, { clearProps: "borderRadius" });

        setView(view);

        if (reduceMotion()) {
          gsap.set(fadeTargets, { autoAlpha: (_i, el) => (fadeIn.includes(el) ? 1 : 0) });
          return;
        }

        const endRadii = flipElements.map(cornerRadius);

        flip = Flip.from(state, {
          duration: 0.8,
          ease: "expo.inOut",
          scale: true,
          onComplete() {
            gsap.set(
              fadeTargets.filter(el => !fadeIn.includes(el)),
              { autoAlpha: 0 }
            );
          },
        });

        flipElements.forEach((el, i) => {
          gsap.fromTo(
            el,
            { borderRadius: startRadii[i] / gsap.getProperty(el, "scaleX") },
            {
              borderRadius: endRadii[i],
              duration: 0.8,
              ease: "expo.inOut",
              clearProps: "borderRadius",
            }
          );
        });

        gsap
          .timeline()
          .to(fadeTargets, { autoAlpha: 0, duration: 0.2, ease: "power1.out" })
          .to(
            fadeIn,
            { autoAlpha: 1, duration: 0.3, ease: "power1.out", stagger: { amount: 0.2 } },
            0.55
          );
      });
    });
  });
}

// ==========================================
// WORK: FILTERS
// Hide the items that don't match and let Flip slide the rest into place. The
// list's height is locked and tweened so the sections below glide, not jump.
// ==========================================
function initWorkFilters() {
  const root = document.querySelector("[data-list-grid-init]");
  if (!root) return;
  const list = root.querySelector(".list-grid__list");
  const buttons = root.querySelectorAll("[data-filter]");
  const items = [...root.querySelectorAll(".list-grid__item")];
  let flip;
  let grow;

  buttons.forEach(btn =>
    btn.addEventListener("click", () => {
      if (btn.getAttribute("aria-pressed") === "true") return;
      const filter = btn.dataset.filter || "all";
      buttons.forEach(b => b.setAttribute("aria-pressed", String(b === btn)));

      // Finish anything still running from a quick double click.
      flip?.progress(1).kill();
      grow?.progress(1).kill();
      gsap.set(list, { clearProps: "height" });

      const from = list.offsetHeight;
      const state = Flip.getState(items);
      items.forEach(item => {
        item.hidden = filter !== "all" && item.dataset.where !== filter;
      });
      const to = list.offsetHeight;

      if (reduceMotion()) return;

      gsap.set(list, { height: from });
      grow = gsap.to(list, { height: to, duration: 0.6, ease: "expo.out", clearProps: "height" });
      flip = Flip.from(state, {
        duration: 0.6,
        ease: "expo.out",
        absolute: true,
        nested: true,
        onEnter: els =>
          gsap.fromTo(
            els,
            { opacity: 0, scale: 0.96 },
            { opacity: 1, scale: 1, duration: 0.4, delay: 0.1 }
          ),
        onLeave: els => gsap.to(els, { opacity: 0, scale: 0.96, duration: 0.25 }),
      });
    })
  );
}

// ==========================================
// OFF THE CLOCK STICKERS
// Drag them around; a click (no drag) opens the story in the modal. Desktop
// uses each sticker's x/y; phones get a loose two-column scatter.
// ==========================================
function initStickers() {
  const board = document.querySelector("[data-board]");
  const modal = document.querySelector("[data-modal]");
  if (!board || !modal) return;

  const stickers = [...board.querySelectorAll("[data-sticker]")];
  let z = 10;
  let drag = null;

  function layout() {
    const narrow = board.clientWidth < 720;
    stickers.forEach((el, i) => {
      el.dataset.dx = "0";
      el.dataset.dy = "0";
      if (narrow) {
        const col = i % 2;
        const row = Math.floor(i / 2);
        el.style.left = (col ? 58 : 4) + "%";
        el.style.top = (row < 3 ? 16 + row * 112 : 712 + (row - 3) * 112) + "px";
      } else {
        el.style.left = `calc(${el.dataset.x}% - 66px)`;
        el.style.top = el.dataset.y + "px";
      }
      el.style.translate = "0 0";
    });
  }

  layout();
  let lastW = board.clientWidth;
  window.addEventListener("resize", () => {
    if (Math.abs(board.clientWidth - lastW) > 40) {
      lastW = board.clientWidth;
      layout();
    }
  });

  board.addEventListener("pointerdown", e => {
    const el = e.target.closest("[data-sticker]");
    if (!el) return;
    e.preventDefault();
    el.setPointerCapture(e.pointerId);
    el.style.zIndex = String(++z);
    drag = {
      el,
      sx: e.clientX,
      sy: e.clientY,
      ox: +el.dataset.dx || 0,
      oy: +el.dataset.dy || 0,
      moved: false,
    };
  });

  board.addEventListener("pointermove", e => {
    if (!drag) return;
    const dx = e.clientX - drag.sx;
    const dy = e.clientY - drag.sy;
    if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true;
    if (!drag.moved) return;
    const nx = drag.ox + dx;
    const ny = drag.oy + dy;
    drag.el.dataset.dx = nx;
    drag.el.dataset.dy = ny;
    drag.el.style.translate = `${nx}px ${ny}px`;
  });

  board.addEventListener("pointerup", () => {
    if (!drag) return;
    const { el, moved } = drag;
    drag = null;
    if (!moved) open(el);
  });
  board.addEventListener("pointercancel", () => {
    drag = null;
  });

  // Keyboard: Enter or Space opens the story.
  board.addEventListener("keydown", e => {
    const el = e.target.closest("[data-sticker]");
    if (el && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      open(el);
    }
  });

  const tones = ["red", "ink", "crema", "blush"];
  const hero = modal.querySelector("[data-modal-hero]");
  const art = modal.querySelector("[data-modal-art]");
  const card = modal.querySelector(".modal__card");
  const photo = modal.querySelector("[data-modal-photo]");

  function open(el) {
    // Blow the clicked sticker up into the card's colored header.
    const index = stickers.indexOf(el);
    hero.dataset.tone = tones[index % tones.length];
    art.style.setProperty("--art-rot", (index % 2 ? 6 : -6) + "deg");
    art.replaceChildren(el.querySelector("svg").cloneNode(true));
    // Stickers with a photo show it across the header; the sticker moves to the corner.
    const src = el.dataset.photo || "";
    hero.classList.toggle("has-photo", !!src);
    card.classList.toggle("has-photo", !!src);
    photo.hidden = !src;
    if (src) {
      photo.src = src;
      photo.alt = el.dataset.photoAlt || "";
      photo.style.objectPosition = el.dataset.photoPos || "50% 50%";
    }
    modal.querySelectorAll("[data-f]").forEach(field => {
      const value = el.dataset[field.dataset.f] || "";
      field.textContent = value;
      field.hidden = !value;
    });
    modal.showModal();
  }

  modal.querySelector("[data-close]").addEventListener("click", () => modal.close());
  modal.addEventListener("click", e => {
    if (e.target === modal) modal.close();
  });
}

// ==========================================
// "ASK ABOUT CHRIS" CHAT
// Calls netlify/functions/ask.mjs; falls back to a small local answer set
// when the function is unavailable (local dev, or no API key).
// ==========================================
function initChat() {
  const root = document.querySelector("[data-chat]");
  if (!root) return;

  const panel = root.querySelector("[data-chat-panel]");
  const log = root.querySelector("[data-log]");
  const form = root.querySelector("[data-form]");
  const input = form.querySelector("input");
  const mainToggle = root.querySelector(".chat__toggle");
  const label = root.querySelector("[data-chat-label]");
  const email = root.dataset.email;

  const local = [
    [
      /hand.?code|write code|code|develop|program|javascript|astro|html|css|technical|platform|webflow|wordpress/i,
      "Yes. His favorite way to build is plain HTML, CSS and JavaScript in Astro, with no page builder. He’s also launched sites on Webflow, WordPress, Squarespace, Wix and BentoBox’s platform.",
    ],
    [
      /\bai\b|claude|cartiq|homeplate|cookbook|side project|app/i,
      "To move faster, not to make the decisions. He does the heavy lifting up front with a design system and written coding standards, then lets the agent run and checks in to steer. He’s also built tools with it, like a code library for his team and a grocery budget app for his family.",
    ],
    [
      /lead|led|team|mentor|manag/i,
      "He mentors four designers at BentoBox, runs design reviews, and set the front-end standards the team builds to. He also owns the VIP and at-risk accounts, and he’s the one on the call when a client is unhappy.",
    ],
    [
      /demo|sales|solutions|pitch|present|client|customer/i,
      "He’s on client calls most weeks, scoping needs and walking owners through the platform. He also pitches and closes clients for his own studio, usually with a homepage concept he’s already built.",
    ],
    [
      /beyond belief|studio|freelance|print/i,
      "Beyond Belief is his small web studio in Monroe, NC. It started as a screen printing side business in 2016, added websites in 2020, and became web-only when he closed the print shop in January 2026.",
    ],
    [
      /work with|like|personality|communicat/i,
      "Patient and plain-spoken. He’ll explain it as many times as it takes, without making anyone feel dumb.",
    ],
    [
      /golf|course|score/i,
      "He plays at Monroe Golf and Country Club, usually with his son. Last round: a 92.",
    ],
    [
      /cocktail|campari|drink|negroni|old fashioned/i,
      "An Old Fashioned or a Negroni, depending on his mood.",
    ],
    [/espresso|coffee|cortado/i, "A cortado, usually before he’s opened his email."],
    [/grill|cook|smok|bbq|brisket/i, "Brisket or burnt ends on his Weber Smoky Mountain."],
    [
      /hobb|weekend|fun/i,
      "Golf with his son, cocktails, smoking brisket, and a garage-to-home-office project.",
    ],
    [
      /hiring|looking|open|available|role|job/i,
      `Yes, he’s looking for his next role: designing and building websites, leading the team that does, or sales and solutions engineering for a web product. Email him at ${email}.`,
    ],
    [
      /bentobox|clover|current/i,
      "He’s a Senior Web Designer at BentoBox, which Clover acquired, and has been there since December 2020.",
    ],
    [/where|live|located|based/i, "Monroe, North Carolina, just outside Charlotte."],
    [
      /school|degree|educat|college/i,
      "A BFA in Graphic Design from Kean University, after studying advertising at FIT.",
    ],
  ];

  const fallback = q => {
    for (const [re, answer] of local) if (re.test(q)) return answer;
    return `That one’s better asked directly. Email him at ${email}.`;
  };

  function setOpen(open) {
    panel.hidden = !open;
    mainToggle.setAttribute("aria-expanded", String(open));
    label.textContent = open ? "Close" : "Ask about Chris";
    if (open) input.focus();
  }

  root
    .querySelectorAll("[data-chat-toggle]")
    .forEach(btn => btn.addEventListener("click", () => setOpen(panel.hidden)));

  function add(text, modifier) {
    const p = document.createElement("p");
    p.className = "chat__msg" + (modifier ? ` chat__msg--${modifier}` : "");
    p.textContent = text;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
    return p;
  }

  let busy = false;
  async function ask(q) {
    q = (q || "").trim().slice(0, 200);
    if (!q || busy) return;
    busy = true;
    add(q, "you");
    const typing = add("Thinking…", "typing");
    let answer = "";
    try {
      const r = await fetch("/.netlify/functions/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ q }),
      });
      if (r.ok) answer = (await r.json())?.answer || "";
    } catch (e) {}
    typing.remove();
    add(answer || fallback(q));
    busy = false;
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const value = input.value;
    input.value = "";
    ask(value);
  });
  root
    .querySelectorAll("[data-chip]")
    .forEach(btn => btn.addEventListener("click", () => ask(btn.textContent)));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !panel.hidden) setOpen(false);
  });
}

// ==========================================
// POLL (Poll.astro, currently not on the page)
// One random question per visit; tallies from netlify/functions/poll.mjs.
// ==========================================
function initPoll() {
  const root = document.querySelector("[data-poll]");
  const dataEl = document.getElementById("poll-data");
  if (!root || !dataEl) return;

  const polls = JSON.parse(dataEl.textContent);
  const qEl = root.querySelector("[data-poll-q]");
  const optsEl = root.querySelector("[data-poll-options]");
  const mineEl = root.querySelector("[data-poll-mine]");
  const statusEl = root.querySelector("[data-poll-status]");
  const nextBtn = root.querySelector("[data-poll-next]");
  const API = "/.netlify/functions/poll";
  const KEY = "cn-poll-votes";
  const intro = "Pick one. Then you’ll see how everyone else voted.";

  let votes = {};
  try {
    votes = JSON.parse(localStorage.getItem(KEY) || "{}") || {};
  } catch (e) {}
  const save = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(votes));
    } catch (e) {}
  };

  let current = null;
  const seen = new Set();

  function pick() {
    let pool = polls.filter(p => !votes[p.id] && !seen.has(p.id));
    if (!pool.length) pool = polls.filter(p => !votes[p.id] && p !== current);
    if (!pool.length) pool = polls.filter(p => p !== current);
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function render(poll) {
    current = poll;
    seen.add(poll.id);
    qEl.textContent = poll.q;
    mineEl.hidden = true;
    optsEl.innerHTML = "";
    poll.options.forEach(o => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "poll__opt";
      b.dataset.id = o.id;
      b.innerHTML =
        '<span class="poll__fill"></span><span class="poll__label"></span><span class="poll__pct"></span>';
      b.querySelector(".poll__label").textContent = o.label;
      b.addEventListener("click", () => vote(o.id));
      optsEl.appendChild(b);
    });
    if (votes[poll.id]) {
      statusEl.textContent = "Loading the tally…";
      fetch(`${API}?q=${encodeURIComponent(poll.id)}`)
        .then(r => (r.ok ? r.json() : Promise.reject()))
        .then(d => current === poll && show(poll, d, false))
        .catch(() => current === poll && show(poll, null, false));
    } else {
      statusEl.textContent = intro;
    }
  }

  function vote(id) {
    const poll = current;
    if (votes[poll.id]) return;
    votes[poll.id] = id;
    save();
    optsEl.querySelectorAll(".poll__opt").forEach(b => (b.disabled = true));
    statusEl.textContent = "Counting…";
    fetch(API, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ q: poll.id, a: id }),
    })
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(d => current === poll && show(poll, d, true))
      .catch(() => current === poll && show(poll, null, true));
  }

  function show(poll, data, justVoted) {
    const mine = votes[poll.id];
    const counts = data
      ? data.counts
      : Object.fromEntries(poll.options.map(o => [o.id, o.id === mine ? 1 : 0]));
    const total = data ? data.total : 1;
    const top = Math.max(...Object.values(counts));
    root.classList.add("is--voted");
    optsEl.querySelectorAll(".poll__opt").forEach(b => {
      const n = counts[b.dataset.id] || 0;
      const pct = total ? Math.round((n / total) * 100) : 0;
      b.disabled = true;
      b.classList.toggle("is--mine", b.dataset.id === mine);
      b.classList.toggle("is--top", n === top && n > 0);
      b.querySelector(".poll__pct").textContent = pct + "%";
      requestAnimationFrame(() => b.style.setProperty("--pct", pct + "%"));
    });
    if (poll.mine) {
      mineEl.textContent = "My answer: " + poll.mine;
      mineEl.hidden = false;
    }
    statusEl.textContent = data
      ? total === 1
        ? "You’re the first vote on this one."
        : `${total.toLocaleString()} votes so far.${justVoted ? " Thanks for weighing in." : ""}`
      : "The live tally shows up once the site is deployed.";
  }

  nextBtn.addEventListener("click", () => {
    root.classList.remove("is--voted");
    render(pick());
    optsEl.querySelector("button:not([disabled])")?.focus();
  });

  render(pick());
}
