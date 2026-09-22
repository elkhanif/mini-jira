import Link from "next/link";

import { Avatar } from "@/components/ui/Avatar";
import { PriorityBadge } from "@/components/ui/Badge";
import { Issue, ISSUE_STATUS_LABELS } from "@/lib/types";

export function IssueListItem({ issue }: { issue: Issue }) {
  return (
    <Link
      href={`/issues/${issue.id}`}
      className="flex items-center justify-between gap-3 rounded-md border border-border bg-white px-4 py-3 text-sm hover:border-slate-300"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="shrink-0 font-mono text-xs text-slate-400">{issue.issue_key}</span>
        <span className="truncate font-medium text-slate-800">{issue.title}</span>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="text-xs text-slate-500">{ISSUE_STATUS_LABELS[issue.status]}</span>
        <PriorityBadge priority={issue.priority} />
        <Avatar user={issue.assignee} />
      </div>
    </Link>
  );
}
