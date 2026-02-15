import type { ScanResultData } from "@/types";
import type { ActionItem } from "./riskScore";

export function generateHtmlReport(
  data: ScanResultData,
  actions: ActionItem[],
  score: number,
  grade: string
): string {
  const date = new Date(data.scannedAt || Date.now()).toLocaleString();

  const subdomainsRows = data.subdomains
    .map(
      (s) => `
    <tr>
      <td>${escapeHtml(s.name)}</td>
      <td>${s.ips.slice(0, 3).join(", ") || "—"}</td>
      <td>${s.certValid ? "✓" : "✗"}</td>
      <td>${s.technologies?.slice(0, 3).join(", ") || "—"}</td>
      <td>${s.securityHeaders ? `${s.securityHeaders.score}/100` : "—"}</td>
    </tr>`
    )
    .join("");

  const actionsHtml =
    actions.length > 0
      ? actions
          .map(
            (a) => `
    <li><strong>${a.severity.toUpperCase()}:</strong> ${escapeHtml(a.title)} — ${escapeHtml(a.fix)}</li>`
          )
          .join("")
      : "<li>No critical issues found.</li>";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Secureasy Report — ${escapeHtml(data.domain)}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; background: #0f172a; color: #e2e8f0; }
    h1 { color: #10b981; }
    h2 { color: #94a3b8; margin-top: 2rem; }
    table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
    th, td { border: 1px solid #334155; padding: 0.5rem 1rem; text-align: left; }
    th { background: #1e293b; }
    .score { font-size: 2rem; font-weight: bold; color: #10b981; }
    .grade { font-size: 1.5rem; color: #94a3b8; }
    ul { line-height: 1.6; }
    .meta { color: #64748b; font-size: 0.9rem; }
  </style>
</head>
<body>
  <h1>Secureasy — Attack Surface Report</h1>
  <p class="meta">Generated ${date} | Domain: ${escapeHtml(data.domain)}</p>

  <h2>Security Score</h2>
  <p><span class="score">${score}/100</span> <span class="grade">(Grade ${grade})</span></p>

  <h2>Summary</h2>
  <ul>
    <li>Subdomains found: ${data.subdomains.length}</li>
    <li>Scan duration: ${(data.scanTime / 1000).toFixed(1)}s</li>
  </ul>

  <h2>Recommended Actions</h2>
  <ul>${actionsHtml}</ul>

  <h2>DNS Records (${data.domain})</h2>
  <ul>
    ${data.dns.a.length ? `<li>A: ${data.dns.a.join(", ")}</li>` : ""}
    ${data.dns.mx.length ? `<li>MX: ${data.dns.mx.slice(0, 3).join(", ")}</li>` : ""}
  </ul>

  <h2>Subdomains</h2>
  <table>
    <thead><tr><th>Subdomain</th><th>IPs</th><th>Valid Cert</th><th>Technologies</th><th>Header Score</th></tr></thead>
    <tbody>${subdomainsRows}</tbody>
  </table>

  <p class="meta" style="margin-top: 3rem;">Report by Secureasy — secureasy.io</p>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
