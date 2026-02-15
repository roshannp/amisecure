"use client";

import type { SecurityHeadersResult } from "@/lib/riskScore";

interface SecurityHeadersCardProps {
  host: string;
  headers?: SecurityHeadersResult;
}

const HEADER_LABELS: Record<
  keyof Omit<SecurityHeadersResult, "score">,
  { label: string; desc: string }
> = {
  hsts: {
    label: "Strict-Transport-Security",
    desc: "Forces HTTPS, prevents downgrade attacks",
  },
  csp: {
    label: "Content-Security-Policy",
    desc: "Mitigates XSS and injection",
  },
  xFrameOptions: {
    label: "X-Frame-Options",
    desc: "Prevents clickjacking",
  },
  xContentTypeOptions: {
    label: "X-Content-Type-Options",
    desc: "Prevents MIME sniffing",
  },
  referrerPolicy: {
    label: "Referrer-Policy",
    desc: "Controls referrer information",
  },
  permissionsPolicy: {
    label: "Permissions-Policy",
    desc: "Controls browser features",
  },
};

export function SecurityHeadersCard({ host, headers }: SecurityHeadersCardProps) {
  if (!headers) {
    return (
      <div className="rounded-lg border border-gray-700/50 bg-gray-800/30 p-4">
        <h3 className="font-mono text-sm font-medium text-gray-400">
          {host}
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Could not fetch headers (host may be unreachable or blocks requests)
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-700/50 bg-gray-800/30 p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-sm font-medium text-emerald-300">
          {host}
        </h3>
        <span className="rounded bg-gray-700 px-2 py-0.5 text-xs text-gray-300">
          {headers.score}/100
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {(Object.keys(HEADER_LABELS) as Array<keyof typeof HEADER_LABELS>).map(
          (key) => {
            const item = headers[key];
            if (typeof item === "object" && "present" in item) {
              const { label, desc } = HEADER_LABELS[key];
              return (
                <div
                  key={key}
                  className="flex items-start gap-2 text-xs"
                >
                  <span
                    className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                      item.present ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  />
                  <div>
                    <span className="text-gray-300">{label}</span>
                    <span className="text-gray-500"> — {desc}</span>
                    {item.present && item.value && (
                      <p className="mt-0.5 truncate font-mono text-gray-500">
                        {item.value}
                      </p>
                    )}
                  </div>
                </div>
              );
            }
            return null;
          }
        )}
      </div>
    </div>
  );
}
