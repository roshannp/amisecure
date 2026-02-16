"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getScanHistory } from "@/lib/scanHistory";
import { getApiBase } from "@/lib/api";
import type { StoredScan } from "@/lib/scanHistory";

async function checkApiReachable(): Promise<boolean> {
  const base = getApiBase();
  try {
    const res = await fetch(`${base}/api/health`, { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
}

export function HomeClient() {
  const router = useRouter();
  const [domain, setDomain] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<StoredScan[]>([]);
  const [apiReachable, setApiReachable] = useState<boolean | null>(null);
  const scanStartRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const recheckApi = () => {
    setApiReachable(null);
    checkApiReachable().then(setApiReachable);
  };

  useEffect(() => {
    checkApiReachable().then(setApiReachable);
  }, []);

  useEffect(() => {
    setHistory(getScanHistory());
  }, []);

  useEffect(() => {
    if (isScanning) {
      setScanProgress(0);
      scanStartRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - scanStartRef.current) / 1000;
        const p = 95 * (1 - Math.exp(-elapsed / 12));
        setScanProgress(Math.min(95, p));
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setScanProgress(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isScanning]);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;
    setIsScanning(true);
    setError(null);
    try {
      const cleaned = domain.trim().replace(/^https?:\/\//, "").split("/")[0];
      const apiBase = getApiBase();
      const url = apiBase
        ? `${apiBase}/api/scan?domain=${encodeURIComponent(cleaned)}`
        : `/api/scan?domain=${encodeURIComponent(cleaned)}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 120000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      let data: unknown;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid response from server");
      }
      if (!res.ok) throw new Error((data as { error?: string })?.error || "Scan failed");
      sessionStorage.setItem("scan_result", JSON.stringify(data));
      router.push("/results");
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.name === "AbortError"
            ? "Request timed out (try a smaller domain)"
            : err.message === "Failed to fetch"
              ? "Cannot reach API. Check your connection or try again later."
              : err.message
          : "Something went wrong";
      setError(msg);
      console.error("Scan error:", err);
    } finally {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setScanProgress(100);
      setTimeout(() => setIsScanning(false), 250);
    }
  };

  return (
    <>
      {/* API warning */}
      {apiReachable === false && (
        <div
          style={{
            marginBottom: "1rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
            borderRadius: "10px",
            border: "1px solid rgba(251, 191, 36, 0.25)",
            backgroundColor: "rgba(251, 191, 36, 0.08)",
            padding: "0.75rem 1rem",
            fontSize: "0.8125rem",
            color: "#fbbf24",
          }}
        >
          <span>
            {getApiBase()
              ? "API unreachable — verify your Vercel deployment is running."
              : "API not configured — set API_BASE secret in repo settings."}
          </span>
          {getApiBase() && (
            <button
              type="button"
              onClick={recheckApi}
              style={{
                padding: "4px 12px",
                borderRadius: "6px",
                border: "1px solid rgba(251, 191, 36, 0.3)",
                backgroundColor: "rgba(251, 191, 36, 0.1)",
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "#fbbf24",
                cursor: "pointer",
              }}
            >
              Retry
            </button>
          )}
        </div>
      )}

      {/* Scan form */}
      <form onSubmit={handleScan}>
        <div
          style={{
            display: "flex",
            overflow: "hidden",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.12)",
            backgroundColor: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(8px)",
            transition: "border-color 0.3s, box-shadow 0.3s",
          }}
        >
          <div
            style={{
              display: "flex",
              flex: 1,
              alignItems: "center",
              gap: "12px",
              paddingLeft: "16px",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6b7280"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ flexShrink: 0 }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Enter domain (e.g. example.com)"
              disabled={isScanning}
              style={{
                width: "100%",
                backgroundColor: "transparent",
                padding: "14px 0",
                fontSize: "0.9375rem",
                color: "#ffffff",
                border: "none",
                outline: "none",
              }}
            />
          </div>
          <button
            type="submit"
            disabled={isScanning}
            style={{
              margin: "6px",
              flexShrink: 0,
              borderRadius: "8px",
              backgroundColor: "#2563eb",
              padding: "10px 24px",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#ffffff",
              border: "none",
              cursor: isScanning ? "not-allowed" : "pointer",
              opacity: isScanning ? 0.6 : 1,
              transition: "background-color 0.2s",
            }}
          >
            {isScanning ? "Scanning..." : "Scan"}
          </button>
        </div>
      </form>

      {/* Recent scans */}
      {history.length > 0 && !isScanning && (
        <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Recent:</span>
          {history.slice(0, 5).map((h) => (
            <button
              key={`${h.domain}-${h.scannedAt}`}
              onClick={() => setDomain(h.domain)}
              style={{
                padding: "4px 10px",
                borderRadius: "6px",
                border: "1px solid rgba(255,255,255,0.1)",
                backgroundColor: "rgba(255,255,255,0.05)",
                fontSize: "0.75rem",
                color: "#9ca3af",
                cursor: "pointer",
              }}
            >
              {h.domain}
            </button>
          ))}
        </div>
      )}

      {/* Progress bar */}
      {isScanning && (
        <div
          style={{
            marginTop: "1.25rem",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.08)",
            backgroundColor: "rgba(255,255,255,0.04)",
            padding: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#ffffff" }}>
              {Math.round(scanProgress)}%
            </span>
            <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
              Scanning attack surface...
            </span>
          </div>
          <div
            style={{
              height: "6px",
              overflow: "hidden",
              borderRadius: "3px",
              backgroundColor: "rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${scanProgress}%`,
                borderRadius: "3px",
                background: "linear-gradient(90deg, #2563eb, #3b82f6)",
                transition: "width 0.15s ease-out",
              }}
            />
          </div>
          <p style={{ marginTop: "10px", fontSize: "0.75rem", color: "#6b7280", margin: "10px 0 0 0" }}>
            Discovering subdomains &rarr; checking DNS &rarr; security headers &rarr; CVEs
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            marginTop: "1rem",
            borderRadius: "10px",
            border: "1px solid rgba(239, 68, 68, 0.25)",
            backgroundColor: "rgba(239, 68, 68, 0.08)",
            padding: "0.75rem 1rem",
            fontSize: "0.8125rem",
            color: "#f87171",
          }}
        >
          {error}
        </div>
      )}

    </>
  );
}
