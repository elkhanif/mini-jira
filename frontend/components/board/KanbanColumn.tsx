"use client";

import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";

import { IssueCard } from "@/components/board/IssueCard";
import { Issue, IssueStatus, ISSUE_STATUS_LABELS } from "@/lib/types";

export function KanbanColumn({ status, issues }: { status: IssueStatus; issues: Issue[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        "flex w-72 shrink-0 flex-col gap-3 rounded-lg border border-border bg-surface p-3",
        isOver && "ring-2 ring-slate-900"
      )}
    >
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-slate-700">{ISSUE_STATUS_LABELS[status]}</h3>
        <span className="text-xs text-slate-400">{issues.length}</span>
      </div>
      <div className="flex flex-col gap-2">
        {issues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
        {issues.length === 0 && (
          <p className="rounded-md border border-dashed border-border p-4 text-center text-xs text-slate-400">
            No issues
          </p>
        )}
      </div>
    </div>
  );
}
