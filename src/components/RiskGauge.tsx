"use client";

export function RiskGauge({
  score,
  grade,
}: {
  score: number;
  grade: string;
}) {
  const color =
    score >= 80
      ? "text-emerald-400"
      : score >= 60
        ? "text-amber-400"
        : "text-red-400";

  const circumference = 2 * Math.PI * 45;
  const strokeDash = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-gray-700"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - strokeDash}
          className={color}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className={`text-4xl font-bold ${color}`}>{score}</div>
      <div className="text-sm text-gray-400">Security Grade: {grade}</div>
    </div>
  );
}
