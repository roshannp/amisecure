#!/usr/bin/env node
/**
 * Build static export for GitHub Pages. API routes are excluded (host elsewhere, e.g. Vercel).
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const appDir = path.join(__dirname, "..", "src", "app");
const apiDir = path.join(appDir, "api");
const apiBackup = path.join(appDir, "_api_backup");

// Move api out so static export succeeds
if (fs.existsSync(apiDir)) {
  fs.renameSync(apiDir, apiBackup);
}

try {
  execSync("npm run build", {
    stdio: "inherit",
    cwd: path.join(__dirname, ".."),
    env: {
      ...process.env,
      BUILD_FOR_PAGES: "1",
      NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE || "",
    },
  });
} finally {
  // Restore api
  if (fs.existsSync(apiBackup)) {
    if (fs.existsSync(apiDir)) fs.rmSync(apiDir, { recursive: true });
    fs.renameSync(apiBackup, apiDir);
  }
}
