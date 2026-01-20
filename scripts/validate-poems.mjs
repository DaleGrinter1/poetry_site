import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POEMS_DIR = path.join(process.cwd(), "content", "poems");

function fail(message) {
  console.error(`\n❌ ${message}\n`);
  process.exit(1);
}

function warn(message) {
  console.warn(`⚠️  ${message}`);
}

if (!fs.existsSync(POEMS_DIR)) {
  fail(`Poems directory not found at ${POEMS_DIR}`);
}

const files = fs
  .readdirSync(POEMS_DIR)
  .filter((f) => f.endsWith(".md") && !f.startsWith("_"));


if (files.length === 0) {
  warn("No poem files found.");
  process.exit(0);
}

const seenSlugs = new Set();

for (const file of files) {
  const fullPath = path.join(POEMS_DIR, file);
  const raw = fs.readFileSync(fullPath, "utf8");

  let parsed;
  try {
    parsed = matter(raw);
  } catch {
    fail(`Failed to parse front-matter in ${file}`);
  }

  const { title, slug, date, tags } = parsed.data;

  // title
  if (!title || typeof title !== "string") {
    fail(`${file}: missing or invalid "title"`);
  }

  // slug
  if (!slug || typeof slug !== "string") {
    fail(`${file}: missing or invalid "slug"`);
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    fail(
      `${file}: slug "${slug}" is invalid (use lowercase letters, numbers, hyphens only)`
    );
  }

  if (seenSlugs.has(slug)) {
    fail(`${file}: duplicate slug "${slug}"`);
  }
  seenSlugs.add(slug);

  // date
  if (!date || typeof date !== "string") {
    fail(`${file}: missing or invalid "date"`);
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    fail(`${file}: date "${date}" must be YYYY-MM-DD`);
  }

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    fail(`${file}: date "${date}" is not a real calendar date`);
  }

  // tags
  if (tags !== undefined) {
    if (!Array.isArray(tags)) {
      fail(`${file}: "tags" must be an array`);
    }

    for (const tag of tags) {
      if (typeof tag !== "string") {
        fail(`${file}: tag "${tag}" is not a string`);
      }

      if (tag !== tag.toLowerCase()) {
        fail(`${file}: tag "${tag}" must be lowercase`);
      }

      if (!/^[a-z0-9-]+$/.test(tag)) {
        fail(
          `${file}: tag "${tag}" is invalid (use lowercase letters, numbers, hyphens only)`
        );
      }
    }
  }

  // content
  if (!parsed.content || parsed.content.trim() === "") {
    warn(`${file}: poem body is empty`);
  }
}

console.log(`\n✅ Poem validation passed (${files.length} file(s))\n`);
