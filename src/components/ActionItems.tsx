"use client";

import type { ActionItem } from "@/lib/riskScore";

interface ActionItemsProps {
  actions: ActionItem[];
}

const severityColors = {
  critical: "border-red-500/50 bg-red-500/10 text-red-400",
  high: "border-amber-500/50 bg-amber-500/10 text-amber-400",
  medium: "border-yellow-500/50 bg-yellow-500/10 text-yellow-400",
  low: "border-gray-500/50 bg-gray-500/10 text-gray-400",
};

export function ActionItems({ actions }: ActionItemsProps) {
  if (actions.length === 0) {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6">
        <h2 className="text-lg font-semibold text-emerald-400">
          No critical issues found
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          Your attack surface looks good. Keep monitoring for changes and
          maintain security best practices.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-700/50 bg-gray-900/50 p-6">
      <h2 className="text-lg font-semibold text-white">
        Recommended actions ({actions.length})
      </h2>
      <p className="mt-1 text-sm text-gray-400">
        Prioritized list of security improvements
      </p>
      <ul className="mt-4 space-y-3">
        {actions.map((action, i) => (
          <li
            key={action.id}
            className={`rounded-lg border p-4 ${severityColors[action.severity]}`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="rounded px-1.5 py-0.5 text-xs font-medium uppercase">
                {action.severity}
              </span>
              {action.count !== undefined && (
                <span className="text-xs opacity-80">{action.count} found</span>
              )}
            </div>
            <h3 className="mt-2 font-medium">{action.title}</h3>
            <p className="mt-1 text-sm opacity-90">{action.description}</p>
            <p className="mt-2 text-sm font-medium">→ {action.fix}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
