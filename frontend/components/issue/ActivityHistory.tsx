"use client";

import { useIssueHistory } from "@/hooks/useIssues";
import { IssueHistoryEntry } from "@/lib/types";

function describe(entry: IssueHistoryEntry): string {
  switch (entry.field_changed) {
    case "created":
      return `${entry.actor.name} created this issue (${entry.new_value})`;
    case "status":
      return `${entry.actor.name} changed status from ${entry.old_value} to ${entry.new_value}`;
    case "priority":
      return `${entry.actor.name} changed priority from ${entry.old_value} to ${entry.new_value}`;
    case "assignee":
      return `${entry.actor.name} changed assignee`;
    case "comment_added":
      return `${entry.actor.name} added a comment`;
    default:
      return `${entry.actor.name} updated ${entry.field_changed}`;
  }
}

export function ActivityHistory({ issueId }: { issueId: number }) {
  const { data: history, isLoading } = useIssueHistory(issueId);

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-slate-700">Activity</h2>
      {isLoading && <p className="text-sm text-slate-400">Loading...</p>}
      <ul className="flex flex-col gap-2">
        {history?.map((entry) => (
          <li key={entry.id} className="text-sm text-slate-600">
            <span>{describe(entry)}</span>
            <span className="ml-2 text-xs text-slate-400">
              {new Date(entry.created_at).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
