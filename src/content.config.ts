import { file } from "astro/loaders";
import { defineCollection, z } from "astro:content";

// Work section. Edit src/data/work.json; `npm run shots` fills in `image`
// for any project that does not have a screenshot yet.
const work = defineCollection({
  loader: file("src/data/work.json"),
  schema: z.object({
    name: z.string(),
    what: z.string(),
    where: z.enum(["BentoBox", "Beyond Belief"]),
    url: z.string(),
    image: z.string(),
    category: z.string(),
  }),
});

export const collections = { work };
