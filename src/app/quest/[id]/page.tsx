import { redirect } from "next/navigation";

export default function QuestIdRedirect({ params, searchParams }: { params: { id: string }; searchParams: Record<string, string | string[] | undefined> }) {
  const id = params.id;
  // Reconstruct query string
  const entries = Object.entries(searchParams || {}).flatMap(([k, v]) => {
    if (v === undefined) return [];
    if (Array.isArray(v)) return v.map((val) => `${encodeURIComponent(k)}=${encodeURIComponent(String(val))}`);
    return [`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`];
  });
  const query = entries.length ? `?${entries.join("&")}` : "";
  redirect(`/pet/quest/${encodeURIComponent(id)}${query}`);
}
