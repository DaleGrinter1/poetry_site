"use client";

export default function PoemError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>Poem page error</h1>
      <p>If you see this, the route is correct and an exception occurred.</p>

      <details open style={{ marginTop: "1rem" }}>
        <summary>Error details</summary>
        <pre style={{ whiteSpace: "pre-wrap" }}>{error.message}</pre>
        {error.digest ? <pre>digest: {error.digest}</pre> : null}
      </details>

      <button
        onClick={() => reset()}
        style={{ marginTop: "1rem", padding: "0.5rem 0.75rem" }}
      >
        Retry
      </button>
    </main>
  );
}
