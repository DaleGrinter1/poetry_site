import { getAllPoemSlugs, getPoemBySlug } from "@/lib/poems";
import { notFound } from "next/navigation";

// Keep this (it’s good practice once params are correct)
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPoemSlugs().map((slug) => ({ slug }));
}

type Params = { slug: string };
type Props = { params: Params | Promise<Params> };

export default async function PoemPage({ params }: Props) {
  const resolvedParams = await params; // <-- IMPORTANT
  const slug = resolvedParams?.slug;

  if (!slug) notFound();

  const poem = await getPoemBySlug(slug);

  return (
    <main style={{ padding: "2rem", maxWidth: 800, margin: "0 auto" }}>
      <header style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ marginBottom: "0.25rem" }}>{poem.title}</h1>
        <div style={{ opacity: 0.75 }}>{poem.date}</div>
      </header>

      <article
        style={{ whiteSpace: "pre-wrap", lineHeight: 1.8, fontSize: "1.05rem" }}
        dangerouslySetInnerHTML={{ __html: poem.contentHtml }}
      />
    </main>
  );
}
