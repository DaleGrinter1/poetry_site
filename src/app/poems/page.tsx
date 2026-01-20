import Link from "next/link";
import { getAllPoems } from "@/lib/poems";
import { formatDateDDMMYYYY } from "@/lib/formatDate";


function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.toLocaleDateString("en-AU", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "Australia/Adelaide",
  });
}

export default function PoemsPage() {
  const poems = getAllPoems();

  return (
    <main style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ marginBottom: "1rem" }}>Poems</h1>

      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "1rem" }}>
        {poems.map((p) => (
          <li key={p.slug} style={{ border: "1px solid #ddd", borderRadius: 12, padding: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
              <Link href={`/poems/${p.slug}`} style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                {p.title}
              </Link>
              <span style={{ opacity: 0.75, whiteSpace: "nowrap" }}>{formatDateDDMMYYYY(p.date)}</span>
            </div>

            {p.excerpt ? <p style={{ marginTop: "0.5rem", opacity: 0.85 }}>{p.excerpt}</p> : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
