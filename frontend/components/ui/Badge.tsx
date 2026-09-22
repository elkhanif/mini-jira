import clsx from "clsx";

import { IssuePriority, IssueType } from "@/lib/types";

const PRIORITY_STYLES: Record<IssuePriority, string> = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700",
};

const TYPE_STYLES: Record<IssueType, string> = {
  task: "bg-indigo-100 text-indigo-700",
  bug: "bg-red-100 text-red-700",
  story: "bg-emerald-100 text-emerald-700",
};

export function PriorityBadge({ priority }: { priority: IssuePriority }) {
  return (
    <span className={clsx("rounded-full px-2 py-0.5 text-xs font-medium capitalize", PRIORITY_STYLES[priority])}>
      {priority}
    </span>
  );
}

export function TypeBadge({ type }: { type: IssueType }) {
  return (
    <span className={clsx("rounded-full px-2 py-0.5 text-xs font-medium capitalize", TYPE_STYLES[type])}>
      {type}
    </span>
  );
}
