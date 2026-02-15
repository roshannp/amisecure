"use client";

import { useState } from "react";
import { ScanResult } from "@/components/ScanResult";
import { getScanHistory } from "@/lib/scanHistory";

export default function Home() {
  const [domain, setDomain] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResultData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const history = getScanHistory();

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;

    setIsScanning(true);
    setError(null);
    setResult(null);

    try {
      const cleaned = domain.trim().replace(/^https?:\/\//, "").split("/")[0];
      const res = await fetch(
        `/api/scan?domain=${encodeURIComponent(cleaned)}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Scan failed");
      }
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsScanning(false);
    }
  };

  const handleHistoryClick = (d: string) => {
    setDomain(d);
    setError(null);
  };

  return (
    <main className="min-h-screen px-4 py-12 md:py-20">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Secureasy
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Attack surface visibility for small businesses
          </p>
        </header>

        {/* Search */}
        <form onSubmit={handleScan} className="mb-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Enter domain (e.g. example.com)"
              className="flex-1 rounded-lg border border-gray-600 bg-gray-900/50 px-4 py-3 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              disabled={isScanning}
            />
            <button
              type="submit"
              disabled={isScanning}
              className="rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isScanning ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Scanning...
                </span>
              ) : (
                "Scan"
              )}
            </button>
          </div>
        </form>

        {/* Progress bar when scanning */}
        {isScanning && (
          <div className="mb-6 overflow-hidden rounded-full bg-gray-800">
            <div className="h-1 w-full animate-pulse bg-emerald-500/50" />
          </div>
        )}

        {/* Scan history */}
        {history.length > 0 && !result && (
          <div className="mb-6">
            <p className="mb-2 text-sm text-gray-400">Recent scans</p>
            <div className="flex flex-wrap gap-2">
              {history.slice(0, 5).map((h) => (
                <button
                  key={`${h.domain}-${h.scannedAt}`}
                  onClick={() => handleHistoryClick(h.domain)}
                  className="rounded-lg border border-gray-600 bg-gray-800/50 px-3 py-1.5 text-sm text-gray-300 transition hover:border-emerald-500/50 hover:bg-gray-800 hover:text-emerald-400"
                >
                  {h.domain}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-red-400">
            {error}
          </div>
        )}

        {/* Results */}
        {result && <ScanResult data={result} />}
      </div>
    </main>
  );
}

export interface SecurityHeadersResult {
  hsts: { present: boolean; value?: string };
  csp: { present: boolean; value?: string };
  xFrameOptions: { present: boolean; value?: string };
  xContentTypeOptions: { present: boolean; value?: string };
  referrerPolicy: { present: boolean; value?: string };
  permissionsPolicy: { present: boolean; value?: string };
  score: number;
}

export interface ScanResultData {
  domain: string;
  subdomains: SubdomainInfo[];
  dns: DnsInfo;
  scanTime: number;
  scannedAt?: string;
  rootSecurityHeaders?: SecurityHeadersResult;
}

export interface SubdomainInfo {
  name: string;
  ips: string[];
  hasCert: boolean;
  certExpiry?: string;
  certValid: boolean;
  securityHeaders?: SecurityHeadersResult;
  technologies?: string[];
}

export interface DnsInfo {
  a: string[];
  aaaa: string[];
  mx: string[];
  txt: string[];
  cname: string[];
}
