"use client";

export default function PoemsIndexError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>/poems error</h1>
      <pre style={{ whiteSpace: "pre-wrap" }}>{error.message}</pre>
      {error.digest ? <pre>digest: {error.digest}</pre> : null}
      <button onClick={() => reset()} style={{ marginTop: "1rem", padding: "0.5rem 0.75rem" }}>
        Retry
      </button>
    </main>
  );
}
