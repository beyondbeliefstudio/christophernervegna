// Visitor poll for the Off the clock section. Tallies live in Netlify Blobs (store "poll", one JSON entry per question).
// GET  /.netlify/functions/poll?q=<id>     -> { counts: { optionId: n }, total }
// POST /.netlify/functions/poll {q, a}     -> adds one vote, returns the same shape
// One vote per question per browser is enforced on the page (localStorage); the rate limit below keeps scripts honest.
import { getStore } from "@netlify/blobs";
import polls from "../../src/data/polls.json" with { type: "json" };

const byId = Object.fromEntries(polls.map(p => [p.id, p]));

function shape(poll, counts = {}) {
  const clean = Object.fromEntries(poll.options.map(o => [o.id, Number(counts[o.id]) || 0]));
  return { counts: clean, total: Object.values(clean).reduce((a, b) => a + b, 0) };
}

export default async req => {
  const store = getStore({ name: "poll", consistency: "strong" });

  if (req.method === "GET") {
    const poll = byId[new URL(req.url).searchParams.get("q") || ""];
    if (!poll) return Response.json({ error: "unknown poll" }, { status: 404 });
    const counts = await store.get(poll.id, { type: "json" });
    return Response.json(shape(poll, counts || {}), { headers: { "cache-control": "no-store" } });
  }

  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  let body = {};
  try {
    body = await req.json();
  } catch {}
  const poll = byId[String(body.q || "")];
  const answer = String(body.a || "");
  if (!poll || !poll.options.some(o => o.id === answer))
    return Response.json({ error: "bad vote" }, { status: 400 });

  // Read, add one, write back only if nobody else wrote in between. Retry a few times on a collision.
  for (let attempt = 0; attempt < 5; attempt++) {
    const entry = await store.getWithMetadata(poll.id, { type: "json" });
    const counts = { ...(entry?.data || {}) };
    counts[answer] = (Number(counts[answer]) || 0) + 1;
    const result = entry
      ? await store.setJSON(poll.id, counts, { onlyIfMatch: entry.etag })
      : await store.setJSON(poll.id, counts, { onlyIfNew: true });
    if (result.modified) return Response.json(shape(poll, counts));
  }
  return Response.json({ error: "busy, try again" }, { status: 409 });
};

// 20 requests per IP per minute is plenty for a person and annoying for a script.
export const config = {
  rateLimit: { windowLimit: 20, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
