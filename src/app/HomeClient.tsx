"use client";

import { useState, useEffect } from "react";
import { ScanResult } from "@/components/ScanResult";
import { getScanHistory } from "@/lib/scanHistory";
import type { StoredScan } from "@/lib/scanHistory";
import type { ScanResultData } from "@/types";

export function HomeClient() {
  const [domain, setDomain] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResultData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<StoredScan[]>([]);

  useEffect(() => {
    setHistory(getScanHistory());
  }, [result]);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;
    setIsScanning(true);
    setError(null);
    setResult(null);
    try {
      const cleaned = domain.trim().replace(/^https?:\/\//, "").split("/")[0];
      const res = await fetch(`/api/scan?domain=${encodeURIComponent(cleaned)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Scan failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <>
      <form onSubmit={handleScan} style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Enter domain (e.g. example.com)"
            disabled={isScanning}
            style={{
              flex: 1,
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              border: "1px solid #4b5563",
              background: "rgba(17, 24, 39, 0.5)",
              color: "#ffffff",
              fontSize: "1rem",
            }}
          />
          <button
            type="submit"
            disabled={isScanning}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              background: "#059669",
              color: "white",
              fontWeight: 500,
              border: "none",
              cursor: isScanning ? "not-allowed" : "pointer",
              opacity: isScanning ? 0.6 : 1,
            }}
          >
            {isScanning ? "Scanning..." : "Scan"}
          </button>
        </div>
      </form>

      {history.length > 0 && !result && (
        <div style={{ marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "0.875rem", color: "#9ca3af", marginBottom: "0.5rem" }}>
            Recent scans
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {history.slice(0, 5).map((h) => (
              <button
                key={`${h.domain}-${h.scannedAt}`}
                onClick={() => setDomain(h.domain)}
                style={{
                  padding: "0.375rem 0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #4b5563",
                  background: "rgba(31, 41, 55, 0.5)",
                  color: "#d1d5db",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                {h.domain}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "1px solid rgba(239, 68, 68, 0.5)",
            background: "rgba(239, 68, 68, 0.1)",
            color: "#f87171",
            marginBottom: "1.5rem",
          }}
        >
          {error}
        </div>
      )}

      {result && <ScanResult data={result} />}
    </>
  );
}
