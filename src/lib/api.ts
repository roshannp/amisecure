/** Base URL for API calls. Set NEXT_PUBLIC_API_BASE when deploying static frontend to GitHub Pages. */
export function getApiBase(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_BASE ?? "";
  }
  return process.env.NEXT_PUBLIC_API_BASE ?? "";
}
