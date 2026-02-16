"use client";

export function RiskGauge({
  score,
  grade,
}: {
  score: number;
  grade: string;
}) {
  const strokeColor =
    score >= 80
      ? "#059669"
      : score >= 60
        ? "#d97706"
        : "#dc2626";

  const circumference = 2 * Math.PI * 45;
  const strokeDash = (score / 100) * circumference;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
      <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#f3f4f6"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={strokeColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - strokeDash}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div style={{ fontSize: "1.5rem", fontWeight: 700, color: strokeColor, marginTop: "-0.25rem" }}>{score}</div>
      <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>Grade: {grade}</div>
    </div>
  );
}
