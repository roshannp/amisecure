"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ScanResult } from "@/components/ScanResult";
import type { ScanResultData } from "@/types";

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<ScanResultData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("scan_result");
      if (stored) {
        setResult(JSON.parse(stored));
      }
    } catch {
      // invalid data
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9fafb",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              border: "3px solid #e5e7eb",
              borderTopColor: "#2563eb",
              borderRadius: "50%",
              animation: "spin 0.6s linear infinite",
              margin: "0 auto 1rem",
            }}
          />
          <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>Loading results...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9fafb",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "400px", padding: "2rem" }}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#d1d5db"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ margin: "0 auto 1.5rem" }}
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#111827", marginBottom: "0.5rem" }}>
            No scan results
          </h2>
          <p style={{ color: "#6b7280", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
            Run a scan from the homepage first to see results here.
          </p>
          <button
            onClick={() => router.push("/")}
            style={{
              padding: "0.625rem 1.5rem",
              borderRadius: "8px",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              fontSize: "0.875rem",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
            }}
          >
            Go to Scanner
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      {/* Sticky top bar */}
      <header
        style={{
          borderBottom: "1px solid #e5e7eb",
          backgroundColor: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(8px)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0.75rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={() => router.push("/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#111827", letterSpacing: "0.025em" }}>
              AM I SECURE
            </span>
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span
              style={{
                fontSize: "0.8125rem",
                color: "#374151",
                fontWeight: 500,
                padding: "0.25rem 0.75rem",
                borderRadius: "6px",
                backgroundColor: "#f3f4f6",
                border: "1px solid #e5e7eb",
                fontFamily: "monospace",
              }}
            >
              {result.domain}
            </span>
            <button
              onClick={() => router.push("/")}
              style={{
                padding: "0.4375rem 0.875rem",
                borderRadius: "8px",
                backgroundColor: "#111827",
                color: "#ffffff",
                fontSize: "0.8125rem",
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
              }}
            >
              + New Scan
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "1.5rem 1.5rem 4rem",
        }}
      >
        <div style={{ marginBottom: "1.25rem" }}>
          <h1 style={{ fontSize: "1.375rem", fontWeight: 700, color: "#111827", margin: 0 }}>
            Security Report
          </h1>
          <p style={{ color: "#6b7280", fontSize: "0.8125rem", marginTop: "0.25rem" }}>
            Results for <strong style={{ color: "#111827" }}>{result.domain}</strong>
            {result.scannedAt && (
              <> &middot; {new Date(result.scannedAt).toLocaleString()}</>
            )}
          </p>
        </div>

        <ScanResult data={result} />
      </main>
    </div>
  );
}
