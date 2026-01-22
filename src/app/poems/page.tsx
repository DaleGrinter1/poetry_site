import { getAllPoems } from "@/lib/poems";
import PoemsSearchClient from "./poemsSearchClient";

export default function PoemsPage() {
  const poems = getAllPoems();
  return <PoemsSearchClient poems={poems} />;
}
