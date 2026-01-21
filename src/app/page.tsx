import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ marginBottom: "0.5rem" }}>Poetry</h1>
      <p style={{ opacity: 0.85, lineHeight: 2.6, marginBottom: "1.25rem" }}>
        A public archive of poems by Grace Boyd.
      </p>

      <Link
        href="/poems"
        style={{
          display: "inline-block",
          padding: "0.6rem 0.9rem",
          border: "1px solid #ddd",
          borderRadius: 10,
          textDecoration: "none",
        }}
      >
        Browse poems
      </Link>
    </main>
  );
}
