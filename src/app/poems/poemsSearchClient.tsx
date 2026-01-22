"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type PoemMeta = {
  title: string;
  slug: string;
  date: string; // YYYY-MM-DD
  excerpt?: string;
  tags: string[];
};

function formatDateDDMMYYYY(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${day}-${month}-${year}`;
}

/**
 * Relevance scoring:
 * - Strong boost for exact phrase match in title
 * - Strong boost for title word starts-with matches
 * - Medium boost for title includes
 * - Smaller boosts for excerpt + tags matches
 * - Token-based scoring so multi-word queries work
 */
function scorePoem(poem: PoemMeta, queryRaw: string): number {
  const query = queryRaw.trim().toLowerCase();
  if (!query) return 0;

  const title = poem.title.toLowerCase();
  const excerpt = (poem.excerpt ?? "").toLowerCase();
  const tags = (poem.tags ?? []).join(" ").toLowerCase();

  let score = 0;

  // Phrase matches (best signal)
  if (title === query) score += 1000;
  if (title.includes(query)) score += 300;
  if (excerpt.includes(query)) score += 120;
  if (tags.includes(query)) score += 80;

  // Token matches (helps multi-word queries)
  const tokens = query.split(/\s+/).filter(Boolean);
  if (tokens.length > 1) score += 10; // small bump for multi-term searches

  for (const t of tokens) {
    if (!t) continue;

    // Title is most important
    if (title.startsWith(t)) score += 140;
    if (title.includes(t)) score += 90;

   
    const wordStart = new RegExp(`\\b${escapeRegExp(t)}`, "i");
    if (wordStart.test(title)) score += 160;

    
    if (excerpt.includes(t)) score += 35;

    
    if (poem.tags?.some((tag) => tag.toLowerCase() === t)) score += 110;
    else if (tags.includes(t)) score += 25;
  }

  return score;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default function PoemsSearchClient({ poems }: { poems: PoemMeta[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) {
      
      return [...poems].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
    }

    const scored = poems
      .map((p) => ({ poem: p, score: scorePoem(p, q) }))
      
      .filter((x) => x.score > 0);

    
    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.poem.date < b.poem.date ? 1 : a.poem.date > b.poem.date ? -1 : 0;
    });

    return scored.map((x) => x.poem);
  }, [poems, query]);

  return (
    <main style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
      <header style={{ marginBottom: "1rem" }}>
        <h1 style={{ marginBottom: "0.5rem" }}>Poems</h1>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search poems by title, excerpt, or tag…"
          style={{
            width: "100%",
            padding: "0.75rem 0.9rem",
            border: "1px solid #ddd",
            borderRadius: 12,
            outline: "none",
          }}
        />

        <div style={{ marginTop: "0.5rem", opacity: 0.75 }}>
          {query.trim()
            ? `${results.length} result(s) for “${query.trim()}”`
            : `${poems.length} poem(s)`}
        </div>
      </header>

      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "1rem" }}>
        {results.map((p) => (
          <li key={p.slug} style={{ border: "1px solid #ddd", borderRadius: 12, padding: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
              <Link href={`/poems/${p.slug}`} style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                {p.title}
              </Link>
              <span style={{ opacity: 0.75, whiteSpace: "nowrap" }}>
                {formatDateDDMMYYYY(p.date)}
              </span>
            </div>

            {p.excerpt ? <p style={{ marginTop: "0.5rem", opacity: 0.85 }}>{p.excerpt}</p> : null}

            {p.tags?.length ? (
              <div style={{ marginTop: "0.5rem", opacity: 0.75, fontSize: "0.95rem" }}>
                Tags: {p.tags.join(", ")}
              </div>
            ) : null}
          </li>
        ))}
      </ul>

      {query.trim() && results.length === 0 ? (
        <p style={{ marginTop: "1rem", opacity: 0.75 }}>No matches found.</p>
      ) : null}
    </main>
  );
}
