/** Base URL for API calls. Set NEXT_PUBLIC_API_BASE when deploying static frontend to GitHub Pages. */
export function getApiBase(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE;
  if (!base || typeof base !== "string") return "";
  let cleaned = base.trim().replace(/\/+$/, "");
  // Auto-prepend https:// if no protocol given (e.g. "secureasy.vercel.app")
  if (cleaned && !cleaned.startsWith("http")) {
    cleaned = `https://${cleaned}`;
  }
  return cleaned.startsWith("http") ? cleaned : "";
}
