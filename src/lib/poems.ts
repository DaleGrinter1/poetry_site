import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const POEMS_DIR = path.join(process.cwd(), "content", "poems");

export type PoemMeta = {
  title: string;
  slug: string;
  date: string; // ISO YYYY-MM-DD
  excerpt?: string;
  tags: string[];
};

export type Poem = PoemMeta & {
  contentHtml: string;
};

function assertPoemsDirExists() {
  if (!fs.existsSync(POEMS_DIR)) {
    throw new Error(
      `Poems directory not found at: ${POEMS_DIR}. Expected content/poems/ at project root.`
    );
  }
}

function getMarkdownFilenames(): string[] {
  assertPoemsDirExists();
  return fs
    .readdirSync(POEMS_DIR)
    .filter((name) => name.toLowerCase().endsWith(".md"));
}

function normalizeSlug(input: unknown): string {
  if (typeof input !== "string" || input.trim() === "") {
    throw new Error(`Invalid or missing slug in front-matter.`);
  }
  return input.trim();
}

function normalizeTitle(input: unknown): string {
  if (typeof input !== "string" || input.trim() === "") {
    throw new Error(`Invalid or missing title in front-matter.`);
  }
  return input.trim();
}

function normalizeDate(input: unknown): string {
  if (typeof input !== "string" || input.trim() === "") {
    throw new Error(`Invalid or missing date in front-matter (expected YYYY-MM-DD).`);
  }
  // light validation; avoids runtime surprises
  const d = input.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) {
    throw new Error(`Invalid date format "${d}" (expected YYYY-MM-DD).`);
  }
  return d;
}

function normalizeTags(input: unknown): string[] {
  if (input == null) return [];
  if (Array.isArray(input)) {
    return input.filter((t) => typeof t === "string").map((t) => t.trim()).filter(Boolean);
  }
  // allow a single string tag as convenience
  if (typeof input === "string") return [input.trim()].filter(Boolean);
  return [];
}

export function getAllPoems(): PoemMeta[] {
    
  const files = getMarkdownFilenames();

  const poems: PoemMeta[] = files.map((filename) => {
    const fullPath = path.join(POEMS_DIR, filename);
    const raw = fs.readFileSync(fullPath, "utf8");
    const parsed = matter(raw);

    const title = normalizeTitle(parsed.data.title);
    const slug = normalizeSlug(parsed.data.slug);
    const date = normalizeDate(parsed.data.date);
    const excerpt = typeof parsed.data.excerpt === "string" ? parsed.data.excerpt.trim() : undefined;
    const tags = normalizeTags(parsed.data.tags);

   

    return { title, slug, date, excerpt, tags };
  });
   console.log("Loaded poem slugs:", poems.map(p => p.slug));
  // newest first
  poems.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return poems;
}

export function getAllPoemSlugs(): string[] {
  return getAllPoems().map((p) => p.slug);
}

export async function getPoemBySlug(slug: string): Promise<Poem> {
  const files = getMarkdownFilenames();

  // Find the file whose front-matter slug matches (slug is the stable identifier)
  for (const filename of files) {
    const fullPath = path.join(POEMS_DIR, filename);
    const raw = fs.readFileSync(fullPath, "utf8");
    const parsed = matter(raw);

    const fileSlug = normalizeSlug(parsed.data.slug);
    if (fileSlug !== slug) continue;

    const title = normalizeTitle(parsed.data.title);
    const date = normalizeDate(parsed.data.date);
    const excerpt = typeof parsed.data.excerpt === "string" ? parsed.data.excerpt.trim() : undefined;
    const tags = normalizeTags(parsed.data.tags);

    // Poetry-safe: convert single newlines to <br> by styling the container with white-space: pre-wrap.
    // We still allow Markdown features, but we avoid relying on Markdown's newline rules.
    const processed = await remark().use(html).process(parsed.content);
    const contentHtml = processed.toString();

    return { title, slug: fileSlug, date, excerpt, tags, contentHtml };
  }

  throw new Error(`Poem not found for slug: ${slug}`);
}
