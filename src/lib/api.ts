/** Base URL for API calls. Set NEXT_PUBLIC_API_BASE when deploying static frontend to GitHub Pages. */
export function getApiBase(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE;
  if (!base || typeof base !== "string") return "";
  const cleaned = base.trim().replace(/\/+$/, "");
  return cleaned.startsWith("http") ? cleaned : "";
}
